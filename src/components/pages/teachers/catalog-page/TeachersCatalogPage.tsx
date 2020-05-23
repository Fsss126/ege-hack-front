import Page, {PageContent} from 'components/layout/Page';
import {useSubjects} from 'modules/subjects/subjects.hooks';
import {useTeachers} from 'modules/teachers/teachers.hooks';
import React from 'react';
import {RouteComponentProps} from 'react-router';

import TeachersCatalog from './TeachersCatalog';

const TeachersCatalogPage: React.FC<RouteComponentProps> = ({location}) => {
  const {
    teachers,
    error: errorLoadingTeachers,
    reload: reloadTeachers,
  } = useTeachers();
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
      location={location}
      errors={[errorLoadingSubjects, errorLoadingTeachers]}
      reloadCallbacks={[reloadSubjects, reloadTeachers]}
    >
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
