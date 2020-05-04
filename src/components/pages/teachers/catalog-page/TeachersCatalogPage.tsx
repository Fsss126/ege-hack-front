import Page, {PageContent} from 'components/layout/Page';
import {useSubjects, useUserTeachers} from 'hooks/selectors';
import React from 'react';
import {RouteComponentProps} from 'react-router';

import TeachersCatalog from './TeachersCatalog';

const TeachersCatalogPage: React.FC<RouteComponentProps> = ({location}) => {
  const {teachers, error, reload} = useUserTeachers();
  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();
  const isLoaded = !!(teachers && subjects);

  return (
    <Page isLoaded={isLoaded} title="Преподаватели" location={location}>
      {isLoaded && teachers && subjects && (
        <TeachersCatalog.Body subjects={subjects} teachers={teachers}>
          <PageContent>
            <TeachersCatalog.Catalog
              filter={<TeachersCatalog.Filter />}
              title="Преподаватели"
            />
          </PageContent>
        </TeachersCatalog.Body>
      )}
    </Page>
  );
};

export default TeachersCatalogPage;
