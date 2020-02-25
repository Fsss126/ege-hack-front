import React, {useCallback} from "react";
import Page, {PageContent} from "components/Page";
import Catalog from "components/common/Catalog";
import Homework from "./Homework";
import {Permissions} from "types/common";

const filterBy = {
    search: true,
    subject: false,
    online: false
};

const filter = ({pupil: {vk_info: {full_name}}}, {search}) => {
    const userName = full_name.toLowerCase().replace(/\s/g, '');
    const searchKey = search.toLowerCase().replace(/\s/g, '');
    return search ? userName.includes(searchKey) : true
};

const HomeworksPage = (props) => {
    const {match: {params: {courseId: param_course, lessonId: param_lesson}}, location, homeworks, lesson, isLoaded, children: header, parentSection, path} = props;
    const courseId = parseInt(param_course);
    const lessonId = parseInt(param_lesson);

    const renderHomework = useCallback((homework, {link, ...renderProps}) => (
        <Homework key={homework.pupil.id} homework={homework} {...renderProps}/>
    ), []);
    const title = lesson && `Ученики курса ${lesson.name}`;
    return (
        <Page
            isLoaded={isLoaded}
            requiredPermissions={Permissions.HOMEWORK_CHECK}
            className="admin-page teaching-page--homeworks"
            title={title}
            location={location}>
            {isLoaded && (
                <Catalog.Body
                    items={homeworks}
                    filter={filter}>
                    <PageContent parentSection={parentSection}>
                        {header}
                        <Catalog.Filter filterBy={filterBy}>
                        </Catalog.Filter>
                        <Catalog.Catalog
                            className="users-list"
                            emptyPlaceholder="Нет загруженных работ"
                            noMatchPlaceholder="Нет совпадающих работ"
                            adaptive={false}
                            plain
                            renderItem={renderHomework}/>
                    </PageContent>
                </Catalog.Body>
            )}
        </Page>
    );
};

export default HomeworksPage;
