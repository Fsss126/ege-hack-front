import React from 'react';
import List from "./List";
import Input from "../ui/Input";
import _ from "lodash";
import Page from "../Page";

export const CourseCatalogContext = React.createContext({});

const Filter = () => {
    const {options, subject, online, onChange} = React.useContext(CourseCatalogContext);
    return (
        <div className="layout__content-block course-catalog__filters">
            <div className="container p-0">
                <div className="row">
                    <div className="col-auto d-flex align-items-center">
                        <Input.Select
                            name="subject"
                            options={options}
                            value={subject}
                            selectProps={selectProps}
                            callback={onChange}/>
                    </div>
                    <div className="col-auto d-flex align-items-center">
                        <Input.CheckBox
                            name="online"
                            value={online}
                            label="Онлайн"
                            onChange={onChange}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Catalog = ({renderCourse: renderFunc}) => {
    const {courses} = React.useContext(CourseCatalogContext);
    const renderCourse = React.useCallback((item) => {
        return renderFunc(item, {link: `${item.id}/`});
    }, [renderFunc]);
    return (
        <div className="layout__content-block course-catalog__catalog">
            {courses.length > 0 ? (
                <List
                    renderItem={renderCourse}>
                    {courses}
                </List>
            ) : (
                <div className="course-catalog__empty-catalog-fallback-message text-center font-size-sm">
                    Нет курсов, соответствующих условиям поиска
                </div>
            )}
        </div>
    );
};

const selectProps = {isClearable: true, placeholder: 'Предмет'};

const CourseCatalog = (props) => {
    const {courses, className, location, history, children, title} = props;
    const params = new URLSearchParams(location.search);
    const subject = params.get('subject') || null;
    const online = params.get('online') === 'true';
    const options = React.useMemo(() =>
        _.uniq(courses.map((course) => course.subject)).map(({id, name}) => ({value: id, label: name})),
        [courses]);
    const onFilterChange = React.useCallback((value, name) => {
        const params = new URLSearchParams(location.search);
        if (value)
            params.set(name, value);
        else
            params.delete(name);
        // setSubject(option);
        history.push({
            pathname: location.pathname,
            search: `?${params}`
        });
        }, [location, history]);
    const matchingCourses = courses.filter((course) =>
        (subject ? course.subject.id === subject : true) && (online ? course.online === online : true));
    return (
        <Page title={title} className={`course-catalog ${className || ''}`}>
            <CourseCatalogContext.Provider
                value={{
                    options, subject, online, onChange: onFilterChange, courses: matchingCourses
                }}>
                {children}
            </CourseCatalogContext.Provider>
        </Page>
    )
};

export default {
    Filter,
    Catalog,
    Body: React.memo(CourseCatalog)
};
