import {Account} from 'components/common/Account';
import AccountCatalog from 'components/common/AccountCatalog';
import {CatalogItemRenderer} from 'components/common/Catalog';
import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from 'components/common/DropdownMenu';
import {useCheckPermissions} from 'components/ConditionalRender';
import {ButtonsBlock} from 'components/layout/ButtonsBlock';
import Page, {PageContent, PageParentSection} from 'components/layout/Page';
import Button from 'components/ui/Button';
import Tooltip from 'components/ui/Tooltip';
import {renderDate} from 'definitions/helpers';
import {useDeleteParticipant} from 'modules/participants/participants.hooks';
import React, {useCallback} from 'react';
import {Link} from 'react-router-dom';
import {CourseInfo, CourseParticipantInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {
  CoursePageParams,
  RouteComponentPropsWithParentProps,
} from 'types/routes';
import {SimpleCallback} from 'types/utility/common';

export type ParticipantsPageProps = RouteComponentPropsWithParentProps<
  CoursePageParams
> & {
  parentSection?: PageParentSection;
  participants?: CourseParticipantInfo[];
  course?: CourseInfo;
  isLoaded: boolean;
  children: React.ReactNode;
  errors?: any[];
  reloadCallbacks: SimpleCallback[];
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
    errors,
    reloadCallbacks,
  } = props;
  const courseId = parseInt(param_course);

  const canEdit = useCheckPermissions(Permission.PARTICIPANT_MANAGEMENT);

  const courseLink = `/admin/courses/${courseId}`;

  const onDelete = useDeleteParticipant();

  const renderStudent: CatalogItemRenderer<CourseParticipantInfo> = useCallback(
    (user, {link, ...renderProps}) => {
      const {id, join_date_time} = user;
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
      errors={errors}
      reloadCallbacks={reloadCallbacks}
    >
      {isLoaded && participants && (
        <AccountCatalog.Body accounts={participants}>
          <PageContent parentSection={parentSection}>
            {header}
            {canEdit && (
              <ButtonsBlock stacked>
                <Button
                  neutral
                  component={Link}
                  to={`${courseLink}/participants/edit/`}
                  after={<i className="icon-add" />}
                >
                  Добавить учеников
                </Button>
              </ButtonsBlock>
            )}
            <AccountCatalog.Filter />
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
