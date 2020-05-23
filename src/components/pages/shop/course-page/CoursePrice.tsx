import classNames from 'classnames';
import {CourseOverviewContext} from 'components/common/CourseOverview';
import {ContentBlock} from 'components/layout/ContentBlock';
import Button from 'components/ui/Button';
import {
  LoadingIndicator,
  useLoadingState,
} from 'components/ui/LoadingIndicator';
import {renderPrice} from 'definitions/helpers';
import {useDiscount} from 'modules/courses/courses.hooks';
import React, {useCallback} from 'react';
import {CourseInfo} from 'types/entities';

interface CoursePriceProps extends ReturnType<typeof useDiscount> {
  isSelected: boolean;
  onSelect: (course: CourseInfo) => void;
}

const CoursePrice: React.FC<CoursePriceProps> = (props) => {
  const {
    isLoading,
    isSelected,
    onSelect: callback,
    discount: discountInfo,
    error,
    reload,
  } = props;
  const {course} = React.useContext(CourseOverviewContext);
  const {price: fullPrice, purchased} = course;
  const {discounted_price: price} = discountInfo || {};
  const discount = price ? fullPrice - price : undefined;

  const loadingState = useLoadingState(isLoading, false, !!error);

  React.useEffect(() => {
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('scroll'));
    }
  });
  const onSelect = useCallback(() => {
    callback(course);
  }, [callback, course]);

  return (
    <ContentBlock
      stacked
      className={classNames('course-overview__offer', {
        'course-overview__offer--selected': isSelected,
      })}
    >
      <div className="row justify-content-end align-items-center">
        {purchased ? (
          <div className="col-auto">
            <Button active={false}>Куплено</Button>
          </div>
        ) : discountInfo ? (
          <React.Fragment>
            {discount && price && discount > 0 && (
              <div className="col-auto">
                <div className="discount">{renderPrice(price + discount)}</div>
              </div>
            )}
            {price && (
              <div className="col-auto">
                <h2 className="price">{renderPrice(price)}</h2>
              </div>
            )}
            <div className="col-auto">
              <Button onClick={onSelect}>
                {isSelected ? 'Выбрано' : 'Купить'}
              </Button>
            </div>
          </React.Fragment>
        ) : (
          <div className="col-auto">
            <LoadingIndicator state={loadingState} />
          </div>
        )}
      </div>
    </ContentBlock>
  );
};

export default CoursePrice;
