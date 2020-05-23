import {useToggle} from 'hooks/common';
import {useDiscount} from 'modules/courses/courses.hooks';
import React, {Fragment, useCallback, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {Route, Switch} from 'react-router-dom';
import {CourseInfo} from 'types/entities';

import ShopCatalogPage from './catalog-page';
import CoursePage from './course-page';
import PurchasePopup from './PurchasePopup';
import SelectedCoursesTab from './SelectedCoursesTab';

const Shop: React.FC<RouteComponentProps> = (props) => {
  const [selectedCourses, setSelectedCourses] = useState(new Set<CourseInfo>());
  const {
    discount,
    error: errorLoadingDiscount,
    reload: reloadDiscount,
    isLoading,
  } = useDiscount(selectedCourses);
  const onCourseSelect = useCallback((course) => {
    setSelectedCourses((selectedCourses) => {
      if (selectedCourses.has(course)) {
        return selectedCourses;
      }
      selectedCourses = new Set(selectedCourses);
      selectedCourses.add(course);
      return selectedCourses;
    });
  }, []);
  const onCourseDeselect = useCallback((course) => {
    setSelectedCourses((selectedCourses) => {
      selectedCourses = new Set(selectedCourses);
      selectedCourses.delete(course);
      return selectedCourses;
    });
  }, []);
  const [isPurchasePopupOpened, togglePopup] = useToggle(false);
  const {match} = props;

  const selectedCoursesTab = (
    <SelectedCoursesTab
      isLoading={isLoading}
      error={errorLoadingDiscount}
      retry={reloadDiscount}
      onCourseDeselect={onCourseDeselect}
      courses={[...selectedCourses]}
      onPurchaseClick={togglePopup}
      discount={discount}
    />
  );

  return (
    <Fragment>
      <Switch>
        <Route
          path={`${match.path}/:courseId`}
          render={(props) => (
            <CoursePage
              selectedCourses={selectedCourses}
              onCourseSelect={onCourseSelect}
              path={match.path}
              url={match.url}
              {...props}
            >
              {selectedCoursesTab}
            </CoursePage>
          )}
        />
        <Route
          exact
          path={`${match.path}`}
          render={(props) => (
            <ShopCatalogPage
              selectedCourses={selectedCourses}
              onCourseSelect={onCourseSelect}
              {...props}
            >
              {selectedCoursesTab}
            </ShopCatalogPage>
          )}
        />
      </Switch>
      <PurchasePopup
        opened={isPurchasePopupOpened}
        selectedCourses={selectedCourses}
        onCloseClick={togglePopup}
      />
    </Fragment>
  );
};

export default Shop;
