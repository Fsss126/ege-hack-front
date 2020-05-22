import {ContentBlock} from 'components/layout/ContentBlock';
import React from 'react';
import {
  RouteComponentPropsWithParentProps,
  SubjectPageParams,
} from 'types/routes';

import SubjectCatalogPage from './SubjectCatalogPage';

const CoursesPage: React.FC<RouteComponentPropsWithParentProps<
  SubjectPageParams
>> = (props) => {
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
