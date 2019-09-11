import React from 'react';
import {Link, Redirect} from "react-router-dom";
import _ from 'lodash';
import CoverImage from "components/common/CoverImage";
import {renderDate} from "../../definitions/helpers";
import ListItem from "../common/ListItem";
import List from "../common/List";
import Teacher from "../common/Teacher";
import {Helmet} from "react-helmet";
import Page, {PageContent} from "../Page";

window._ = _;

export default class CourseOverview extends React.Component {
    renderClass = (item) => {
        const {title, cover, description, number} = item;
        return (
            <ListItem
                item={item}
                className="video-class"
                title={title}
                description={description}
                preview={(
                    <CoverImage src={cover} classname="video-class__cover video-cover"/>
                )}
                onClick={this.openCourse}
                key={number}/>
        )
    };

    render() {
        console.log(this.props);
        const {match: {params: {id}}, path, children: courses} = this.props;
        const {offer: {price, discount}, ...course} = _.find(courses, {id});
        if (id) {
            return (
                <Page title={`${course.title}`} className="course-overview">
                    <PageContent>
                        <div className="course-overview">
                            <CoverImage src={course.cover} classname="course-overview__cover"/>
                            <div className="course-overview__info layout__content-block">
                                <h2>{course.title}</h2>
                                <div className="course-overview__summary">
                                    <div className="col-auto course-overview__summary-item">
                                        <i className="far fa-calendar-alt"/>
                                        Начало: {renderDate(course.start, renderDate.date)}
                                    </div>
                                    <div className="col-auto course-overview__summary-item">
                                        <i className="far fa-clock"/>
                                        Длительность: {course.totalHours} часов
                                    </div>
                                </div>
                                <div className="description-text font-size-sm">{course.description}</div>
                            </div>
                            <div className="layout__content-block">
                                <h3>Преподаватели</h3>
                                <div className="course-overview__teachers container negate-block-padding">
                                    <div className="row">
                                        {course.teachers.map((teacher, i) => (
                                            <div className="col-12 col-md d-flex p-0" key={i}>
                                                <Link to={`/teachers/${teacher.id}`}>
                                                    <Teacher teacher={teacher} key={i}/>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="layout__content-block">
                                <h3>Уроки</h3>
                                <List renderItem={this.renderClass}>
                                    {course.classes}
                                </List>
                            </div>
                        </div>
                    </PageContent>
                    <div className="course-overview__offer">
                        <div className="container p-0">
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
                                    <div className="button">
                                        Купить
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Page>
            )
        } else
            return (<Redirect to={`${path}`}/>);
    }
}
