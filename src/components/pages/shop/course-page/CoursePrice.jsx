import classnames from 'classnames';
import {CourseOverviewContext} from 'components/common/CourseOverview';
import Button from 'components/ui/Button';
import {renderPrice} from 'definitions/helpers';
import React, {useCallback} from 'react';

const CoursePrice = (props) => {
  const {
    isSelected,
    onSelect: callback,
    discount: discountInfo,
    error,
    retry,
  } = props;
  const {course} = React.useContext(CourseOverviewContext);
  const {price: fullPrice, purchased} = course;
  let price, discount, message;

  if (discountInfo) {
    price = discountInfo.discounted_price;
    discount = fullPrice - discountInfo.discounted_price;
    message = discountInfo.message;
  }
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
      className={classnames(
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
            {discount > 0 && (
              <div className="col-auto">
                <div className="discount">{renderPrice(price + discount)}</div>
              </div>
            )}
            <div className="col-auto">
              <h2 className="price">{renderPrice(price)}</h2>
            </div>
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
