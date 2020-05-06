import classNames from 'classnames';
import CoverImage from 'components/common/CoverImage';
import {ContentBlock} from 'components/layout/ContentBlock';
import {ADMIN_ROLES} from 'definitions/constants';
import {renderDate} from 'definitions/helpers';
import _ from 'lodash';
import React, {useMemo} from 'react';
import {RouteComponentProps} from 'react-router';
import {Link} from 'react-router-dom';
import {CourseInfo, LessonInfo, TeacherInfo} from 'types/entities';

import {SimpleCallback} from '../../types/utility/common';
import ConditionalRenderer from '../ConditionalRender';
import Page, {PageContent, PageLink} from '../layout/Page';
import Catalog, {CatalogProps} from './Catalog';
import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from './DropdownMenu';
import {ListProps} from './List';
import ScrollContainer from './ScrollContainer';
import Teacher from './Teacher';

type CourseOverviewConextState = {
  course: CourseInfo;
  teachers: TeacherInfo[];
  lessons: LessonInfo[];
};
export const CourseOverviewContext = React.createContext<
  CourseOverviewConextState
>(undefined as any);
CourseOverviewContext.displayName = 'CourseOverviewContext';

const Description: React.FC = () => {
  const {course} = React.useContext(CourseOverviewContext);
  const now = new Date();
  const isEnded = course.date_end < now;
  const {
    date_start,
    date_end,
    description,
    // total_hours
  } = course;

  return (
    <React.Fragment>
      <CoverImage src={course.image_link} className="course-overview__cover" />
      <ContentBlock className="course-overview__info">
        <div className="title-with-menu">
          <div className="title-with-menu__action">
            <ConditionalRenderer requiredRoles={ADMIN_ROLES} fullMatch={false}>
              <DropdownMenu
                content={<DropdownIconButton className="icon-ellipsis" />}
              >
                <DropdownMenuOption
                  component={Link}
                  to={`/admin/${course.id}/`}
                >
                  <i className="icon-logout" />
                  Управление курсом
                </DropdownMenuOption>
              </DropdownMenu>
            </ConditionalRenderer>
          </div>
          <div className="title-with-menu__title">
            <h2>{course.name}</h2>
          </div>
        </div>
        <div className="course-overview__summary">
          <div className="col-auto course-overview__summary-item">
            <i className="far fa-calendar-alt prefix-icon" />
            {isEnded ? (
              <div className="d-inline-block align-top">
                <div>
                  Начался:{' '}
                  {renderDate(
                    date_start,
                    now.getFullYear() > date_end.getFullYear()
                      ? renderDate.dateWithYear
                      : renderDate.date,
                  )}
                </div>
                <div>
                  Закончился:{' '}
                  {renderDate(
                    date_end,
                    now.getFullYear() > date_end.getFullYear()
                      ? renderDate.dateWithYear
                      : renderDate.date,
                  )}
                </div>
              </div>
            ) : (
              <div className="d-inline-block align-top">
                <div>Начало: {renderDate(date_start, renderDate.date)}</div>
                <div>Окончание: {renderDate(date_end, renderDate.date)}</div>
              </div>
            )}
          </div>
          {/*{*/}
          {/*    total_hours && (*/}
          {/*        <div className="col-auto course-overview__summary-item">*/}
          {/*            <i className="far fa-clock"/>*/}
          {/*            Длительность: {total_hours} часов*/}
          {/*        </div>*/}
          {/*    )}*/}
        </div>
        <div className="description-block font-size-sm">{description}</div>
      </ContentBlock>
    </React.Fragment>
  );
};

const Title: React.FC = () => {
  const {course} = React.useContext(CourseOverviewContext);

  return (
    <ContentBlock className="course-overview__title" transparent>
      <h2>{course.name}</h2>
      <PageLink className="course-overview__link" to={`/shop/${course.id}`}>
        Страница курса
      </PageLink>
    </ContentBlock>
  );
};

const Teachers: React.FC = () => {
  const {teachers} = React.useContext(CourseOverviewContext);

  return (
    <>
      <PageContent>
        <ContentBlock title="Преподаватели" transparent />
      </PageContent>
      <ContentBlock className="webinar-schedule" transparent>
        <ScrollContainer
          className="webinar-schedule__list-wrap"
          withShadows={false}
          fullWidth={true}
        >
          <div className="course-overview__teachers container">
            <div className="row flex-nowrap">
              {teachers.map((teacher) => (
                <div
                  className="teacher-profile-wrap col-12 col-md d-flex p-0"
                  key={teacher.id}
                >
                  <Teacher
                    teacher={teacher}
                    link={`/teachers/${teacher.id}/`}
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollContainer>
      </ContentBlock>
    </>
  );
};

export type LessonRenderer = ListProps<
  LessonInfo,
  {link: string}
>['renderItem'];

export type LessonsProps<P extends object = {}> = Omit<
  CatalogProps<LessonInfo, P>,
  'emptyPlaceholder' | 'noMatchPlaceholder' | 'renderItem'
> & {
  renderLesson: CatalogProps<LessonInfo, P>['renderItem'];
};

const Lessons: React.FC<LessonsProps> = (props) => {
  const {renderLesson, ...rest} = props;

  const {lessons} = React.useContext(CourseOverviewContext);

  return (
    <Catalog.Catalog
      title="Уроки"
      emptyPlaceholder="Нет курсов"
      noMatchPlaceholder="Нет курсов, соответствующих условиям поиска"
      renderItem={renderLesson}
      {...rest}
    >
      {lessons}
    </Catalog.Catalog>
  );
};

export type CourseOverviewProps = Pick<RouteComponentProps, 'location'> & {
  course?: CourseInfo;
  teachers?: TeacherInfo[];
  lessons?: LessonInfo[];
  path: string;
  children: React.ReactNode;
  className?: string;
  isLoaded: boolean;
  errors?: any[];
  reloadCallbacks?: SimpleCallback[];
};
const CourseOverview: React.FC<CourseOverviewProps> = (props) => {
  const {
    path: root,
    course,
    teachers: passedTeachers,
    lessons,
    children,
    className,
    location,
    isLoaded,
    errors,
    reloadCallbacks,
  } = props;

  const teachers = useMemo(() => {
    if (!(course && passedTeachers)) {
      return undefined;
    }

    return course.teacher_ids.map(
      (id) => _.find(passedTeachers, {id}) as TeacherInfo,
    );
  }, [course, passedTeachers]);

  let title;
  let content;

  if (course && teachers && lessons) {
    title = course.name;

    content = (
      <CourseOverviewContext.Provider
        value={{
          course,
          teachers,
          lessons,
        }}
      >
        {children}
      </CourseOverviewContext.Provider>
    );
  }

  return (
    <Page
      title={title}
      isLoaded={isLoaded}
      className={classNames('course-overview', 'catalog', className)}
      location={location}
      errors={errors}
      reloadCallbacks={reloadCallbacks}
      notFoundPageProps={{
        message: 'Курс не найден',
        url: root,
      }}
    >
      {content}
    </Page>
  );
};

export default {
  Description,
  Teachers,
  Lessons,
  Title,
  Body: CourseOverview,
};
