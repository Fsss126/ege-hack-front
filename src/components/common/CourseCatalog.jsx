import React from 'react';
import Catalog from "./Catalog";
import _ from "lodash";

const CourseCatalog = ({renderCourse, ...otherProps}) => (
    <Catalog.Catalog
        placeholder="Нет курсов, соответствующих условиям поиска"
        renderFunc={renderCourse}
        {...otherProps}/>
);

const Body = (props) => {
    const {courses, subjects, ...otherProps} = props;

    const options = React.useMemo(() =>
            subjects.map(({id, name}) => ({value: id, label: name})),
        [subjects]);

    const getMatchingCourses = React.useCallback((subject, online) => courses.filter((course) =>
        (subject ? course.subject_id === subject : true) && (online ? course.online === online : true)), [courses]);

    return (
        <Catalog.Body
            options={options}
            filterItems={getMatchingCourses}
            {...otherProps}/>
    )
};

// const CourseCatalogPage = (props) => (<Catalog.Page BodyComponent={Body} {...props}/>);

export default {
    ...Catalog,
    Catalog: CourseCatalog,
    Body,
    // Page: CourseCatalogPage
}
