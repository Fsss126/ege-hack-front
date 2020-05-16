import {Tree} from 'antd';
import {DropdownIconButton} from 'components/common/DropdownMenu';
import {ContentBlock} from 'components/layout/ContentBlock';
import {useKnowLedgeTree} from 'hooks/selectors';
import {DataNode} from 'rc-tree/lib/interface';
import React from 'react';
import {SubjectInfo} from 'types/entities';
import {KnowledgeTreeEntity, TreeEntityType} from 'types/knowledgeTree';

import {renderIcon} from '../tests/TaskSelect';
import {useLoadThemeLevel} from '../themes/ThemeSelect';

interface TreeCatalogProps {
  subjects: SubjectInfo[];
}

type TreeEntityNode = KnowledgeTreeEntity & DataNode;

export const mapNodeData = (entity: KnowledgeTreeEntity): TreeEntityNode =>
  ({
    ...entity,
    isLeaf: entity.type === TreeEntityType.TASK,
    key: entity.id,
    icon: renderIcon,
    className: 'list__item list__item-selectable list__item-plain',
    title: (
      <div className="container p-0 overflow-hidden">
        <div className="row">
          <div className="col">{entity.entity.name}</div>
          <div className="col-auto">
            <DropdownIconButton className="icon-ellipsis" />
          </div>
        </div>
      </div>
    ),
  } as TreeEntityNode);

export const KnowledgeCatalog = (props: TreeCatalogProps) => {
  const {subjects} = props;
  const {tree, loadedEntities} = useKnowLedgeTree(subjects, mapNodeData);
  const loadData = useLoadThemeLevel();

  return (
    <ContentBlock>
      <Tree
        switcherIcon={<i className="icon-angle-down" />}
        prefixCls="ant-select-tree"
        className="list"
        showIcon
        treeData={tree as any}
        loadData={loadData as any}
        loadedKeys={loadedEntities}
      />
    </ContentBlock>
  );
};
