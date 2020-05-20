import {CatalogItemRenderer} from 'components/common/Catalog';
import Course from 'components/common/Course';
import CourseCatalog from 'components/common/CourseCatalog';
import UserProfile from 'components/common/UserProfile';
import Page, {PageContent} from 'components/layout/Page';
import Button from 'components/ui/Button';
import {renderPrice} from 'definitions/helpers';
import {useUserTeacher} from 'hooks/selectors';
import _ from 'lodash';
import {useShopCatalog} from 'modules/courses/courses.hooks';
import {useSubjects} from 'modules/subjects/subjects.hooks';
import React, {Fragment, useCallback} from 'react';
import {CourseInfo} from 'types/entities';
import {
  RouteComponentPropsWithParentProps,
  TeacherPageParams,
} from 'types/routes';

interface TeacherPageProps
  extends RouteComponentPropsWithParentProps<TeacherPageParams> {}

const TeacherPage: React.FC<TeacherPageProps> = (props) => {
  const {
    match: {
      params: {id: param_id},
    },
    path: root,
    location,
  } = props;
  const id = parseInt(param_id);

  const {
    teacher,
    error: errorLoadingTeacher,
    reload: reloadTeacher,
  } = useUserTeacher(id);
  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();
  const {
    catalog,
    error: errorLoadingCatalog,
    reload: reloadCatalog,
  } = useShopCatalog();

  const renderCourse: CatalogItemRenderer<CourseInfo> = useCallback(
    (course, {link}) => {
      const {price, purchased} = course;

      return (
        <Course
          course={course}
          selectable
          key={course.id}
          link={`/shop/${link}`}
          action={
            <Fragment>
              {!purchased && (
                <div className="list__item-action-info">
                  <span className="price">{renderPrice(price)}</span>{' '}
                </div>
              )}
              {purchased ? (
                <Button neutral>Куплено</Button>
              ) : (
                <Button>Открыть</Button>
              )}
            </Fragment>
          }
        />
      );
    },
    [],
  );

  const isLoaded = !!(teacher && catalog && subjects);

  let content;
  let title;

  if (teacher && catalog && subjects) {
    const {
      vk_info: {first_name, last_name},
      subjects: teacherSubjects,
      bio,
    } = teacher;
    // const teacherSubjects = subject_ids.map(id => _.find(subjects, {id}));
    const teachersCourses = catalog.filter(
      (course) => _.indexOf(course.teacher_ids, id) >= 0,
    );
    const subjectsText = teacherSubjects
      .map(({name}, i) => (i === 0 ? name : name.toLowerCase()))
      .join(', ');
    title = `${first_name} ${last_name}`;
    content = (
      <CourseCatalog.Body subjects={subjects} courses={teachersCourses}>
        <PageContent parentSection={{name: 'Преподаватели'}}>
          <UserProfile accountInfo={teacher} text={subjectsText}>
            <div className="description-block font-size-sm align-self-lg-start">
              {bio}
            </div>
          </UserProfile>
          <CourseCatalog.Catalog
            renderCourse={renderCourse}
            title="Курсы преподавателя"
            filter={<CourseCatalog.Filter />}
          />
        </PageContent>
      </CourseCatalog.Body>
    );
  }

  return (
    <Page
      title={title}
      className="teacher-page"
      errors={[errorLoadingSubjects, errorLoadingCatalog, errorLoadingTeacher]}
      reloadCallbacks={[reloadSubjects, reloadCatalog, reloadTeacher]}
      isLoaded={isLoaded}
      location={location}
      notFoundPageProps={{
        message: 'Преподаватель не найден',
        url: root,
      }}
    >
      {content}
    </Page>
  );
};

export default TeacherPage;
