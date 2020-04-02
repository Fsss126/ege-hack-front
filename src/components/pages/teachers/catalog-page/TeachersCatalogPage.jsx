import React from "react";
import Page, {PageContent} from "components/Page";
import TeachersCatalog from "./TeachersCatalog";
import {useSubjects, useTeachers} from "hooks/selectors";

const TeachersCatalogPage = ({location}) => {
    const {teachers, error, retry} = useTeachers();
    const {subjects, error: errorLoadingSubjects, retry: reloadSubjects} = useSubjects();
    const isLoaded = teachers && subjects;
    return (
        <Page
            isLoaded={isLoaded}
            title="Преподаватели"
            className="catalog teachers-catalog"
            location={location}>
            {isLoaded && (
                <TeachersCatalog.Body
                    subjects={subjects}
                    teachers={teachers}>
                    <PageContent>
                        <TeachersCatalog.Filter/>
                        <TeachersCatalog.Catalog/>
                    </PageContent>
                </TeachersCatalog.Body>
            )}
        </Page>
    );
};

export default TeachersCatalogPage;
