import Catalog, {
  CatalogItemRenderer,
  FilterFunc,
} from 'components/common/Catalog';
import CoverImage from 'components/common/CoverImage';
import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from 'components/common/DropdownMenu';
import ListItem from 'components/common/ListItem';
import {useCheckPermissions} from 'components/ConditionalRender';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import Button from 'components/ui/Button';
import {ADMIN_ROLES} from 'definitions/constants';
import {useDeleteSubject, useSubjects} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {Link} from 'react-router-dom';
import {SubjectInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {RouteComponentPropsWithPath, SubjectPageParams} from 'types/routes';

const filterBy = {
  search: true,
  subject: false,
  online: false,
};

const filter: FilterFunc<SubjectInfo> = ({name}, {search}) => {
  const subjectName = name.toLowerCase().replace(/\s/g, '');
  const searchKey = search.toLowerCase().replace(/\s/g, '');

  return search ? subjectName.includes(searchKey) : true;
};

export type SubjectCatalogPageProps = RouteComponentPropsWithPath<
  SubjectPageParams
> & {
  children: React.ReactElement;
};
const SubjectCatalogPage: React.FC<SubjectCatalogPageProps> = (props) => {
  const {location, path, children: header} = props;
  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();

  const canEdit = useCheckPermissions(Permission.SUBJECT_EDIT);

  const onDelete = useDeleteSubject();

  const renderSubject: CatalogItemRenderer<SubjectInfo> = useCallback(
    (subject, {link, ...rest}) => {
      const {id, image_link, name, description} = subject;

      const editLink = `${link}edit/`;

      const deleteCallback = (): void => {
        onDelete(id);
      };

      const action = canEdit ? (
        <DropdownMenu
          content={<DropdownIconButton className="icon-ellipsis" />}
        >
          <DropdownMenuOption component={Link} to={editLink}>
            <i className="icon-edit" />
            Изменить
          </DropdownMenuOption>
          <DropdownMenuOption onClick={deleteCallback}>
            <i className="icon-close" />
            Удалить
          </DropdownMenuOption>
        </DropdownMenu>
      ) : undefined;

      return (
        <ListItem
          key={id}
          item={subject}
          className="subject"
          title={name}
          description={description}
          selectable
          link={editLink}
          noOnClickOnAction
          preview={
            <CoverImage
              src={image_link}
              className="subject__cover poster-cover"
            />
          }
          action={action}
          {...rest}
        />
      );
    },
    [canEdit, onDelete],
  );
  const isLoaded = !!subjects;

  return (
    <Page
      isLoaded={isLoaded}
      loadUserInfo
      requiredRoles={ADMIN_ROLES}
      fullMatch={false}
      className="admin-page admin-page--subjects"
      title="Управление предметами"
      location={location}
      errors={[errorLoadingSubjects]}
      reloadCallbacks={[reloadSubjects]}
    >
      {isLoaded && subjects && (
        <PageContent>
          <Catalog.Body items={subjects} filter={filter}>
            {header}
            {canEdit && (
              <ContentBlock stacked className="d-flex">
                <Button
                  neutral
                  component={Link}
                  to={`${path}/create/`}
                  after={<i className="icon-add" />}
                >
                  Добавить предмет
                </Button>
              </ContentBlock>
            )}
            <Catalog.Filter filterBy={filterBy} />
            <Catalog.Catalog
              className="users-list"
              emptyPlaceholder="Нет предметов"
              noMatchPlaceholder="Нет совпадающих предметов"
              plain
              renderItem={renderSubject}
            />
          </Catalog.Body>
        </PageContent>
      )}
    </Page>
  );
};

export default SubjectCatalogPage;
