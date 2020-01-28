import React from 'react';
import _  from 'lodash';
import Catalog from "components/common/Catalog";
import Teacher from "components/common/Teacher";

const Filter = (props) => (<Catalog.Filter filterBy={{online: false}} {...props}/>);

const TeachersCatalog = (props) => {
    const renderTeacher = React.useCallback((teacher, {link, subjects, ...rest}) => (
        <div className="list__item col-12 col-md-6 d-flex" key={teacher.id}>
            <Teacher
                teacher={teacher}
                subjects={subjects}
                bio
                link={link}
                {...rest}/>
        </div>
    ), []);
    return (
        <Catalog.Catalog
            placeholder="Нет преподавателей, соответствующих условиям поиска"
            flex
            alignment={"align-items-start"}
            renderItem={renderTeacher}
            {...props}/>
    );
};

const Body = (props) => {
    const {teachers, subjects, ...otherProps} = props;

    const options = React.useMemo(() => {
        const subjectsMap = _.zipObject(subjects.map(({id}) => id), subjects);
        const subjectsTeachers = _.reduce(teachers, (result, teacher) => {
            teacher.subjects.forEach(subject => {result[subject.id] = subject});
            return result;
        }, {});
        return _.values(subjectsTeachers).map(({id, name}) => ({value: id, label: name}));
    }, [teachers, subjects]);

    const getMatchingCourses = React.useCallback((subject) => teachers.filter((teacher) =>
        (subject ? teacher.subjects.some(({id}) => subject === id)  : true)), [teachers]);

    return (
        <Catalog.Body
            options={options}
            renderProps={{subjects}}
            filterItems={getMatchingCourses}
            {...otherProps}/>
    )
};

// const Page = (props) => (<Catalog.Page BodyComponent={Body} {...props}/>);

export default {
    ...Catalog,
    Filter,
    Catalog: TeachersCatalog,
    Body,
    // Page
}
