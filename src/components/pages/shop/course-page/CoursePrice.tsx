import classNames from 'classnames';
import {CourseOverviewContext} from 'components/common/CourseOverview';
import Button from 'components/ui/Button';
import {renderPrice} from 'definitions/helpers';
import {DiscountHookResult} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {CourseInfo} from 'types/entities';

interface CoursePriceProps extends Omit<DiscountHookResult, 'isLoading'> {
  isSelected: boolean;
  onSelect: (course: CourseInfo) => void;
}

const CoursePrice: React.FC<CoursePriceProps> = (props) => {
  const {
    isSelected,
    onSelect: callback,
    discount: discountInfo,
    error,
    reload,
  } = props;
  const {course} = React.useContext(CourseOverviewContext);
  const {price: fullPrice, purchased} = course;
  const {discounted_price: price, message} = discountInfo || {};
  const discount = price ? fullPrice - price : undefined;

  React.useEffect(() => {
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('scroll'));
    }
  });
  const onSelect = useCallback(() => {
    callback(course);
  }, [callback, course]);

  return (
    <div
      className={classNames(
        'layout__content-block',
        'layout__content-block--stacked',
        'course-overview__offer',
        {
          'course-overview__offer--selected': isSelected,
        },
      )}
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
            <div className="spinner-border" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePrice;
