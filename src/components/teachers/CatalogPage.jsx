import {PageContent} from "../Page";
import TeachersCatalog from "./TeachersCatalog";
import React from "react";

const CatalogPage = ({catalog, ...props}) => {
    return (
        <TeachersCatalog.Page
            title="Мои курсы"
            className="catalog teachers-catalog"
            teachers={catalog}
            {...props}>
            <PageContent>
                <TeachersCatalog.Filter/>
                <TeachersCatalog.Catalog/>
            </PageContent>
        </TeachersCatalog.Page>
    );
};

export default CatalogPage;
