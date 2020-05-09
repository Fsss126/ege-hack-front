/* eslint-disable  no-restricted-globals */
import Select, {TreeSelectProps as SelectProps} from 'antd/lib/tree-select';
import classNames from 'classnames';
import React, {useCallback, useMemo} from 'react';
import traverse from 'traverse';

import {InputChangeHandler} from './Input';

interface CommonDataNode<V extends Key> {
  title?: React.ReactNode;
  label?: React.ReactNode;
  disabled?: boolean;
  disableCheckbox?: boolean;
  checkable?: boolean;
  value: V;
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

type TreeSelectProps<V extends Key, T extends Key = V> = Omit<
  SelectProps<V>,
  'treeData' | 'onChange' | 'treeDataSimpleMode' | 'loadData'
> & {
  onChange: InputChangeHandler<V>;
  name: string;
  key?: string;
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

function useDefaultExpandedKeys<V extends Key, T extends Key = V>(
  treeDataSimpleMode: false | undefined,
  treeData?: TreeDataNode<V>[],
  value?: V,
): V[];
function useDefaultExpandedKeys<V extends Key, T extends Key = V>(
  treeDataSimpleMode: true | SimpleModeConfig,
  treeData?: SimpleDataNode<V, T>[],
  value?: V,
): V[];
function useDefaultExpandedKeys<V extends Key, T extends Key = V>(
  treeDataSimpleMode: boolean | SimpleModeConfig | undefined,
  treeData?: SimpleDataNode<V, T>[] | TreeDataNode<V>[],
  value?: V,
): V[] {
  return useMemo(() => {
    if (!treeData || !value) {
      return [];
    }

    let flattenTreeData: Dictionary<SimpleDataNode<V, T>>;

    if (!treeDataSimpleMode) {
      flattenTreeData = traverse(treeData).reduce(function (
        result: SimpleDataNode<V>[],
      ) {
        if (typeof this.node === 'object' && !(this.node instanceof Array)) {
          result[this.node.value] = {
            id: this.node.value,
            pId: this.parent?.isRoot
              ? undefined
              : this.parent?.parent?.node.value,
            value: this.node.value,
          };
        }
        return result;
      },
      {});
    } else {
      flattenTreeData = _.keyBy(treeData as SimpleDataNode<V, T>[], 'value');
    }

    let currentNode = flattenTreeData[value.toString()];

    const defaultExpandedKeys: V[] = [];

    while (true) {
      const parentId =
        typeof treeDataSimpleMode === 'object' && treeDataSimpleMode.pId
          ? currentNode[treeDataSimpleMode.pId]
          : currentNode.pId;

      defaultExpandedKeys.push(currentNode.value);
      currentNode = flattenTreeData[parentId];

      if (!parentId) {
        break;
      }
    }

    return defaultExpandedKeys;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

const TreeSelect = <V extends Key, T extends Key = V>(
  props: TreeSelectProps<V, T>,
) => {
  const {
    onChange,
    name,
    key,
    treeData,
    treeDataSimpleMode,
    value,
    loadData,
    ...rest
  } = props;

  const defaultExpandedKeys = useDefaultExpandedKeys<V, T>(
    treeDataSimpleMode as any,
    treeData,
    value,
  );

  const changeCallback = useCallback(
    (value: V) => {
      onChange(value, name);
    },
    [name, onChange],
  );

  const dropdownContainerId = classNames('ant-select-dropdown-container', key);

  const getPopupContainer = useCallback(
    () => document.getElementById(dropdownContainerId) as HTMLDivElement,
    [dropdownContainerId],
  );

  const icon = <i className="icon-angle-down" />;

  return (
    <div className="ant-select-container">
      <div className="ant-select-dropdown-container" id={dropdownContainerId} />
      <Select<V>
        showSearch
        listHeight={200}
        onChange={changeCallback}
        suffixIcon={icon}
        switcherIcon={icon}
        showCheckedStrategy={Select.SHOW_ALL}
        getPopupContainer={getPopupContainer}
        dropdownStyle={{
          minWidth: '100%',
        }}
        treeDefaultExpandedKeys={defaultExpandedKeys}
        treeData={treeData}
        treeDataSimpleMode={treeDataSimpleMode}
        value={value}
        loadData={loadData as any}
        {...rest}
      />
    </div>
  );
};

export default TreeSelect;
