/* eslint-disable  no-restricted-globals */
import TreeSelectInput, {
  TreeSelectProps as SelectProps,
} from 'antd/lib/tree-select';
import classNames from 'classnames';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import traverse from 'traverse';

import {getPlaceholder, InputChangeHandler} from './Input';
import {InputContainer} from './InputContainer';

interface CommonDataNode<V extends Key> {
  title?: React.ReactNode;
  label?: React.ReactNode;
  disabled?: boolean;
  disableCheckbox?: boolean;
  checkable?: boolean;
  selectable?: boolean;
  value: V;
  className?: string;
  [key: string]: any;
}

export interface SimpleDataNode<V extends Key, T extends Key = V>
  extends CommonDataNode<V> {
  id?: T;
  pId?: T;
  rootPId?: T;
  isLeaf?: boolean;
}

export interface TreeDataNode<V extends Key> extends CommonDataNode<V> {
  children?: TreeDataNode<V>[];
}

export interface SimpleModeConfig {
  id?: string;
  pId?: string;
  rootPId?: string;
}

type TreeSelectCallback<V extends Key, T extends Key = V> = (
  value: V,
  node: SimpleDataNode<V, T>,
) => void;

export type TreeSelectProps<V extends Key, T extends Key = V> = Omit<
  SelectProps<V>,
  | 'treeData'
  | 'onChange'
  | 'treeDataSimpleMode'
  | 'loadData'
  | 'placeholder'
  | 'value'
> & {
  onChange?: InputChangeHandler<V>;
  onSelect?: TreeSelectCallback<V, T>;
  name: string;
  key?: string;
  placeholder?: string;
  required?: boolean;
  withContainer?: boolean;
  value?: V;
  disabledValues?: V[];
} & (
    | {
        treeDataSimpleMode: true | SimpleModeConfig;
        treeData?: SimpleDataNode<V, T>[];
        loadData?: (node: SimpleDataNode<V, T>) => Promise<unknown>;
      }
    | {
        treeDataSimpleMode?: false;
        treeData?: TreeDataNode<V>[];
        loadData?: (node: TreeDataNode<V>) => Promise<unknown>;
      }
  );

function useSimplifyTreeData<V extends Key, T extends Key = V>(
  treeDataSimpleMode?: boolean | SimpleModeConfig,
  treeData?: SimpleDataNode<V, T>[] | TreeDataNode<V>[],
): Maybe<SimpleDataNode<V, T>[]> {
  return useMemo(() => {
    if (!treeDataSimpleMode) {
      if (!treeData) {
        return treeData;
      }

      return traverse(treeData).reduce(function (result: SimpleDataNode<V>[]) {
        if (typeof this.node === 'object' && !(this.node instanceof Array)) {
          result.push({
            id: this.node.value,
            pId: this.parent?.isRoot
              ? undefined
              : this.parent?.parent?.node.value,
            ...this.node,
          });
        }
        return result;
      }, []);
    } else {
      return treeData;
    }
  }, [treeData, treeDataSimpleMode]);
}

function useDefaultExpandedKeys<V extends Key, T extends Key = V>(
  treeDataSimpleMode: boolean | SimpleModeConfig | undefined,
  treeData?: SimpleDataNode<V, T>[],
  value?: V,
): V[] {
  const isRootLoaded = !!treeData;

  return useMemo(() => {
    if (!treeData || !value) {
      return [];
    }

    const idKey =
      typeof treeDataSimpleMode === 'object' && treeDataSimpleMode.id
        ? treeDataSimpleMode.id
        : 'id';
    const pIdKey =
      typeof treeDataSimpleMode === 'object' && treeDataSimpleMode.pId
        ? treeDataSimpleMode.pId
        : 'pId';

    const flattenTreeData = _.keyBy(treeData, idKey);

    let currentNode = _.find(treeData, (node) => node.value === value);

    if (!currentNode) {
      return [];
    }

    const defaultExpandedKeys: V[] = [];

    while (true) {
      const parentId: string = currentNode[pIdKey];

      defaultExpandedKeys.push(currentNode.value);
      currentNode = flattenTreeData[parentId];

      if (!parentId || !currentNode) {
        break;
      }
    }

    return defaultExpandedKeys;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRootLoaded]);
}

