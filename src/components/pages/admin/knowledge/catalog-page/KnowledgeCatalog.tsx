import {Tree} from 'antd';
import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from 'components/common/DropdownMenu';
import {useCheckPermissions} from 'components/ConditionalRender';
import {ContentBlock} from 'components/layout/ContentBlock';
import {
  DeleteKnowledgeTaskHookResult,
  DeleteKnowledgeThemeHookResult,
  useDeleteKnowledgeTask,
  useDeleteKnowledgeTheme,
  useKnowLedgeTree,
} from 'hooks/selectors';
import {DataNode} from 'rc-tree/lib/interface';
import React, {useCallback} from 'react';
import {Link} from 'react-router-dom';
import {SubjectInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {KnowledgeTreeEntity, TreeEntityType} from 'types/knowledgeTree';

import {renderIcon} from '../tests/TaskSelect';
import {useLoadThemeLevel} from '../themes/ThemeSelect';

interface TreeCatalogProps {
  subjects: SubjectInfo[];
}

type TreeEntityNode = KnowledgeTreeEntity & DataNode;

interface TreeElementContentProps {
  entity: KnowledgeTreeEntity;
  canEdit?: boolean;
  onDeleteTheme: DeleteKnowledgeThemeHookResult;
  onDeleteTask: DeleteKnowledgeTaskHookResult;
}
const TreeElementContent = (props: TreeElementContentProps) => {
  const {entity, canEdit, onDeleteTask, onDeleteTheme} = props;

  let menu;

  const root = `..`;

  switch (entity.type) {
    case TreeEntityType.SUBJECT: {
      const {
        entity: {id},
      } = entity;

      const createChildrenLink = `${root}/${id}/`;

      menu = (
        <DropdownMenu
          content={<DropdownIconButton className="icon-ellipsis" />}
        >
          <DropdownMenuOption
            component={Link}
            to={`${createChildrenLink}theme/create/`}
          >
            <i className="icon-add" />
            Добавить подтему
          </DropdownMenuOption>
          <DropdownMenuOption
            component={Link}
            to={`${createChildrenLink}task/create/`}
          >
            <i className="icon-add" />
            Добавить задачу
          </DropdownMenuOption>
        </DropdownMenu>
      );
      break;
    }
    case TreeEntityType.THEME: {
      const {
        entity: {subject_id, id, parent_theme_id},
      } = entity;

      const themeLink = `${root}/${subject_id}/theme/${id}/`;
      const createChildrenLink = `${root}/${subject_id}/${id}/`;

      const deleteCallback = (): void => {
        onDeleteTheme(subject_id, id, parent_theme_id);
      };

      menu = (
        <DropdownMenu
          content={<DropdownIconButton className="icon-ellipsis" />}
        >
          <DropdownMenuOption component={Link} to={`${themeLink}edit/`}>
            <i className="far fa-edit" />
            Изменить
          </DropdownMenuOption>
          <DropdownMenuOption onClick={deleteCallback}>
            <i className="icon-close" />
            Удалить
          </DropdownMenuOption>
          <DropdownMenuOption
            component={Link}
            to={`${createChildrenLink}theme/create/`}
          >
            <i className="icon-add" />
            Добавить подтему
          </DropdownMenuOption>
          <DropdownMenuOption
            component={Link}
            to={`${createChildrenLink}task/create/`}
          >
            <i className="icon-add" />
            Добавить задачу
          </DropdownMenuOption>
        </DropdownMenu>
      );
      break;
    }
    case TreeEntityType.TASK: {
      const {
        entity: {id, theme_id, subject_id},
      } = entity;

      const taskLink = `${root}/${subject_id}/task/${id}/`;

      const deleteCallback = (): void => {
        onDeleteTask(subject_id, id, theme_id);
      };

      menu = (
        <DropdownMenu
          content={<DropdownIconButton className="icon-ellipsis" />}
        >
          <DropdownMenuOption component={Link} to={`${taskLink}edit/`}>
            <i className="far fa-edit" />
            Изменить
          </DropdownMenuOption>
          <DropdownMenuOption onClick={deleteCallback}>
            <i className="icon-close" />
            Удалить
          </DropdownMenuOption>
        </DropdownMenu>
      );
    }
  }

  return (
    <div className="container p-0">
      <div className="row">
        <div className="col">{entity.entity.name}</div>
        {canEdit && <div className="col-auto">{menu}</div>}
      </div>
    </div>
  );
};

export const KnowledgeCatalog = (props: TreeCatalogProps) => {
  const {subjects} = props;

  const onDeleteTheme = useDeleteKnowledgeTheme();
  const onDeleteTask = useDeleteKnowledgeTask();

  const canEdit = useCheckPermissions(Permission.KNOWLEDGE_CONTENT_EDIT);

  const mapNodeData = useCallback(
    (entity: KnowledgeTreeEntity): TreeEntityNode =>
      ({
        ...entity,
        isLeaf: entity.type === TreeEntityType.TASK,
        key: entity.id,
        icon: renderIcon,
        className: 'list__item list__item-selectable list__item-plain',
        title: (
          <TreeElementContent
            entity={entity}
            canEdit={canEdit}
            onDeleteTask={onDeleteTask}
            onDeleteTheme={onDeleteTheme}
          />
        ),
      } as TreeEntityNode),
    [canEdit, onDeleteTask, onDeleteTheme],
  );

  const {tree, loadedEntities} = useKnowLedgeTree(subjects, mapNodeData);
  const loadData = useLoadThemeLevel();

  return (
    <ContentBlock stacked>
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
