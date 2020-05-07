import Catalog, {
  CatalogItemRenderer,
  FilterFunc,
} from 'components/common/Catalog';
import Page, {PageContent, PageContentProps} from 'components/layout/Page';
import {HomeworksHookResult} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {HomeworkInfo, LessonInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {
  LessonPageParams,
  RouteComponentPropsWithParentProps,
} from 'types/routes';
import {SimpleCallback} from 'types/utility/common';

import Homework from './Homework';

const filterBy = {
  search: true,
  subject: false,
  online: false,
};

const filter: FilterFunc<HomeworkInfo> = (
  {
    pupil: {
      vk_info: {full_name},
    },
  },
  {search},
) => {
  const userName = full_name.toLowerCase().replace(/\s/g, '');
  const searchKey = search.toLowerCase().replace(/\s/g, '');

  return search ? userName.includes(searchKey) : true;
};

interface HomeworksPageProps
  extends RouteComponentPropsWithParentProps<LessonPageParams> {
  homeworks?: HomeworksHookResult['homeworks'];
  lesson?: LessonInfo;
  isLoaded: boolean;
  parentSection: PageContentProps['parentSection'];
  children: React.ReactNode;
  errors?: any[];
  reloadCallbacks: SimpleCallback[];
}

const HomeworksPage: React.FC<HomeworksPageProps> = (props) => {
  const {
    location,
    homeworks,
    lesson,
    isLoaded,
    children: header,
    parentSection,
    errors,
    reloadCallbacks,
  } = props;

  const renderHomework: CatalogItemRenderer<HomeworkInfo> = useCallback(
    (homework, {link, ...renderProps}) => (
      <Homework key={homework.pupil.id} homework={homework} {...renderProps} />
    ),
    [],
  );
  const title = lesson && `Ученики курса ${lesson.name}`;

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.HOMEWORK_CHECK}
      className="admin-page teaching-page--homeworks"
      title={title}
      errors={errors}
      reloadCallbacks={reloadCallbacks}
      location={location}
    >
      {isLoaded && homeworks && (
        <Catalog.Body items={homeworks} filter={filter}>
          <PageContent parentSection={parentSection}>
            {header}
            <Catalog.Filter filterBy={filterBy} stacked />
            <Catalog.Catalog
              className="users-list"
              emptyPlaceholder="Нет загруженных работ"
              noMatchPlaceholder="Нет совпадающих работ"
              plain
              renderItem={renderHomework}
            />
          </PageContent>
        </Catalog.Body>
      )}
    </Page>
  );
};

export default HomeworksPage;
