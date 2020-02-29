import {
    ActionPattern,
    call,
    put as putEffect,
    PutEffect,
    select,
    spawn,
    take as takeEffect,
    TakeEffect,
    takeLeading,
    actionChannel, takeEvery
} from 'redux-saga/effects'
import {
    Action,
    ActionType, AdminWebinarsFetchAction, CourseDeleteRequestAction,
    CourseWebinarsFetchAction, HomeworksFetchAction,
    LessonDeleteRequestAction,
    LessonsFetchAction, ParticipantsFetchAction, UpcomingWebinarsFetchAction,
    WebinarDeleteRequestAction
} from "./actions";
import Auth from 'definitions/auth';
import {
    CourseInfo, CourseParticipantInfo, HomeworkInfo,
    LessonInfo,
    SubjectInfo,
    TeacherInfo,
    UserCourseInfo,
    UserInfo,
    WebinarInfo, WebinarScheduleInfo
} from "../types/entities";
import {AppState} from "./index";
import {TakeableChannel} from '@redux-saga/core';
import APIRequest from "../api";

const take = (pattern?: ActionPattern<Action>): TakeEffect => takeEffect<Action>(pattern);
const put = (action: Action): PutEffect<Action> => putEffect<Action>(action);

function* fetchUserInfo() {
    yield takeLeading([ActionType.LOG_IN, ActionType.LOG_IN_SUCCESS], function* () {
        try {
            const userInfo: UserInfo = yield call(Auth.getUserInfo);
            yield put({ type: ActionType.USER_INFO_FETCHED, userInfo });
        }
        catch (error) {
            yield put({ type: ActionType.USER_INFO_FETCHED, userInfo: error });
        }
    });
}

function* waitForLogin<A extends Action = Action>(pattern: ActionPattern<A>, saga: (channel: TakeableChannel<A>) => Generator) {
    const channel = yield actionChannel(pattern);
    yield take([ActionType.LOG_IN, ActionType.LOG_IN_SUCCESS]);
    yield spawn(saga, channel);
}

function* fetchSubjects() {
    yield* waitForLogin(ActionType.SUBJECTS_FETCH, function* (channel) {
        yield takeLeading(channel, function* () {
            try {
                const subjects: SubjectInfo[] = yield call(APIRequest.get, '/subjects');
                yield put({ type: ActionType.SUBJECTS_FETCHED, subjects});
            }
            catch (error) {
                yield put({ type: ActionType.USER_INFO_FETCHED, userInfo: error });
            }
        });
    });
}

function* fetchShopCourses() {
    yield* waitForLogin(ActionType.SHOP_COURSES_FETCH, function* (channel) {
        yield takeLeading(channel, function* () {
            try {
                const courses: CourseInfo[] = yield call(APIRequest.get, '/courses', {
                    params: {
                        group: 'MARKET'
                    }
                });
                yield put({ type: ActionType.SHOP_COURSES_FETCHED, courses});
            }
            catch (error) {
                yield put({ type: ActionType.SHOP_COURSES_FETCHED, courses: error });
            }
        });
    });
}

function* fetchUserCourses() {
    yield* waitForLogin(ActionType.USER_COURSES_FETCH, function* (channel) {
        yield takeLeading(channel, function* () {
            try {
                const courses: UserCourseInfo[] = yield call(APIRequest.get, '/courses', {
                    params: {
                        group: 'PERSON'
                    }
                });
                yield put({ type: ActionType.USER_COURSES_FETCHED, courses});
            }
            catch (error) {
                yield put({ type: ActionType.USER_COURSES_FETCHED, courses: error });
            }
        });
    });
}

function* fetchTeachers() {
    yield* waitForLogin(ActionType.TEACHERS_FETCH, function* (channel) {
        yield takeLeading(channel, function* () {
            try {
                const teachers: TeacherInfo[] = yield call(APIRequest.get, '/accounts/teachers');
                yield put({ type: ActionType.TEACHERS_FETCHED, teachers});
            }
            catch (error) {
                yield put({ type: ActionType.TEACHERS_FETCHED, teachers: error });
            }
        });
    });
}

