import CourseSchedule from 'components/common/CourseSchedule';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent, PageParentSection} from 'components/layout/Page';
import React, {useMemo} from 'react';
import {CourseInfo, WebinarScheduleInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {RouteComponentPropsWithParentProps} from 'types/routes';
import {SimpleCallback} from 'types/utility/common';

export type SchedulePageProps = RouteComponentPropsWithParentProps & {
  parentSection?: PageParentSection;
  children: React.ReactNode;
  course?: CourseInfo;
  webinars?: WebinarScheduleInfo;
  isLoaded: boolean;
  errors?: any[];
  reloadCallbacks: SimpleCallback[];
};

const SchedulePage: React.FC<SchedulePageProps> = (props) => {
  const {
    location,
    children: header,
    course,
    webinars: webinarSchedule,
    isLoaded,
    parentSection,
    errors,
    reloadCallbacks,
  } = props;

  const webinars = webinarSchedule ? webinarSchedule.webinars : undefined;
  const courses = useMemo(() => (course ? [course] : undefined), [course]);

  const title = course && `Расписание курса ${course.name}`;

  return (
    <Page
      isLoaded={isLoaded}
      loadUserInfo
      requiredPermissions={Permission.WEBINAR_EDIT}
      className="admin-page admin-page--webinars"
      title={title}
      errors={errors}
      reloadCallbacks={reloadCallbacks}
      location={location}
    >
      {isLoaded && webinars && course && (
        <PageContent parentSection={parentSection}>
          {header}
          <ContentBlock stacked>
            <CourseSchedule courses={courses} webinars={webinars} />
          </ContentBlock>
        </PageContent>
      )}
    </Page>
  );
};

export default SchedulePage;
