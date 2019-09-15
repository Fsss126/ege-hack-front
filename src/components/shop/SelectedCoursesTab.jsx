import React from 'react';
import {useTruncate} from "../../definitions/hooks";
import CoverImage from "../common/CoverImage";
import Truncate from "react-truncate";
import _ from "lodash";
import {BottomTab} from "../Page";
import ScrollBars from "../ui/ScrollBars";
import {CSSTransition, TransitionGroup} from "react-transition-group";

const SelectedCourse = ({course, onCourseDeselect}) => {
    const {title} = course;
    const [descriptionRef] = useTruncate(title);
    const onDeselectClick = React.useCallback(() => {
        onCourseDeselect(course);
    }, [onCourseDeselect, course]);
    return (
        <div className="selected-course d-flex align-items-center flex-shrink-0">
            <div className="selected-course__cover-container">
                <CoverImage src={course.cover} classname="selected-course__cover poster-cover"/>
                <i className="icon-close selected-course__deselect-btn" onClick={onDeselectClick}/>
            </div>
            <div className="selected-course__description-container font-size-xs">
                <div>
                    <Truncate lines={2} ref={descriptionRef}>
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
    return (
        <BottomTab className={`selected-courses ${courses.length === 0 ? 'hidden' : ''}`}>
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
                            <TransitionGroup className="layout__bottom-tab-container container-fluid d-flex flex-nowrap" style={{height: '100%'}}>
                                {courses.map(course => (
                                    <CSSTransition
                                        key={course.id}
                                        timeout={300}>
                                        <SelectedCourse
                                            course={course}
                                            onCourseDeselect={onCourseDeselect}/>
                                    </CSSTransition>
                                ))}
                            </TransitionGroup>
                        </ScrollBars>
                    </div>
                    <div className="col-12 col-md-auto p-0">
                        <div className="selected-courses__price layout__bottom-tab-container container d-flex align-items-center justify-content-end">
                            <div className="button order-1 order-md-0">Оплатить</div>
                            <div className="price selected-courses__price-container container">
                                <div className="discount font-size-sm d-inline-block d-md-block">{price}₽</div>
                                <div className="price font-size-lg d-inline-block d-md-block">{price}₽</div>
                                <div className="promotion font-size-xs">Цена со скидкой за 2 курса</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BottomTab>
    );
};

export default SelectedCoursesTab;