//TODO: handle take leading properly
function* fetchLessons() {
    yield* waitForLogin<LessonsFetchAction>(ActionType.LESSONS_FETCH, function* (channel) {
        yield takeLeading(channel, function* (action: LessonsFetchAction) {
            const {courseId} = action;
            try {
                const lessons: LessonInfo[] = yield call(APIRequest.get, '/lessons', {params: {
                        courseId
                    }});
                yield put({ type: ActionType.LESSONS_FETCHED, lessons, courseId});
            }
            catch (error) {
                yield put({ type: ActionType.LESSONS_FETCHED, lessons: error, courseId });
            }
        });
    });
}

function* fetchCourseWebinars() {
    yield* waitForLogin<CourseWebinarsFetchAction>(ActionType.COURSE_WEBINARS_FETCH, function* (channel) {
        yield takeLeading(channel, function* (action: CourseWebinarsFetchAction) {
            const {courseId} = action;
            try {
                const webinars: WebinarInfo[] = yield call(APIRequest.get, `/courses/${courseId}/schedule/person`);
                yield put({ type: ActionType.COURSE_WEBINARS_FETCHED, webinars, courseId});
            }
            catch (error) {
                yield put({ type: ActionType.COURSE_WEBINARS_FETCHED, webinars: error, courseId });
            }
        });
    });
}

function* fetchUpcomingWebinars() {
    yield* waitForLogin<UpcomingWebinarsFetchAction>(ActionType.UPCOMING_WEBINARS_FETCH, function* (channel) {
        yield takeLeading(channel, function* (action: UpcomingWebinarsFetchAction) {
            try {
                const webinars: WebinarInfo[] = yield call(APIRequest.get, '/courses/schedule/person');
                yield put({ type: ActionType.UPCOMING_WEBINARS_FETCHED, webinars});
            }
            catch (error) {
                yield put({ type: ActionType.UPCOMING_WEBINARS_FETCHED, webinars: error });
            }
        });
    });
}

function* fetchParticipants() {
    yield* waitForLogin<ParticipantsFetchAction>(ActionType.PARTICIPANTS_FETCH, function* (channel) {
        yield takeLeading(channel, function* (action: ParticipantsFetchAction) {
            const {courseId} = action;
            try {
                const participants: CourseParticipantInfo[] = yield call(APIRequest.get, `/courses/${courseId}/participants`);
                yield put({ type: ActionType.PARTICIPANTS_FETCHED, participants, courseId});
            }
            catch (error) {
                yield put({ type: ActionType.PARTICIPANTS_FETCHED, participants: error, courseId });
            }
        });
    });
}

function* fetchAdminCourses() {
    yield* waitForLogin(ActionType.ADMIN_COURSES_FETCH, function* (channel) {
        yield takeLeading(channel, function* () {
            try {
                const courses: CourseInfo[] = yield call(APIRequest.get, '/courses', {
                    params: {
                        group: 'ALL'
                    }
                });
                yield put({ type: ActionType.ADMIN_COURSES_FETCHED, courses});
            }
            catch (error) {
                yield put({ type: ActionType.ADMIN_COURSES_FETCHED, courses: error });
            }
        });
    });
}

function* fetchAdminWebinars() {
    yield* waitForLogin<AdminWebinarsFetchAction>(ActionType.ADMIN_WEBINARS_FETCH, function* (channel) {
        yield takeLeading(channel, function* (action: AdminWebinarsFetchAction) {
            const {courseId} = action;
            try {
                const webinars: WebinarScheduleInfo = yield call(APIRequest.get, `/courses/${courseId}/schedule`);
                yield put({ type: ActionType.ADMIN_WEBINARS_FETCHED, webinars, courseId});
            }
            catch (error) {
                yield put({ type: ActionType.ADMIN_WEBINARS_FETCHED, webinars: error, courseId });
            }
        });
    });
}

