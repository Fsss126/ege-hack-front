import {Tree} from 'antd';
import {TreeProps} from 'antd/lib/tree';
import classNames from 'classnames';
import {ContentBlock} from 'components/layout/ContentBlock';
import _ from 'lodash';
import {DataNode} from 'rc-tree/lib/interface';
import React, {useCallback, useEffect, useState} from 'react';

import {OptionShape} from '../ui/input/Select';
import Catalog, {
  FilterContextState,
  FilterFunc,
  FilterParams,
  FilterProps,
  useFilterParams,
} from './Catalog';

export type TreeCatalogContextState = FilterContextState & {
  tree: any[];
  items: any[];
  expandedKeys: (string | number)[];
  onExpand: (keys: (string | number)[]) => void;
};

export const CatalogContext = React.createContext<TreeCatalogContextState>(
  undefined as any,
);
CatalogContext.displayName = 'CatalogContext';

const Filter: React.FC<FilterProps> = (props) => {
  return (
    <Catalog.Filter
      {...props}
      context={(CatalogContext as unknown) as React.Context<FilterContextState>}
    />
  );
};

export type CatalogProps<T extends DataNode = DataNode> = Omit<
  TreeProps,
  'switcherIcon' | 'prefixCls' | 'treeData'
> & {
  emptyPlaceholder: React.ReactNode;
  context?: React.Context<{
    tree: T[];
    expandedKeys: T['key'][];
    onExpand: (keys: T['key'][]) => void;
  }>;
  tree?: T[];
  title?: React.ReactNode;
  titleInside?: boolean;
  stacked?: boolean;
  filter?: React.ReactNode;
};
const TreeCatalog = <T extends CatalogTreeNode>(
  props: CatalogProps<T>,
): React.ReactElement => {
  const {
    emptyPlaceholder,
    title,
    titleInside,
    context,
    children,
    filter,
    stacked,
    tree: passedTree,
    expandedKeys: passedExpandedKeys,
    onExpand: passedOnExpand,
    ...treeProps
  } = props;
  const contextState = React.useContext(
    context ||
      ((CatalogContext as unknown) as React.Context<{
        tree: T[];
        expandedKeys: T['key'][];
        onExpand: (keys: T['key'][]) => void;
      }>),
  );

  let tree;
  let expandedKeys;
  let onExpand;

  if (passedTree) {
    ({tree, expandedKeys, onExpand} = {
      tree: passedTree,
      expandedKeys: passedExpandedKeys,
      onExpand: passedOnExpand,
    });
  } else {
    ({tree, expandedKeys, onExpand} = contextState);
  }

  const isEmpty = tree.length === 0;

  return (
    <ContentBlock
      title={title}
      outerContent={filter}
      titleInside={titleInside}
      stacked={stacked}
      className={classNames('catalog__catalog', {
        'catalog__catalog--empty': isEmpty,
      })}
    >
      {!isEmpty ? (
        <Tree
          switcherIcon={<i className="icon-angle-down" />}
          prefixCls="ant-select-tree"
          className="list"
          showIcon
          treeData={tree}
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          {...treeProps}
        />
      ) : (
        <div className="catalog__empty-catalog-fallback-message text-center font-size-sm">
          {emptyPlaceholder}
        </div>
      )}
    </ContentBlock>
  );
};

const getParentKey = <T extends CatalogTreeNode>(
  key: T['key'],
  tree: T[],
): Maybe<T['key']> => {
  let parentKey;
  for (const node of tree) {
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

export interface CatalogTreeNode extends DataNode {
  filtered?: boolean;
  filterParams?: FilterParams;
  children?: this[];
}

export type CatalogBodyProps<T extends CatalogTreeNode> = {
  options?: OptionShape<number>[];
  tree: T[];
  items: T[];
  children?: React.ReactNode;
  filter: FilterFunc<T>;
};
const Body = <T extends CatalogTreeNode>(
  props: CatalogBodyProps<T>,
): React.ReactElement => {
  const {options, tree, items, children, filter} = props;
  const filterParams = useFilterParams();
  const {subject, online, search} = filterParams;

  const loop = useCallback(
    (items: T[]): T[] =>
      _.map(items, (item) => {
        const filtered = !filter(item, filterParams);

        if (item.children) {
          return {
            ...item,
            filtered,
            disabled: filtered,
            filterParams,
            children: loop(item.children),
          };
        }

        return {
          ...item,
          filtered,
          disabled: filtered,
          filterParams,
        };
      }),
    [filter, filterParams],
  );

  const [expandedKeys, setExpandedKeys] = useState<T['key'][]>([]);

  useEffect(() => {
    // TODO: traverse up to the root
    const expandedKeys = items
      .map((item) => {
        if (filter(item, filterParams)) {
          return getParentKey(item.key, tree);
        }
        return undefined;
      })
      .filter((key): key is T['key'] => key !== undefined);

    setExpandedKeys(expandedKeys);
    // eslint-disable-next-line
  }, [filter, filterParams]);

  return (
    <CatalogContext.Provider
      value={{
        options,
        subject,
        online,
        search,
        tree: loop(tree),
        items,
        expandedKeys,
        onExpand: setExpandedKeys,
      }}
    >
      <div className="catalog">{children}</div>
    </CatalogContext.Provider>
  );
};

export default {
  Filter,
  Catalog: TreeCatalog,
  Body,
};
