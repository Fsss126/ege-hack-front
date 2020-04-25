import {AxiosError} from 'axios';
import CoverImage from 'components/common/CoverImage';
import {BottomTab} from 'components/Page';
import Button from 'components/ui/Button';
import Loader from 'components/ui/Loader';
import ScrollBars, {renderView as DefaultView} from 'components/ui/ScrollBars';
import {renderPrice} from 'definitions/helpers';
import {useTruncate} from 'hooks/common';
import _ from 'lodash';
import React from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import Truncate, {TruncateProps} from 'react-truncate';
import {CourseInfo, DiscountInfo} from 'types/entities';
import {SimpleCallback} from 'types/utility/common';

export type CourseDeselectCallback = (course: CourseInfo) => void;

interface SelectedCourseProps {
  course: CourseInfo;
  onCourseDeselect: CourseDeselectCallback;
  onTruncate: TruncateProps['onTruncate'];
}

const SelectedCourse = (props: SelectedCourseProps) => {
  const {course, onCourseDeselect, onTruncate} = props;
  const {name} = course;
  const [descriptionRef] = useTruncate(name);
  const onDeselectClick = React.useCallback(() => {
    onCourseDeselect(course);
  }, [onCourseDeselect, course]);

  return (
    <div className="selected-course d-flex align-items-center flex-shrink-0">
      <div className="selected-course__cover-container preview-container miniature">
        <CoverImage
          src={course.image_link}
          className="selected-course__cover poster-cover"
        />
        <i
          className="icon-close selected-course__deselect-btn animated__action-button"
          onClick={onDeselectClick}
        />
      </div>
      <div className="selected-course__description-container font-size-xs">
        <div className="selected-course__description">
          <Truncate lines={2} ref={descriptionRef} onTruncate={onTruncate}>
            {name}
          </Truncate>
        </div>
      </div>
    </div>
  );
};

const renderView: typeof DefaultView = ({style, ...props}) => (
  <div
    {...props}
    style={
      style ? {...style, height: `calc(100% + ${style.minHeight}px)`} : style
    }
  />
);

interface SelectedCoursesTabProps {
  courses: CourseInfo[];
  discount?: DiscountInfo;
  isLoading: boolean;
  error?: AxiosError;
  retry: SimpleCallback;
  onCourseDeselect: CourseDeselectCallback;
  onPurchaseClick: SimpleCallback;
}

const SelectedCoursesTab = (props: SelectedCoursesTabProps) => {
  const {
    courses,
    discount: discountInfo,
    isLoading,
    error,
    onCourseDeselect,
    onPurchaseClick,
  } = props;
  const {discounted_price: price, message} = discountInfo || {};
  const fullPrice = _.sumBy(courses, 'price');
  const discount = price && !isLoading ? fullPrice - price : undefined;

  React.useEffect(() => {
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('scroll'));
    }
  });

  return (
    <BottomTab
      className={`selected-courses ${courses.length === 0 ? 'hidden' : ''}`}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md p-0 selected-courses__courses">
            <ScrollBars
              autoHeight
              autoHeightMax="unset"
              hideTracksWhenNotNeeded
              renderView={renderView}
              style={{height: '100%'}}
              className="scrollbars"
            >
              <TransitionGroup
                className="layout__bottom-tab-container container-fluid d-flex flex-nowrap"
                style={{height: '100%'}}
              >
                {courses.map((course) => (
                  <CSSTransition
                    classNames="animation-fade"
                    key={course.id}
                    timeout={300}
                  >
                    <SelectedCourse
                      course={course}
                      onCourseDeselect={onCourseDeselect}
                      onTruncate={() => {
                        window.dispatchEvent(new CustomEvent('scroll'));
                      }}
                    />
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </ScrollBars>
          </div>
          <Loader
            className="col-12 col-md-auto p-0 selected-courses__price-container d-flex justify-content-end"
            isLoading={isLoading || !!error}
          >
            <div className="layout__bottom-tab-container container d-flex align-items-center justify-content-end">
              <Button
                loading={isLoading || !!error}
                className="order-1 order-md-0 flex-shrink-0"
                onClick={onPurchaseClick}
              >
                Оплатить
              </Button>
              <div className="price selected-courses__price container">
                {discount !== undefined &&
                  price !== undefined &&
                  discount > 0 && (
                    <div className="discount font-size-sm d-inline-block d-md-block">
                      {renderPrice(price + discount)}
                    </div>
                  )}
                <div className="price font-size-lg d-inline-block d-md-block">
                  {renderPrice(price || fullPrice)}
                </div>
                {message && (
                  <div className="promotion font-size-xs">{message}</div>
                )}
              </div>
            </div>
          </Loader>
        </div>
      </div>
    </BottomTab>
  );
};

export default SelectedCoursesTab;
