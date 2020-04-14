import Course from 'components/common/Course';
import CourseCatalog from 'components/common/CourseCatalog';
import UserProfile from 'components/common/UserProfile';
import {NotFoundErrorPage} from 'components/ErrorPage';
import Page, {PageContent} from 'components/Page';
import Button from 'components/ui/Button';
import {renderPrice} from 'definitions/helpers';
import {useShopCatalog, useSubjects, useTeacher} from 'hooks/selectors';
import _ from 'lodash';
import React, {Fragment} from 'react';

const TeacherPage = (props) => {
  const {
    match: {
      params: {id: param_id},
    },
    path: root,
    className,
    location,
  } = props;
  const id = parseInt(param_id);

  const {teacher, error, reload} = useTeacher(id);
  const {
    subjects,
    error: errorLoadingSubjects,
    retry: reloadSubjects,
  } = useSubjects();
  const {
    catalog,
    error: errorLoadingCatalog,
    retry: reloadCatalog,
  } = useShopCatalog();

  const renderCourse = React.useCallback((course, {link}) => {
    const {price, discount} = course;

    return (
      <Course
        course={course}
        selectable
        key={course.id}
        link={`/shop/${link}`}
        action={
          <Fragment>
            <div className="list__item-action-info">
              <span className="price">{renderPrice(price)}</span>{' '}
              {discount && (
                <span className="discount font-size-xs">
                  {renderPrice(discount + price)}
                </span>
              )}
            </div>
            <Button style={{minWidth: '110px'}}>Открыть</Button>
          </Fragment>
        }
      />
    );
  }, []);

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
        className={`teacher-page ${className || ''}`}
        location={location}
      >
        <PageContent parentSection={{name: 'Преподаватели'}}>
          <UserProfile {...profile} />
          <div className="layout__content-block">
            <h3>Курсы преподавателя</h3>
          </div>
          <CourseCatalog.Body
            className="course-shop"
            subjects={subjects}
            courses={teachersCourses}
          >
            <CourseCatalog.Filter />
            <CourseCatalog.Catalog renderCourse={renderCourse} />
          </CourseCatalog.Body>
        </PageContent>
      </Page>
    );
  } else if (error) {
    return <NotFoundErrorPage message="Преподаватель не найден" url={root} />;
  } else {
    return <Page isLoaded={false} location={location} />;
  }
};

export default TeacherPage;