const TreeSelect = <V extends Key, T extends Key = V>(
  props: TreeSelectProps<V, T>,
) => {
  const {
    onChange,
    name,
    treeData: passedTreeData,
    treeDataSimpleMode,
    value,
    loadData,
    placeholder,
    withContainer,
    required,
    loading,
    disabledValues,
    ...rest
  } = props;

  const rawTreeData = useSimplifyTreeData(treeDataSimpleMode, passedTreeData);

  const defaultExpandedKeys = useDefaultExpandedKeys<V, T>(
    treeDataSimpleMode || true,
    rawTreeData,
    value,
  );

  const [treeData, selectedNode] = useMemo(() => {
    const selectedNode = _.find(rawTreeData, (node) => node.value === value);
    const parentNode = selectedNode
      ? _.find(rawTreeData, (node) => node.id === selectedNode.pId)
      : undefined;

    if (
      !value ||
      !rawTreeData ||
      !selectedNode ||
      !selectedNode.pId ||
      parentNode
    ) {
      return [rawTreeData, undefined];
    }

    const filteredTreeData = _.filter(
      rawTreeData,
      (node) => node.value !== value,
    );

    return [filteredTreeData, selectedNode];
  }, [rawTreeData, value]);

  const filteredTreeData = useMemo(() => {
    return disabledValues
      ? _.map(treeData, (node) => {
          const isSelected = _.indexOf(disabledValues, node.value) >= 0;

          if (node.value === value || !isSelected) {
            return node;
          }

          return {
            ...node,
            disabled: true,
          };
        })
      : treeData;
  }, [disabledValues, treeData, value]);

  const mappedTreeData = useMemo(() => {
    return !filteredTreeData
      ? filteredTreeData
      : filteredTreeData.map((node) => ({
          ...node,
          className: classNames(node.className, {
            'ant-select-tree-treenode--selectable': node.selectable !== false,
            'ant-select-tree-treenode--disabled': node.disabled,
          }),
        }));
  }, [filteredTreeData]);

  const changeCallback = useMemo(
    () =>
      onChange
        ? (value: V) => {
            onChange(value, name);
          }
        : undefined,
    [name, onChange],
  );

  const elementRef = useRef<HTMLDivElement>(null);

  const getPopupContainer = useCallback(
    (trigger) => trigger.parentNode.parentNode,
    [],
  );

  useEffect(() => {
    const element = elementRef.current;
    const input = element?.querySelector<HTMLInputElement>('input');

    if (input) {
      input.name = name;
      input.required = required || false;
    }
  }, [name, required]);

  const hasData = value === undefined || treeData !== undefined;

  const suffixIcon = () => <i className="icon-angle-down" />;
  const clearIcon = <i className="icon-close" />;
  const switcherIcon = <i className="icon-angle-down" />;
  const noDataPlaceholder = (
    <div className="ant-select-dropdown__no-data">Нет опций</div>
  );
  const formattedPlaceholder = getPlaceholder(placeholder, required);
  const loadingPlaceholder = <div className="spinner-border" />;
  const placeholderElement = loading ? (
    loadingPlaceholder
  ) : selectedNode ? (
    selectedNode.title
  ) : (
    <div className="ant-select-placeholder">
      {withContainer ? 'Не выбрано' : formattedPlaceholder}
    </div>
  );

  const input = (
    <div className="ant-select-container" ref={elementRef}>
      <TreeSelectInput<V>
        showSearch
        listHeight={200}
        onChange={changeCallback}
        suffixIcon={suffixIcon}
        switcherIcon={switcherIcon}
        clearIcon={clearIcon}
        showCheckedStrategy={TreeSelectInput.SHOW_ALL}
        getPopupContainer={getPopupContainer}
        dropdownStyle={{
          minWidth: '100%',
        }}
        treeDefaultExpandedKeys={defaultExpandedKeys}
        treeData={mappedTreeData}
        treeDataSimpleMode={treeDataSimpleMode}
        notFoundContent={noDataPlaceholder}
        treeNodeFilterProp="title"
        value={
          loading || !hasData ? undefined : selectedNode ? undefined : value
        }
        loadData={loadData as any}
        loading={loading}
        placeholder={placeholderElement}
        {...rest}
      />
    </div>
  );

  return withContainer ? (
    <InputContainer placeholder={placeholder} required={required}>
      {input}
    </InputContainer>
  ) : (
    input
  );
};

TreeSelect.defaultProps = {
  withContainer: true,
};

export default TreeSelect;
