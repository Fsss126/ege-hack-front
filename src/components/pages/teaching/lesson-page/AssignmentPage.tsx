import HomeworkAssignment from 'components/common/HomeworkAssignment';
import Page, {PageContent, PageContentProps} from 'components/layout/Page';
import {HomeworksHookResult} from 'hooks/selectors';
import React from 'react';
import {LessonInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {LessonPageParams, RouteComponentPropsWithPath} from 'types/routes';

interface AssignmentPageProps
  extends RouteComponentPropsWithPath<LessonPageParams> {
  homeworks?: HomeworksHookResult['homeworks'];
  lesson?: LessonInfo;
  isLoaded: boolean;
  parentSection: PageContentProps['parentSection'];
  children: React.ReactNode;
}

const AssignmentPage: React.FC<AssignmentPageProps> = (props) => {
  const {location, lesson, isLoaded, children: header, parentSection} = props;

  const title = lesson && `Задание к уроку ${lesson.name}`;

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.HOMEWORK_CHECK}
      className="admin-page admin-page--participants"
      title={title}
      location={location}
    >
      {isLoaded && (
        <PageContent parentSection={parentSection}>
          {header}
          {lesson && lesson.assignment ? (
            <div className="layout__content-block">
              <HomeworkAssignment assignment={lesson.assignment} />
            </div>
          ) : (
            <div className="layout__content-block layout__content-block--transparent">
              <div className="text-center font-size-sm">
                Нет домашнего задания
              </div>
            </div>
          )}
        </PageContent>
      )}
    </Page>
  );
};

export default AssignmentPage;
