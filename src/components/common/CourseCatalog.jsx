import React from 'react';
import Catalog from "./Catalog";

const CourseCatalog = ({renderCourse, ...otherProps}) => (
    <Catalog.Catalog
        placeholder="Нет курсов, соответствующих условиям поиска"
        renderItem={renderCourse}
        {...otherProps}/>
);

const Body = (props) => {
    const {courses, subjects, ...otherProps} = props;

    const options = React.useMemo(() =>
            subjects.map(({id, name}) => ({value: id, label: name})),
        [subjects]);

    const getMatchingCourses = React.useCallback((subject, online, search) => courses.filter((course) =>
        (subject ? course.subject_id === subject : true) &&
        (online ? course.online === online : true) &&
        (search ? course.name.toLowerCase().includes(search.toLowerCase()) : true)), [courses]);

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