function* fetchTeacherCourses() {
    yield* waitForLogin(ActionType.TEACHER_COURSES_FETCH, function* (channel) {
        yield takeLeading(channel, function* () {
            try {
                const courses: CourseInfo[] = yield call(APIRequest.get, '/courses/homeworkCheck');
                yield put({ type: ActionType.TEACHER_COURSES_FETCHED, courses});
            }
            catch (error) {
                yield put({ type: ActionType.TEACHER_COURSES_FETCHED, courses: error });
            }
        });
    });
}

function* fetchHomeworks() {
    yield* waitForLogin<HomeworksFetchAction>(ActionType.HOMEWORKS_FETCH, function* (channel) {
        yield takeLeading(channel, function* (action: HomeworksFetchAction) {
            const {lessonId} = action;
            try {
                const homeworks: HomeworkInfo[] = yield call(APIRequest.get, `/lessons/${lessonId}/homeworks`);
                yield put({ type: ActionType.HOMEWORKS_FETCHED, homeworks, lessonId});
            }
            catch (error) {
                yield put({ type: ActionType.HOMEWORKS_FETCHED, homeworks: error, lessonId });
            }
        });
    });
}

function* processLessonDelete() {
    yield takeEvery(ActionType.LESSON_DELETE_REQUEST, function* (action: LessonDeleteRequestAction) {
        const {courseId, lessonId, onDelete, onError} = action;
        try {
            yield call(APIRequest.delete, `/lessons/${lessonId}`);
            if (onDelete)
                yield call(onDelete, courseId, lessonId);
            yield put({ type: ActionType.LESSON_DELETE, courseId, lessonId});
        }
        catch (error) {
            if (onError)
                yield call(onError, courseId, lessonId, error);
        }
    });
}

function* processCourseDelete() {
    yield takeEvery(ActionType.COURSE_DELETE_REQUEST, function* (action: CourseDeleteRequestAction) {
        const {courseId, onDelete, onError} = action;
        try {
            yield call(APIRequest.delete, `/courses/${courseId}`);
            if (onDelete)
                yield call(onDelete, courseId);
            yield put({type: ActionType.COURSE_DELETE, courseId});
        }
        catch (error) {
            if (onError)
                yield call(onError, courseId, error);
        }
    });
}

function* processWebinarDelete() {
    yield takeEvery(ActionType.WEBINAR_DELETE_REQUEST, function* (action: WebinarDeleteRequestAction) {
        const {courseId, webinarId, webinarsSchedule, onDelete, onError} = action;
        const {course_id, click_meeting_link, image_link, webinars} = webinarsSchedule;
        const requestData = {
            course_id,
            click_meeting_link,
            image: image_link.split('/').pop(),
            webinars: webinars.filter(({id}) => id !== webinarId).map(({date_start, ...rest}) => ({
                ...rest,
                date_start: date_start.getTime()
            }))
        };
        try {
            const responseWebinars: WebinarScheduleInfo = yield call(APIRequest.put, `/courses/${courseId}/schedule`, requestData);
            if (onDelete)
                yield call(onDelete, courseId, webinarId);
            yield put({type: ActionType.WEBINAR_DELETE, courseId, webinarId, responseWebinars});
        }
        catch (error) {
            if (onError)
                yield call(onError, courseId, webinarId, error);
        }
    });
}

function* init() {
    const credentials = yield select((state: AppState) => state.credentials);
    if (credentials) {
        yield put({type: ActionType.LOG_IN});
    }
}

export default function* rootSaga() {
    yield spawn(fetchUserInfo);

    yield spawn(fetchShopCourses);
    yield spawn(fetchUserCourses);
    yield spawn(fetchSubjects);
    yield spawn(fetchTeachers);
    yield spawn(fetchLessons);
    yield spawn(fetchCourseWebinars);
    yield spawn(fetchUpcomingWebinars);
    yield spawn(fetchParticipants);
    yield spawn(fetchAdminCourses);
    yield spawn(fetchAdminWebinars);
    yield spawn(fetchTeacherCourses);
    yield spawn(fetchHomeworks);

    yield spawn(processCourseDelete);
    yield spawn(processLessonDelete);
    yield spawn(processWebinarDelete);
    yield spawn(init);
}
