import { createStore, applyMiddleware, Store  } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import {Action} from './actions';
import {reducer} from './reducer';
import {
    CourseInfo,
    CourseParticipantInfo,
    Credentials,
    HomeworkInfo,
    LessonInfo,
    SubjectInfo,
    TeacherInfo,
    UserCourseInfo,
    UserInfo,
    WebinarInfo,
    WebinarScheduleInfo
} from "../types/entities";
import {AxiosError} from "axios";
import rootSaga from "./sagas";

export interface AppState {
    credentials: Credentials | null | AxiosError;
    userInfo?: UserInfo | AxiosError;
    shopCourses?: CourseInfo[] | AxiosError;
    userCourses?: UserCourseInfo[] | AxiosError;
    subjects?: SubjectInfo[] | AxiosError;
    teachers?: TeacherInfo[] | AxiosError;
    lessons: { [courseId: number]: LessonInfo[] | AxiosError };
    webinars: {
        [courseId: number]: WebinarInfo[] | AxiosError;
        upcoming?: WebinarInfo[] | AxiosError;
    };
    participants: { [courseId: number]: CourseParticipantInfo[] | AxiosError };
    adminCourses?: CourseInfo[] | AxiosError;
    adminWebinars: { [courseId: number]: WebinarScheduleInfo | AxiosError };
    teacherCourses?: CourseInfo[] | AxiosError;
    homeworks: { [lessonId: number]: HomeworkInfo[] | AxiosError };
}

const sagaMiddleware = createSagaMiddleware();

export type AppStore = Store<AppState, Action>;

export const createAppStore = (): AppStore => {
    const store = createStore(reducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));
    sagaMiddleware.run(rootSaga);
    return store;
};
