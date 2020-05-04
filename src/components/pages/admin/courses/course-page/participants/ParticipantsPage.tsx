import {Account} from 'components/common/Account';
import AccountCatalog from 'components/common/AccountCatalog';
import {CatalogItemRenderer} from 'components/common/Catalog';
import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from 'components/common/DropdownMenu';
import {useCheckPermissions} from 'components/ConditionalRender';
import Page, {PageContent, PageParentSection} from 'components/layout/Page';
import Button from 'components/ui/Button';
import Tooltip from 'components/ui/Tooltip';
import {renderDate} from 'definitions/helpers';
import {useDeleteParticipant} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {Link} from 'react-router-dom';
import {CourseInfo, CourseParticipantInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {CoursePageParams, RouteComponentPropsWithPath} from 'types/routes';

export type ParticipantsPageProps = RouteComponentPropsWithPath<
  CoursePageParams
> & {
  parentSection?: PageParentSection;
  participants?: CourseParticipantInfo[];
  course?: CourseInfo;
  isLoaded: boolean;
  children: React.ReactNode;
};
const ParticipantsPage: React.FC<ParticipantsPageProps> = (props) => {
  const {
    match: {
      params: {courseId: param_course},
    },
    location,
    participants,
    course,
    isLoaded,
    children: header,
    parentSection,
    path,
  } = props;
  const courseId = parseInt(param_course);

  const canEdit = useCheckPermissions(Permission.PARTICIPANT_MANAGEMENT);

  const courseLink = `${path}/${courseId}`;

  const onDelete = useDeleteParticipant();

  const renderStudent: CatalogItemRenderer<CourseParticipantInfo> = useCallback(
    (user, {link, ...renderProps}) => {
      const {
        id,
        vk_info: {first_name, last_name, photo},
        contacts: {vk},
        join_date_time,
      } = user;
      const deleteCallback = (): void => {
        onDelete(courseId, id);
      };
      const tooltip = (
        <Tooltip
          content={`Присоединился ${renderDate(
            join_date_time,
            renderDate.dateWithYear,
          )}`}
          position="left"
        >
          <i className="icon-info icon-grey d-block" />
        </Tooltip>
      );
      const action = canEdit ? (
        <div className="row align-items-center">
          <div className="col-auto">{tooltip}</div>
          <div className="col-auto">
            <DropdownMenu
              content={<DropdownIconButton className="icon-ellipsis" />}
            >
              <DropdownMenuOption onClick={deleteCallback}>
                <i className="icon-close" />
                Удалить
              </DropdownMenuOption>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        tooltip
      );

      return (
        <Account
          key={id}
          account={user}
          selectable
          noOnClickOnAction
          action={action}
          {...renderProps}
        />
      );
    },
    [canEdit, courseId, onDelete],
  );
  const title = course && `Ученики курса ${course.name}`;

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.PARTICIPANT_MANAGEMENT}
      className="admin-page admin-page--participants"
      title={title}
      location={location}
    >
      {isLoaded && participants && (
        <AccountCatalog.Body accounts={participants}>
          <PageContent parentSection={parentSection}>
            {header}
            {canEdit && (
              <div className="layout__content-block layout__content-block--stacked d-flex">
                <Button
                  neutral
                  component={Link}
                  to={`${courseLink}/participants/edit/`}
                  after={<i className="icon-add" />}
                >
                  Добавить учеников
                </Button>
              </div>
            )}
            <AccountCatalog.Filter>
              {/*<div className="col d-flex justify-content-end">*/}
              {/*    <DropdownMenu content={(*/}
              {/*        <DropdownIconButton className="after-ellipsis"/>*/}
              {/*    )}>*/}
              {/*        <DropdownMenuOption*/}
              {/*            component={Link}*/}
              {/*            navigateTo={`/catalog-page/${courseId}/participants/edit/`}>*/}
              {/*            <i className="after-add"/>Добавить учеников*/}
              {/*        </DropdownMenuOption>*/}
              {/*    </DropdownMenu>*/}
              {/*</div>*/}
            </AccountCatalog.Filter>
            <AccountCatalog.Catalog
              className="users-list"
              emptyPlaceholder="Нет учеников на курсе"
              noMatchPlaceholder="Нет совпадающих учеников"
              plain
              renderAccount={renderStudent}
            />
          </PageContent>
        </AccountCatalog.Body>
      )}
    </Page>
  );
};

export default ParticipantsPage;
