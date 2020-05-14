import {Tree} from 'antd';
import React from 'react';

import Catalog, {
  CatalogBodyProps,
  CatalogProps,
  FilterFunc,
  FilterParams,
} from './Catalog';

const treeData = [
  {
    title: 'parent 0',
    key: '0-0',
    children: [
      {title: 'leaf 0-0', key: '0-0-0', isLeaf: true},
      {title: 'leaf 0-1', key: '0-0-1', isLeaf: true},
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      {title: 'leaf 1-0', key: '0-1-0', isLeaf: true},
      {title: 'leaf 1-1', key: '0-1-1', isLeaf: true},
    ],
  },
];

export const TreeCatalog: React.FC = () => {
  return <Tree.DirectoryTree multiple defaultExpandAll treeData={treeData} />;
};
