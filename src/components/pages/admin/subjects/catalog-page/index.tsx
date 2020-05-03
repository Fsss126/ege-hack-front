import React from 'react';
import {RouteComponentPropsWithPath, SubjectPageParams} from 'types/routes';

import SubjectCatalogPage from './SubjectCatalogPage';

const CoursesPage: React.FC<RouteComponentPropsWithPath<SubjectPageParams>> = (
  props,
) => {
  const {
    match: {path},
  } = props;
  const header = (
    <div className="layout__content-block">
      <h2>Предметы</h2>
    </div>
  );

  return (
    <SubjectCatalogPage path={path} {...props}>
      {header}
    </SubjectCatalogPage>
  );
};

export default CoursesPage;
