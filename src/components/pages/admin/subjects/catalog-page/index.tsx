import {ContentBlock} from 'components/layout/ContentBlock';
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
    <ContentBlock>
      <h2>Предметы</h2>
    </ContentBlock>
  );

  return (
    <SubjectCatalogPage path={path} {...props}>
      {header}
    </SubjectCatalogPage>
  );
};

export default CoursesPage;
