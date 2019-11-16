import React from "react";
import {CourseOverviewContext} from "components/common/CourseOverview";
import {BottomTab} from "components/Page";
import Button from "../../ui/Button";

const CoursePriceTab = () => {
    const {course: {price, discount}} = React.useContext(CourseOverviewContext);
    return (
        <BottomTab className="course-overview__offer">
            <div className="container layout__bottom-tab-container">
                <div className="row justify-content-end align-items-center">
                    {discount && (
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
                </div>
            </div>
        </BottomTab>
    );
};

export default CoursePriceTab;
