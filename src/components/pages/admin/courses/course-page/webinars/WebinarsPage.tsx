import classNames from 'classnames';
import Catalog, {
  CatalogItemRenderer,
  FilterFunc,
} from 'components/common/Catalog';
import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from 'components/common/DropdownMenu';
import ListItem, {ListItemProps} from 'components/common/ListItem';
import PosterCover from 'components/common/PosterCover';
import {useWebinar, WEBINAR_STATE} from 'components/common/WebinarSchedule';
import {useCheckPermissions} from 'components/ConditionalRender';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent, PageParentSection} from 'components/layout/Page';
import Button from 'components/ui/Button';
import {renderDate} from 'definitions/helpers';
import {useDeleteWebinar} from 'hooks/selectors';
import React, {useCallback} from 'react';
import Countdown, {CountdownRenderProps} from 'react-countdown-now';
import {RouteComponentProps} from 'react-router';
import {Link} from 'react-router-dom';
import {CourseInfo, WebinarInfo, WebinarScheduleInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {CoursePageParams} from 'types/routes';
import {SimpleCallback} from 'types/utility/common';

const filterBy = {
  search: true,
  subject: false,
  online: false,
};

const filter: FilterFunc<WebinarInfo> = (lesson, {search}) => {
  const name = lesson.name.toLowerCase().replace(/\s/g, '');
  const searchKey = search.toLowerCase().replace(/\s/g, '');

  return search ? name.includes(searchKey) : true;
};

type WebinarProps = Omit<
  React.Defaultize<ListItemProps<WebinarInfo>, typeof ListItem.defaultProps>,
  'item' | 'preview' | 'truncate' | 'title' | 'selectable'
> & {
  webinar: WebinarInfo;
};
const Webinar = (props: WebinarProps): React.ReactElement => {
  const {webinar, ...rest} = props;
  const {id, image_link, name, date_start} = webinar;
  const {state, isUnlocked, onTick, onWebinarStart} = useWebinar(webinar);

  const renderCountdown = (remainingTime: CountdownRenderProps) => {
    const {
      formatted: {days, hours, minutes},
    } = remainingTime;
    const stateText =
      state === WEBINAR_STATE.ENDED
        ? 'Завершен'
        : state === WEBINAR_STATE.AIRING
        ? 'В эфире'
        : `До начала ${days} дней ${hours} часов ${minutes} минут`;

    return (
      <div title={stateText}>
        {renderDate(date_start, renderDate.dateWithHour)}
      </div>
    );
  };

  return (
    <ListItem
      truncate={false}
      key={id}
      item={webinar}
      className="webinar"
      title={name}
      description={
        <Countdown
          date={date_start}
          renderer={renderCountdown}
          onTick={onTick}
          onComplete={onWebinarStart}
        />
      }
      selectable
      preview={
        <PosterCover
          cover={image_link}
          className={classNames(
            'webinar-cover',
            state !== WEBINAR_STATE.ENDED && {
              locked: !isUnlocked,
              unlocked: isUnlocked,
            },
          )}
          online={state === WEBINAR_STATE.AIRING}
        />
      }
      {...rest}
    />
  );
};

export type WebinarsPageProps = RouteComponentProps<CoursePageParams> & {
  path: string;
  parentSection?: PageParentSection;
  children: React.ReactNode;
  course?: CourseInfo;
  webinars?: WebinarScheduleInfo;
  isLoaded: boolean;
  errors?: any[];
  reloadCallbacks: SimpleCallback[];
};
const WebinarsPage: React.FC<WebinarsPageProps> = (props) => {
  const {
    location,
    path,
    match,
    children: header,
    course,
    webinars: webinarSchedule,
    isLoaded,
    parentSection,
    errors,
    reloadCallbacks,
  } = props;
  const {
    params: {courseId: param_id},
  } = match;
  const courseId = parseInt(param_id);

  const webinars = webinarSchedule ? webinarSchedule.webinars : undefined;

  const onDelete = useDeleteWebinar();

  const canEdit = useCheckPermissions(Permission.WEBINAR_EDIT);
  const courseLink = `${path}/${courseId}`;
  const renderWebinar: CatalogItemRenderer<WebinarInfo> = useCallback(
    (webinar, {link, ...rest}) => {
      const {id} = webinar;
      const deleteCallback = (): void => {
        if (webinarSchedule) {
          onDelete(courseId, id, webinarSchedule);
        }
      };
      const editLink = `${courseLink}/webinars/edit/`;

      return (
        <Webinar
          key={id}
          webinar={webinar}
          link={editLink}
          action={
            canEdit ? (
              <DropdownMenu
                content={<DropdownIconButton className="icon-ellipsis" />}
              >
                <DropdownMenuOption component={Link} to={editLink}>
                  <i className="far fa-edit" />
                  Изменить
                </DropdownMenuOption>
                <DropdownMenuOption onClick={deleteCallback}>
                  <i className="icon-close" />
                  Удалить
                </DropdownMenuOption>
              </DropdownMenu>
            ) : undefined
          }
          {...rest}
        />
      );
    },
    [courseLink, canEdit, webinarSchedule, courseId, onDelete],
  );
  const title = course && `Вебинары курса ${course.name}`;

  return (
    <Page
      isLoaded={isLoaded}
      loadUserInfo
      requiredPermissions={Permission.WEBINAR_EDIT}
      className="admin-page admin-page--webinars"
      title={title}
      errors={errors}
      reloadCallbacks={reloadCallbacks}
      location={location}
    >
      {isLoaded && webinars && (
        <Catalog.Body items={webinars} filter={filter}>
          <PageContent parentSection={parentSection}>
            {header}
            {canEdit && (
              <ContentBlock stacked className="d-flex">
                <Button
                  neutral
                  component={Link}
                  to={`${courseLink}/webinars/edit/`}
                  after={<i className="icon-add" />}
                >
                  Добавить вебинар
                </Button>
              </ContentBlock>
            )}
            <Catalog.Filter filterBy={filterBy} />
            <Catalog.Catalog
              className="webinars-list"
              emptyPlaceholder="Нет вебинаров"
              noMatchPlaceholder="Нет совпадающих вебинаров"
              plain
              renderItem={renderWebinar}
            />
          </PageContent>
        </Catalog.Body>
      )}
    </Page>
  );
};

export default WebinarsPage;
