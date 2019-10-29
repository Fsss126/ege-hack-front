import React from 'react';
import {useTruncate} from "../../hooks/common";
import CoverImage from "../common/CoverImage";
import Truncate from "react-truncate";
import _ from "lodash";
import {BottomTab} from "../Page";
import ScrollBars from "../ui/ScrollBars";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import Button from "../ui/Button";

const SelectedCourse = ({course, onCourseDeselect, onTruncate}) => {
    const {title} = course;
    const [descriptionRef] = useTruncate(title);
    const onDeselectClick = React.useCallback(() => {
        onCourseDeselect(course);
    }, [onCourseDeselect, course]);
    return (
        <div className="selected-course d-flex align-items-center flex-shrink-0">
            <div className="selected-course__cover-container">
                <CoverImage src={course.cover} className="selected-course__cover poster-cover"/>
                <i className="icon-close selected-course__deselect-btn animated__action-button" onClick={onDeselectClick}/>
            </div>
            <div className="selected-course__description-container font-size-xs">
                <div className="selected-course__description">
                    <Truncate lines={2} ref={descriptionRef} onTruncate={onTruncate}>
                        {title}
                    </Truncate>
                </div>
            </div>
        </div>
    );
};

const renderView = ({style, ...props}) => (<div style={{...style, height: `calc(100% + ${style.minHeight}px)`}} {...props}/>);

const SelectedCoursesTab = ({courses, onCourseDeselect}) => {
    const price = _.sumBy(courses, 'offer.price');
    const discount = _.sumBy(courses, 'offer.discount');
    // const stickyRef =
    React.useEffect(() => {
        window.dispatchEvent(new Event('scroll'));
    });
    return (
        <BottomTab
            className={`selected-courses ${courses.length === 0 ? 'hidden' : ''}`}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-md p-0 selected-courses__courses">
                        <ScrollBars
                            autoHeight
                            autoHeightMax="unset"
                            hideTracksWhenNotNeeded
                            renderView={renderView}
                            style={{height: '100%'}}
                            className="scrollbars">
                            <TransitionGroup
                                className="layout__bottom-tab-container container-fluid d-flex flex-nowrap"
                                style={{height: '100%'}}>
                                {courses.map(course => (
                                    <CSSTransition
                                        classNames="animation-fade"
                                        key={course.id}
                                        timeout={300}>
                                        <SelectedCourse
                                            course={course}
                                            onCourseDeselect={onCourseDeselect}
                                            onTruncate={() => {
                                                window.dispatchEvent(new Event('scroll'));
                                            }}/>
                                    </CSSTransition>
                                ))}
                            </TransitionGroup>
                        </ScrollBars>
                    </div>
                    <div className="col-12 col-md-auto p-0">
                        <div className="selected-courses__price layout__bottom-tab-container container d-flex align-items-center justify-content-end">
                            <Button className="order-1 order-md-0 flex-shrink-0">Оплатить</Button>
                            <div className="price selected-courses__price-container container">
                                {discount && <div className="discount font-size-sm d-inline-block d-md-block">{price + discount}₽</div>}
                                <div className="price font-size-lg d-inline-block d-md-block">{price}₽</div>
                                {discount && <div className="promotion font-size-xs">Цена со скидкой за 2 курса</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BottomTab>
    );
};

export default SelectedCoursesTab;
