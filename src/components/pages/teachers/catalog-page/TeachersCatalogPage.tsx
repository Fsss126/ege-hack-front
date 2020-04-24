import Page, {PageContent} from 'components/Page';
import {useSubjects, useTeachers} from 'hooks/selectors';
import React from 'react';
import {RouteComponentProps} from 'react-router';

import TeachersCatalog from './TeachersCatalog';

const TeachersCatalogPage: React.FC<RouteComponentProps> = ({location}) => {
  const {teachers, error, reload} = useTeachers();
  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();
  const isLoaded = !!(teachers && subjects);

  return (
    <Page
      isLoaded={isLoaded}
      title="Преподаватели"
      className="catalog teachers-catalog"
      location={location}
    >
      {isLoaded && (
        <TeachersCatalog.Body subjects={subjects} teachers={teachers}>
          <PageContent>
            <TeachersCatalog.Filter />
            <TeachersCatalog.Catalog />
          </PageContent>
        </TeachersCatalog.Body>
      )}
    </Page>
  );
};

export default TeachersCatalogPage;
