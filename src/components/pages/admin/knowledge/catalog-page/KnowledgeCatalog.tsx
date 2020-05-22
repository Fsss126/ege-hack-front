import {FilterFunc} from 'components/common/Catalog';
import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from 'components/common/DropdownMenu';
import TreeCatalog, {CatalogTreeNode} from 'components/common/TreeCatalog';
import {useCheckPermissions} from 'components/ConditionalRender';
import {
  DeleteKnowledgeTaskHookResult,
  DeleteKnowledgeThemeHookResult,
  useDeleteKnowledgeTask,
  useDeleteKnowledgeTheme,
  useKnowLedgeTree,
} from 'hooks/selectors';
import React, {useCallback, useMemo} from 'react';
import {Link} from 'react-router-dom';
import {SubjectInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {KnowledgeTreeEntity, TreeEntityType} from 'types/knowledgeTree';

import {renderIcon} from '../tests/TaskSelect';
import {useLoadThemeLevel} from '../themes/ThemeSelect';

const filterBy = {
  search: true,
  subject: false,
  online: false,
};

type TreeEntityNode = KnowledgeTreeEntity & CatalogTreeNode;

interface TreeElementContentProps {
  entity: KnowledgeTreeEntity;
  url: string;
  filtered?: boolean;
  canEdit?: boolean;
  onDeleteTheme: DeleteKnowledgeThemeHookResult;
  onDeleteTask: DeleteKnowledgeTaskHookResult;
}
const TreeElementContent = (props: TreeElementContentProps) => {
  const {entity, url: root, canEdit, onDeleteTask, onDeleteTheme} = props;

  let menu;

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

const filter: FilterFunc<TreeEntityNode> = (entity, params) => {
  const {search} = params;

  return entity.entity.name.includes(search);
};

interface TreeCatalogProps {
  subjects: SubjectInfo[];
  header?: React.ReactNode;
  url: string;
}

export const KnowledgeCatalog = (props: TreeCatalogProps) => {
  const {subjects, header, url} = props;

  const onDeleteTheme = useDeleteKnowledgeTheme();
  const onDeleteTask = useDeleteKnowledgeTask();

  const canEdit = useCheckPermissions(Permission.KNOWLEDGE_CONTENT_EDIT);

  const mapNodeData = useCallback(
    (entity: KnowledgeTreeEntity) => {
      const node = {
        ...entity,
        isLeaf:
          entity.type === TreeEntityType.TASK
            ? true
            : entity.type === TreeEntityType.THEME
            ? !entity.entity.has_sub_tasks && !entity.entity.has_sub_themes
            : false,
        key: entity.id,
        icon: renderIcon,
        className: 'list__item list__item-selectable list__item-plain',
      } as TreeEntityNode;

      node.title = (
        <TreeElementContent
          entity={entity}
          filtered={node.filtered}
          url={url}
          canEdit={canEdit}
          onDeleteTask={onDeleteTask}
          onDeleteTheme={onDeleteTheme}
        />
      );

      return node;
    },
    [canEdit, onDeleteTask, onDeleteTheme, url],
  );

  const {tree, loadedEntities, entitiesMap} = useKnowLedgeTree(
    subjects,
    mapNodeData,
  );
  const loadData = useLoadThemeLevel();
  const entitiesList = useMemo(() => _.values(entitiesMap), [entitiesMap]);

  return (
    <TreeCatalog.Body tree={tree} items={entitiesList} filter={filter}>
      {header}
      <TreeCatalog.Filter filterBy={filterBy} />
      <TreeCatalog.Catalog
        loadedKeys={loadedEntities}
        loadData={loadData as any}
        emptyPlaceholder="В базе нет предметов"
      />
    </TreeCatalog.Body>
  );
};
