import React from "react";
import {CourseOverviewContext} from "components/common/CourseOverview";
import {BottomTab} from "components/Page";
import Button from "../../../ui/Button";
import _ from "lodash";

const CoursePriceTab = (props) => {
    const {discount: discountInfo, error, retry} = props;
    const {course: {price: fullPrice, purchased}} = React.useContext(CourseOverviewContext);
    let price, discount, message;
    if (discountInfo) {
        price = discountInfo.discounted_price;
        discount = fullPrice - discountInfo.discounted_price;
        message = discountInfo.message;
    }
    React.useEffect(() => {
        if (window.dispatchEvent)
            window.dispatchEvent(new CustomEvent('scroll'));
    });
    return (
        <BottomTab className="course-overview__offer">
            <div className="container layout__bottom-tab-container">
                <div className="row justify-content-end align-items-center">
                    {purchased ? (
                        <Button active={false}>Куплено</Button>
                    ) : (
                        discountInfo ? (
                            <React.Fragment>
                                {discount > 0 && (
                                    <div className="col-auto">
                                        <div className="discount">{price + discount}₽</div>
                                    </div>
                                )}
                                <div className="col-auto">
                                    <h2 className="price">
                                        {price}₽
                                    </h2>
                                </div>
                                <div className="col-auto">
                                    <Button>Купить</Button>
                                </div>
                            </React.Fragment>
                        ) : (
                            <div className="spinner-border"/>
                        )
                    )}
                </div>
            </div>
        </BottomTab>
    );
};

export default CoursePriceTab;
