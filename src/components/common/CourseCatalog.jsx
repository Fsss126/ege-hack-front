import React from 'react';
import Select from "components/ui/Select";
import List from "./List";
import Input from "../ui/Input";
import _ from "lodash";

const selectProps = {isClearable: true, placeholder: 'Предмет'};

export default function CourseCatalog(props) {
    console.log(props);
    const {courses, renderCourse, className, location, history} = props;
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
        <div className={`course-catalog ${className || ''}`}>
            <div className="layout__content-block course-catalog__filters">
                <div className="container p-0">
                    <div className="row">
                        <div className="col-auto d-flex align-items-center">
                            <Select
                                name="subject"
                                options={options}
                                value={subject}
                                selectProps={selectProps}
                                callback={onFilterChange}/>
                        </div>
                        <div className="col-auto d-flex align-items-center">
                            <Input.CheckBox
                                name="online"
                                value={online}
                                label="Онлайн"
                                onChange={onFilterChange}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="layout__content-block">
                {matchingCourses.length > 0 ? (
                    <List className="course-catalog__catalog" renderItem={renderCourse}>
                        {matchingCourses}
                    </List>
                ) : (
                    <div className="course-catalog__empty-catalog-fallback-message text-center font-size-sm">
                        Нет курсов, соответствующих условиям поиска
                    </div>
                )}
            </div>
        </div>
    )
}
