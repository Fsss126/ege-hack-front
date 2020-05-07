import {RouteComponentProps} from 'react-router';

export interface RouteComponentPropsWithParentProps<
  Params extends {[K in keyof Params]?: string} = {}
> extends RouteComponentProps<Params> {
  path: string;
  url: string;
}

export interface SubjectPageParams {
  subjectId: string;
}

export interface CoursePageParams {
  courseId: string;
}

export interface TeacherPageParams {
  id: string;
}

export interface LessonPageParams extends CoursePageParams {
  lessonId: string;
}

export interface TestPageParams extends LessonPageParams {
  testId: string;
}

export interface TestTaskPageParams extends TestPageParams {
  taskId: string;
}

export interface ThemePageParams extends SubjectPageParams {
  themeId: string;
}
