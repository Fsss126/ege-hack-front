import React from "react";
import Page, {PageContent, PageLoadingPlaceholder} from "components/Page";
import TeachersCatalog from "./TeachersCatalog";
import {useTeachers} from "store";

const TeachersCatalogPage = ({location}) => {
    const {teachers, subjects, error, retry} = useTeachers();
    return (
        <Page
            title="Преподаватели"
            className="catalog teachers-catalog"
            location={location}>
            {!(teachers && subjects) ? (
                    <PageLoadingPlaceholder/>
                ) : (
                <TeachersCatalog.Body
                    subjects={subjects}
                    teachers={teachers}>
                    <PageContent>
                        <TeachersCatalog.Filter/>
                        <TeachersCatalog.Catalog/>
                    </PageContent>
                </TeachersCatalog.Body>
            )
            }
        </Page>
    );
};

export default TeachersCatalogPage;
