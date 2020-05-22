import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent, PageContentProps} from 'components/layout/Page';
import {renderDate} from 'definitions/helpers';
import {KnowledgeTestHookResult} from 'hooks/selectors';
import React from 'react';
import {LessonInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {
  LessonPageParams,
  RouteComponentPropsWithParentProps,
} from 'types/routes';
import {SimpleCallback} from 'types/utility/common';

interface AssignmentPageProps
  extends RouteComponentPropsWithParentProps<LessonPageParams> {
  lesson?: LessonInfo;
  test: KnowledgeTestHookResult['test'];
  isLoaded: boolean;
  parentSection: PageContentProps['parentSection'];
  children: React.ReactNode;
  errors?: any[];
  reloadCallbacks: SimpleCallback[];
}

const TestPage: React.FC<AssignmentPageProps> = (props) => {
  const {
    location,
    lesson,
    test,
    isLoaded,
    children: header,
    parentSection,
    errors,
    reloadCallbacks,
  } = props;

  const title = lesson && `Тест к уроку ${lesson.name}`;

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.TEST_CHECK}
      className="admin-page"
      title={title}
      errors={errors}
      reloadCallbacks={reloadCallbacks}
      location={location}
    >
      {isLoaded && (
        <PageContent parentSection={parentSection}>
          {header}
          {lesson && test ? (
            <ContentBlock>
              <div className="description-text">{test.name}</div>
              {test.deadline && (
                <div>
                  Дедлайн: {renderDate(test.deadline, renderDate.dateWithHour)}
                </div>
              )}
            </ContentBlock>
          ) : (
            <ContentBlock transparent>
              <div className="text-center font-size-sm">Нет теста</div>
            </ContentBlock>
          )}
        </PageContent>
      )}
    </Page>
  );
};

export default TestPage;
