import Catalog, {
  CatalogItemRenderer,
  FilterFunc,
} from 'components/common/Catalog';
import Page, {PageContent, PageContentProps} from 'components/layout/Page';
import {KnowledgeTestHookResult, useTestResults} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {LessonInfo, TestResultInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {RouteComponentPropsWithParentProps, TestPageParams} from 'types/routes';
import {SimpleCallback} from 'types/utility/common';

import TestResult from './TestResult';

const filterBy = {
  search: true,
  subject: false,
  online: false,
};

const filter: FilterFunc<TestResultInfo> = (
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
  extends RouteComponentPropsWithParentProps<TestPageParams> {
  test: KnowledgeTestHookResult['test'];
  lesson?: LessonInfo;
  isLoaded: boolean;
  parentSection: PageContentProps['parentSection'];
  children: React.ReactNode;
  errors?: any[];
  reloadCallbacks: SimpleCallback[];
}

const TestResultsPage: React.FC<HomeworksPageProps> = (props) => {
  const {
    location,
    lesson,
    isLoaded,
    children: header,
    parentSection,
    errors,
    reloadCallbacks,
    match,
  } = props;

  const {
    params: {lessonId: param_lesson, testId: param_test},
  } = match;
  const lessonId = parseInt(param_lesson);
  const testId = parseInt(param_test);

  const {
    results,
    error: errorLoadingTestResults,
    reload: reloadTestResults,
  } = useTestResults(lessonId, testId);

  const renderResult: CatalogItemRenderer<TestResultInfo> = useCallback(
    (result, {link, ...renderProps}) => (
      <TestResult key={result.pupil.id} result={result} {...renderProps} />
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
      errors={[...errors, errorLoadingTestResults]}
      reloadCallbacks={[...reloadCallbacks, reloadTestResults]}
      location={location}
    >
      {isLoaded && results && (
        <Catalog.Body items={results} filter={filter}>
          <PageContent parentSection={parentSection}>
            {header}
            <Catalog.Filter filterBy={filterBy} stacked />
            <Catalog.Catalog
              className="users-list"
              emptyPlaceholder="Нет результатов теста"
              noMatchPlaceholder="Нет совпадающих результатов"
              plain
              renderItem={renderResult}
            />
          </PageContent>
        </Catalog.Body>
      )}
    </Page>
  );
};

export default TestResultsPage;
