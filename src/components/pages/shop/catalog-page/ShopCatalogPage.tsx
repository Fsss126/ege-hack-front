import Course from 'components/common/Course';
import CourseCatalog from 'components/common/CourseCatalog';
import Page, {PageContent} from 'components/Page';
import Button from 'components/ui/Button';
import {renderPrice} from 'definitions/helpers';
import {useShopCatalog, useSubjects} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {CourseInfo} from 'types/entities';

export interface ShopCatalogPageProps extends RouteComponentProps {
  selectedCourses: Set<CourseInfo>;
  onCourseSelect: (course: CourseInfo) => void;
}
const ShopCatalogPage: React.FC<ShopCatalogPageProps> = ({
  selectedCourses,
  onCourseSelect,
  children: selectedCoursesTab,
  location,
}) => {
  const {catalog, error, reload} = useShopCatalog();
  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();
  const renderCourse = useCallback(
    (course, {link, ...rest}) => {
      const isSelected = selectedCourses.has(course);
      const {price, discount, purchased} = course;

      return (
        <Course
          course={course}
          selectable
          isSelected={isSelected}
          onActionClick={purchased ? null : onCourseSelect}
          key={course.id}
          link={link}
          action={
            !purchased ? (
              <React.Fragment>
                <div className="list__item-action-info">
                  <span className="price">{renderPrice(price)}</span>{' '}
                  {discount && (
                    <span className="discount font-size-xs">
                      {renderPrice(discount + price)}
                    </span>
                  )}
                </div>
                <Button style={{minWidth: '115px'}}>
                  {isSelected ? 'Выбрано' : 'Купить'}
                </Button>
              </React.Fragment>
            ) : (
              <Button style={{minWidth: '115px'}} active={false}>
                Куплено
              </Button>
            )
          }
          {...rest}
        />
      );
    },
    [selectedCourses, onCourseSelect],
  );
  const isLoaded = !!(catalog && subjects);

  return (
    <Page
      isLoaded={isLoaded}
      loadUserInfo
      className="course-shop"
      title="Магазин курсов"
      location={location}
    >
      {isLoaded && (
        <CourseCatalog.Body subjects={subjects as any} courses={catalog as any}>
          <PageContent>
            <CourseCatalog.Filter />
            <CourseCatalog.Catalog renderCourse={renderCourse} />
          </PageContent>
        </CourseCatalog.Body>
      )}
      {selectedCoursesTab}
    </Page>
  );
};

export default ShopCatalogPage;