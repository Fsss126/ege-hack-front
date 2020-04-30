import {CatalogItemRenderer} from 'components/common/Catalog';
import Course from 'components/common/Course';
import CourseCatalog from 'components/common/CourseCatalog';
import UserProfile from 'components/common/UserProfile';
import {NotFoundErrorPage} from 'components/layout/ErrorPage';
import Page, {PageContent} from 'components/layout/Page';
import Button from 'components/ui/Button';
import {renderPrice} from 'definitions/helpers';
import {useShopCatalog, useSubjects, useTeacher} from 'hooks/selectors';
import _ from 'lodash';
import React, {Fragment, useCallback} from 'react';
import {CourseInfo} from 'types/entities';
import {RouteComponentPropsWithPath, TeacherPageParams} from 'types/routes';

interface TeacherPageProps
  extends RouteComponentPropsWithPath<TeacherPageParams> {}

const TeacherPage: React.FC<TeacherPageProps> = (props) => {
  const {
    match: {
      params: {id: param_id},
    },
    path: root,
    location,
  } = props;
  const id = parseInt(param_id);

  const {teacher, error, reload} = useTeacher(id);
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

  if (teacher && catalog && subjects) {
    const {
      vk_info: {first_name, last_name, photo},
      contacts,
      subjects: teacherSubjects,
      bio,
    } = teacher;
    // const teacherSubjects = subject_ids.map(id => _.find(subjects, {id}));
    const teachersCourses = catalog.filter(
      (course) => _.indexOf(course.teacher_ids, id) >= 0,
    );
    const profile = {
      first_name,
      last_name,
      photo,
      contacts,
      about: bio,
      role: teacherSubjects
        .map(({name}, i) => (i === 0 ? name : name.toLowerCase()))
        .join(', '),
    };
    const fullName = `${first_name} ${last_name}`;

    return (
      <Page
        isLoaded={true}
        title={`${fullName}`}
        className="teacher-page"
        location={location}
      >
        <CourseCatalog.Body subjects={subjects} courses={teachersCourses}>
          <PageContent parentSection={{name: 'Преподаватели'}}>
            <UserProfile {...profile} />
            <CourseCatalog.Catalog
              renderCourse={renderCourse}
              title="Курсы преподавателя"
              filter={<CourseCatalog.Filter />}
            />
          </PageContent>
        </CourseCatalog.Body>
      </Page>
    );
  } else if (error) {
    return (
      <NotFoundErrorPage
        message="Преподаватель не найден"
        url={root}
        location={location}
      />
    );
  } else {
    return <Page isLoaded={false} location={location} />;
  }
};

export default TeacherPage;
