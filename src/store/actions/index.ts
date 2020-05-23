export type UserAction = TypedAction<
  typeof import('modules/user/user.actions')
>;

export type SubjectsAction = TypedAction<
  typeof import('modules/subjects/subjects.actions')
>;

export type CoursesAction = TypedAction<
  typeof import('modules/courses/courses.actions')
>;

export type TeachersAction = TypedAction<
  typeof import('modules/teachers/teachers.actions')
>;

export type TestingAction = TypedAction<
  typeof import('modules/testing/testing.actions')
>;

export type LessonsAction = TypedAction<
  typeof import('modules/lessons/lessons.actions')
>;

export type UsersAction = TypedAction<
  typeof import('modules/users/users.actions')
>;

export type HomeworksAction = TypedAction<
  typeof import('modules/homeworks/homeworks.actions')
>;

export type WebinarsAction = TypedAction<
  typeof import('modules/webinars/webinars.actions')
>;

export type ParticipantsAction = TypedAction<
  typeof import('modules/participants/participants.actions')
>;

export type TestsAction = TypedAction<
  typeof import('modules/tests/tests.actions')
>;

export type KnowledgeAction = TypedAction<
  typeof import('modules/knowledge/knowledge.actions')
>;

export type Action =
  | UserAction
  | SubjectsAction
  | CoursesAction
  | TeachersAction
  | TestingAction
  | LessonsAction
  | UsersAction
  | HomeworksAction
  | WebinarsAction
  | ParticipantsAction
  | TestsAction
  | KnowledgeAction;
