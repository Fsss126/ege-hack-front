import HomeworkAssignment from 'components/common/HomeworkAssignment';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent, PageContentProps} from 'components/layout/Page';
import {HomeworksHookResult} from 'hooks/selectors';
import React from 'react';
import {LessonInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {LessonPageParams, RouteComponentPropsWithPath} from 'types/routes';
import {SimpleCallback} from 'types/utility/common';

interface AssignmentPageProps
  extends RouteComponentPropsWithPath<LessonPageParams> {
  homeworks?: HomeworksHookResult['homeworks'];
  lesson?: LessonInfo;
  isLoaded: boolean;
  parentSection: PageContentProps['parentSection'];
  children: React.ReactNode;
  errors?: any[];
  reloadCallbacks: SimpleCallback[];
}

const AssignmentPage: React.FC<AssignmentPageProps> = (props) => {
  const {
    location,
    lesson,
    isLoaded,
    children: header,
    parentSection,
    errors,
    reloadCallbacks,
  } = props;

  const title = lesson && `Задание к уроку ${lesson.name}`;

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.HOMEWORK_CHECK}
      className="admin-page admin-page--participants"
      title={title}
      errors={errors}
      reloadCallbacks={reloadCallbacks}
      location={location}
    >
      {isLoaded && (
        <PageContent parentSection={parentSection}>
          {header}
          {lesson && lesson.assignment ? (
            <ContentBlock>
              <HomeworkAssignment assignment={lesson.assignment} />
            </ContentBlock>
          ) : (
            <ContentBlock transparent>
              <div className="text-center font-size-sm">
                Нет домашнего задания
              </div>
            </ContentBlock>
          )}
        </PageContent>
      )}
    </Page>
  );
};

export default AssignmentPage;
