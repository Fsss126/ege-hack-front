import React from 'react';
import Catalog, {CatalogBodyProps, CatalogFilter, CatalogProps, FilterParams} from "./Catalog";
import {CourseInfo, SubjectInfo} from "types/entities";

export type CourseCatalogProps<P extends object = {}> = Omit<CatalogProps<CourseInfo, P>, 'emptyPlaceholder' | 'noMatchPlaceholder' | 'renderItem'> & {
    renderCourse: CatalogProps<CourseInfo, P>['renderItem'];
};
const CourseCatalog = <P extends object = {}>(props: CourseCatalogProps<P>): React.ReactElement => {
    const {renderCourse, ...otherProps} = props;
    return (
        <Catalog.Catalog
            emptyPlaceholder="Нет курсов"
            noMatchPlaceholder="Нет курсов, соответствующих условиям поиска"
            renderItem={renderCourse}
            {...otherProps}/>
    );
};

const filter: CatalogFilter<CourseInfo> = (course, {subject, online, search}: FilterParams) => (subject ? course.subject_id === subject : true) &&
    (online ? course.online === online : true) &&
    (search ? course.name.toLowerCase().includes(search.toLowerCase()) : true);

export type CourseBodyProps = Omit<CatalogBodyProps<CourseInfo>, 'items' | 'options' | 'filter'> & {
    courses: CourseInfo[];
    subjects: SubjectInfo[];
}
const Body = (props: CourseBodyProps): React.ReactElement => {
    const {courses, subjects, ...otherProps} = props;

    const options = React.useMemo(() =>
            subjects.map(({id, name}) => ({value: id, label: name})),
        [subjects]);

    return (
        <Catalog.Body
            options={options}
            items={courses}
            filter={filter}
            {...otherProps}/>
    )
};

// const HomeworksPage = (props) => (<Catalog.Page BodyComponent={Body} {...props}/>);

export default {
    ...Catalog,
    Catalog: CourseCatalog,
    Body,
    // Page: HomeworksPage
}
