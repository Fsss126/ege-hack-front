import React from 'react';
import _  from 'lodash';
import Catalog from "components/common/Catalog";
import Teacher from "../common/Teacher";

const Filter = (props) => (<Catalog.Filter filterBy={{online: false}} {...props}/>);

const TeachersCatalog = (props) => {
    const renderTeacher = React.useCallback((teacher, props) => (
        <div className="list__item col-12 col-md-6 d-flex" key={teacher.id}>
            <Teacher
                teacher={teacher}
                bio
                {...props}/>
        </div>
    ), []);
    return (
        <Catalog.Catalog
            placeholder="Нет преподавателей, соответствующих условиям поиска"
            flex
            renderFunc={renderTeacher}
            {...props}/>
    );
};

const Body = (props) => {
    const {teachers, ...otherProps} = props;

    const options = React.useMemo(() =>
            _.uniq(_.flatten(teachers.map((teacher) => teacher.subjects))).map(({id, name}) => ({value: id, label: name})),
        [teachers]);

    const getMatchingCourses = React.useCallback((subject) => teachers.filter((teacher) =>
        (subject ? _.find(teacher.subjects, {id: subject}) != null  : true)), [teachers]);

    return (
        <Catalog.Body
            options={options}
            filterItems={getMatchingCourses}
            {...otherProps}/>
    )
};

const Page = (props) => (<Catalog.Page BodyComponent={Body} {...props}/>);

export default {
    ...Catalog,
    Filter,
    Catalog: TeachersCatalog,
    Body,
    Page
}
