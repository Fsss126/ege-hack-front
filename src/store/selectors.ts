import React, {useCallback, useEffect, useRef, useState} from "react";
import Auth, {AuthEventTypes} from "definitions/auth";
import APIRequest, {getCancelToken} from "api";
import _ from "lodash";
import {useHistory} from "react-router-dom";
import {useCheckPermissions} from "../components/ConditionalRender";
import {Permission} from "types/enums";
import {useDispatch, useSelector as useSelectorGen} from "react-redux";
import {
    Action,
    ActionType,
    CourseDeleteCallback,
    CourseDeleteErrorCallback,
    LessonDeleteCallback,
    LessonDeleteErrorCallback, WebinarDeleteCallback, WebinarDeleteErrorCallback
} from "./actions";
import {AppState} from "./index";
import {
    CourseInfo, CourseParticipantInfo,
    Credentials,
    DiscountInfo,
    HomeworkInfo,
    LessonInfo,
    SubjectInfo,
    TeacherInfo, WebinarInfo,
    WebinarScheduleInfo
} from "../types/entities";
import {AxiosError, Canceler} from "axios";
import {SimpleCallback} from "types/utility/common";
import {Dispatch} from "redux";

const useSelector = <TSelected>(selector: (state: AppState) => TSelected, equalityFn?: (left: TSelected, right: TSelected) => boolean): TSelected => (
    useSelectorGen(selector, equalityFn)
);



export function useUserAuth(): void {
    const dispatch = useDispatch<Dispatch<Action>>();

    React.useLayoutEffect(() => {
        const loginCallback = (credentials: Credentials | null): void => {
            dispatch({type: ActionType.LOG_IN_SUCCESS, credentials});
        };
        const logoutCallback = (): void => {
            dispatch({type: ActionType.LOG_OUT});
        };
        Auth.subscribe(AuthEventTypes.login, loginCallback);
        Auth.subscribe(AuthEventTypes.logout, logoutCallback);
        return (): void => {
            Auth.unsubscribe(AuthEventTypes.login, loginCallback);
            Auth.unsubscribe(AuthEventTypes.logout, logoutCallback);
        }
    }, [dispatch]);
}

interface RequestsStore {
    [key: string]: any;
}
const requests: RequestsStore = {};

export type UserHookResult = Pick<AppState, 'credentials' | 'userInfo'>;
export function useUser(): UserHookResult {
    const {credentials, userInfo} = useSelector(({credentials, userInfo}) => ({credentials, userInfo}));
    return {credentials, userInfo};
}

export type SubjectsHookResult = {subjects?: SubjectInfo[]; error?: AxiosError; reload: SimpleCallback};
export function useSubjects(): SubjectsHookResult {
    const {subjects} = useSelector(({subjects}) => ({subjects}));
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.SUBJECTS_FETCH});
    }, [dispatch]);
    useEffect(() => {
        if (!subjects)
            dispatchFetchAction();
    }, []);
    return subjects instanceof Error
        ? {error: subjects, reload: dispatchFetchAction}
        : {subjects, reload: dispatchFetchAction};
}

export type DiscountHookResult = {discount?: DiscountInfo; error?: AxiosError; reload: SimpleCallback; isLoading: boolean};
export function useDiscount(selectedCourses: Set<CourseInfo> | CourseInfo): DiscountHookResult {
    const {credentials} = useUser();
    const [discount, setDiscount] = React.useState<DiscountInfo>();
    const [error, setError] = React.useState();
    const [isLoading, setLoading] = React.useState(true);
    const cancelRef = useRef<Canceler>();
    const fetchDiscount = useCallback(async () => {
        const courses = selectedCourses instanceof Set ? [...selectedCourses].map(({id}) => id) : [selectedCourses];
        if (courses.length === 0)
            return ;
        const cancelPrev = cancelRef.current;
        if (cancelPrev)
            cancelPrev();
        const {token: cancelToken, cancel} = getCancelToken();
        cancelRef.current = cancel;
        try {
            if (error)
                setError(undefined);
            // setDiscount(null);
            setLoading(true);
            const discount: DiscountInfo = await APIRequest.get('/payments/discounts', {
                params: {
                    coursesIds: courses
                },
                cancelToken
            });
            setDiscount(discount);
        } catch (e) {
            console.log('error loading discount', e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [selectedCourses, error]);

    React.useEffect(() => {
        if (credentials && !(error))
            fetchDiscount();
    }, [credentials, selectedCourses, error]);

    return {discount, error, reload: fetchDiscount, isLoading};
}

export type TeachersHookResult = {teachers?: TeacherInfo[]; error?: AxiosError; reload: SimpleCallback}
export function useTeachers(): TeachersHookResult {
    const {teachers} = useSelector(({teachers}) => ({teachers}));
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.TEACHERS_FETCH});
    }, [dispatch]);
    useEffect(() => {
        if (!teachers)
            dispatchFetchAction();
    }, []);
    return teachers instanceof Error
        ? {error: teachers, reload: dispatchFetchAction}
        : {teachers, reload: dispatchFetchAction};
}

export type TeacherHookResult = {teacher?: TeacherInfo; error?: AxiosError | true; reload: SimpleCallback};
export function useTeacher(teacherId: number): TeacherHookResult {
    const {teachers, error, reload} = useTeachers();
    const teacher = teachers ? _.find(teachers, {id: teacherId}) : undefined;
    return {
        teacher,
        error: teachers && !teacher ? true : error,
        reload
    }
}

export type ShopCatalogHookResult = {catalog?: CourseInfo[]; error?: AxiosError; reload: SimpleCallback}
export function useShopCatalog(): ShopCatalogHookResult {
    const {shopCourses} = useSelector(({shopCourses}) => ({shopCourses}));
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.SHOP_COURSES_FETCH});
    }, [dispatch]);
    useEffect(() => {
        if (!shopCourses)
            dispatchFetchAction();
    }, []);
    return shopCourses instanceof Error
        ? {error: shopCourses, reload: dispatchFetchAction}
        : {catalog: shopCourses, reload: dispatchFetchAction};
}

export type ShopCourseHookResult = {course?: CourseInfo; error?: AxiosError | true; reload: SimpleCallback}
export function useShopCourse(courseId: number): ShopCourseHookResult {
    const {catalog, error, reload} = useShopCatalog();
    const course = catalog ? _.find(catalog, {id: courseId}) : undefined;
    return {
        course,
        error: catalog && !course ? true : error,
        reload
    }
}

//TODO: check permissions in sagas
export type AdminCoursesHookResult = {catalog?: CourseInfo[] | false; error?: AxiosError; reload: SimpleCallback}
export function useAdminCourses(): AdminCoursesHookResult {
    const isAllowed = useCheckPermissions(Permission.COURSE_EDIT);
    const adminCourses = useSelector(({adminCourses}) => adminCourses);
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.ADMIN_COURSES_FETCH});
    }, [dispatch]);
    useEffect(() => {
        if (isAllowed) {
            if (!adminCourses)
                dispatchFetchAction();
        }
    }, [isAllowed]);
    return adminCourses instanceof Error
        ? {error: adminCourses, reload: dispatchFetchAction}
        : {catalog: !isAllowed ? false : adminCourses, reload: dispatchFetchAction};
}

export type AdminCourseHookResult = {course?: CourseInfo | false; error?: AxiosError | true; reload: SimpleCallback}
export function useAdminCourse(courseId: number): AdminCourseHookResult {
    const {catalog, error, reload} = useAdminCourses();
    const course = catalog ? _.find(catalog, {id: courseId}) : undefined;
    return {
        course: catalog === false ? false : course,
        error: catalog && !course ? true : error,
        reload
    }
}

export type TeacherCoursesHookResult = AdminCoursesHookResult;
export function useTeacherCourses(): TeacherCoursesHookResult {
    const isAllowed = useCheckPermissions(Permission.HOMEWORK_CHECK);
    const teacherCourses = useSelector(({teacherCourses}) => teacherCourses);
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.TEACHER_COURSES_FETCH});
    }, [dispatch]);
    useEffect(() => {
        if (isAllowed) {
            if (!teacherCourses)
                dispatchFetchAction();
        }
    }, [isAllowed]);
    return teacherCourses instanceof Error
        ? {error: teacherCourses, reload: dispatchFetchAction}
        : {catalog: !isAllowed ? false : teacherCourses, reload: dispatchFetchAction};
}

export type TeacherCourseHookResult = AdminCourseHookResult;
export function useTeacherCourse(courseId: number): TeacherCourseHookResult {
    const {catalog, error, reload} = useTeacherCourses();
    const course = catalog ? _.find(catalog, {id: courseId}) : undefined;
    return {
        course,
        error: catalog && !course ? true : error,
        reload
    }
}

export type RevokeCoursesHookResult = (responseCourse: CourseInfo) => void;
export function useRevokeCourses(): RevokeCoursesHookResult {
    const dispatch = useDispatch();

    return useCallback((responseCourse: CourseInfo) => {
        dispatch({type: ActionType.COURSES_REVOKE, responseCourse});
    }, [dispatch]);
}

export type UserCoursesHookResult = {courses?: CourseInfo[]; error?: AxiosError; reload: SimpleCallback}
export function useUserCourses(): UserCoursesHookResult {
    const {userCourses} = useSelector(({userCourses}) => ({userCourses}));
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.USER_COURSES_FETCH});
    }, [dispatch]);
    useEffect(() => {
        if (!userCourses)
            dispatchFetchAction();
    }, []);
    return userCourses instanceof Error
        ? {error: userCourses, reload: dispatchFetchAction}
        : {courses: userCourses, reload: dispatchFetchAction};
}

//TODO: add separe API query
export type UserCourseHookResult = ShopCourseHookResult;
export function useUserCourse(courseId: number): UserCourseHookResult {
    const {courses, error, reload} = useUserCourses();
    const course = courses ? _.find(courses, {id: courseId}) : undefined;
    return {
        course,
        error: courses && !course ? true : error,
        reload
    }
}

export type LessonsHookResult = {lessons?: LessonInfo[]; error?: AxiosError; reload: SimpleCallback};
export function useLessons(courseId: number): LessonsHookResult {
    const lessons = useSelector(({lessons}) => lessons[courseId]);
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.LESSONS_FETCH, courseId});
    }, [dispatch]);
    useEffect(() => {
        if (!lessons)
            dispatchFetchAction();
    }, []);
    return lessons instanceof Error
        ? {error: lessons, reload: dispatchFetchAction}
        : {lessons, reload: dispatchFetchAction};
}

export type RevokeLessonsHookResult = (responseLesson: LessonInfo) => void;
export function useRevokeLessons(courseId: number): RevokeLessonsHookResult {
    const dispatch = useDispatch();

    return useCallback((responseLesson) => {
        dispatch({type: ActionType.LESSONS_REVOKE, courseId, responseLesson});
    }, [dispatch, courseId]);
}

export type LessonHookResult = {lesson?: LessonInfo; error?: AxiosError | true; reload: SimpleCallback}
export function useLesson(courseId: number, lessonId: number): LessonHookResult {
    const {lessons, error, reload} = useLessons(courseId);
    const lesson = lessons ? _.find(lessons, {id: lessonId}) : undefined;
    return {
        lesson,
        error: lessons && !lesson ? true : error,
        reload
    }
}

export type HomeworksHookResult = {homeworks?: HomeworkInfo[] | false; error?: AxiosError; reload: SimpleCallback}
export function useHomeworks(lessonId: number): HomeworksHookResult {
    const isAllowed = useCheckPermissions(Permission.HOMEWORK_CHECK);
    const homeworks = useSelector(({homeworks}) => homeworks[lessonId]);
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.HOMEWORKS_FETCH, lessonId});
    }, [dispatch]);
    useEffect(() => {
        if (isAllowed) {
            if (!homeworks)
                dispatchFetchAction();
        }
    }, [isAllowed]);
    return homeworks instanceof Error
        ? {error: homeworks, reload: dispatchFetchAction}
        : {homeworks: !isAllowed ? false : homeworks, reload: dispatchFetchAction};
}

export type RevokeHomeworksHookResult = (responseHomework: HomeworkInfo) => void;
export function useRevokeHomeworks(lessonId: number): RevokeHomeworksHookResult {
    const dispatch = useDispatch();

    return useCallback((responseHomework) => {
        dispatch({type: ActionType.HOMEWORKS_REVOKE, lessonId, responseHomework});
    }, [dispatch, lessonId]);
}

export type AdminLessonsHookResult = {lessons?: LessonInfo[] | false; error?: AxiosError; reload: SimpleCallback};
export function useAdminLessons(courseId: number): AdminLessonsHookResult {
    const {lessons, error, reload} = useLessons(courseId);
    const isAllowed = useCheckPermissions(Permission.LESSON_EDIT);

    return {lessons: !isAllowed ? false : lessons, error, reload};
}

export type AdminLessonHookResult = {lesson?: LessonInfo | false; error?: AxiosError | true; reload: SimpleCallback};
export function useAdminLesson(courseId: number, lessonId: number): AdminLessonHookResult {
    const {lesson, error, reload} = useLesson(courseId, lessonId);
    const isAllowed = useCheckPermissions(Permission.LESSON_EDIT);

    return {lesson: !isAllowed ? false : lesson, error, reload};
}

export type ParticipantsHookResult = {participants?: CourseParticipantInfo[] | false; error?: AxiosError | true; reload: SimpleCallback};
export function useParticipants(courseId: number): ParticipantsHookResult {
    const isAllowed = useCheckPermissions(Permission.PARTICIPANT_MANAGEMENT);
    const participants = useSelector(({participants}) => participants[courseId]);
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.PARTICIPANTS_FETCH, courseId});
    }, [dispatch]);
    useEffect(() => {
        if (isAllowed) {
            if (!participants)
                dispatchFetchAction();
        }
    }, [isAllowed]);
    return participants instanceof Error
        ? {error: participants, reload: dispatchFetchAction}
        : {participants: !isAllowed ? false : participants, reload: dispatchFetchAction};
}

export type RevokeParticipantsHookResult = (responseParticipants: CourseParticipantInfo[]) => void;
export function useRevokeParticipants(courseId: number): RevokeParticipantsHookResult {
    const dispatch = useDispatch();

    return useCallback((responseParticipants) => {
        dispatch({type: ActionType.PARTICIPANTS_REVOKE, courseId, responseParticipants});
    }, [dispatch, courseId]);
}

export type AdminWebinarsHookResult = {webinars?: WebinarScheduleInfo | false; error?: AxiosError | true; reload: SimpleCallback};
export function useAdminWebinars(courseId: number): AdminWebinarsHookResult {
    const isAllowed = useCheckPermissions(Permission.WEBINAR_EDIT);
    const webinars = useSelector(({adminWebinars}) => adminWebinars[courseId]);
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.ADMIN_WEBINARS_FETCH, courseId});
    }, [dispatch]);
    useEffect(() => {
        if (isAllowed) {
            if (!webinars)
                dispatchFetchAction();
        }
    }, [isAllowed]);
    return webinars instanceof Error
        ? {error: webinars, reload: dispatchFetchAction}
        : {webinars: !isAllowed ? false : webinars, reload: dispatchFetchAction};
}

export type RevokeWebinarssHookResult = (responseWebinars: WebinarScheduleInfo) => void;
export function useRevokeWebinars(courseId: number): RevokeWebinarssHookResult {
    const dispatch = useDispatch();

    return useCallback((responseWebinars) => {
        dispatch({type: ActionType.WEBINARS_REVOKE, courseId, responseWebinars});
    }, [dispatch, courseId]);
}

export type HomeworkHookResult = {homework?: HomeworkInfo; error?: AxiosError; reload: SimpleCallback};
export function useHomework(lessonId: number): HomeworkHookResult {
    const {credentials} = useUser();
    const [homework, setHomework] = useState<HomeworkInfo>();
    const [error, setError] = useState<AxiosError>();
    const fetchHomework = useCallback(async () => {
        if (requests.homework && requests.homework[lessonId])
            return requests.homework[lessonId];
        const request = APIRequest.get<HomeworkInfo>(`/lessons/${lessonId}/homeworks/pupil`);
        (requests.homework || (requests.homework = {}))[lessonId] = request;
        try {
            if (error)
                setError(undefined);
            const homework: HomeworkInfo = await request as any;
            console.log('set homework', homework);
            setHomework(homework);
        } catch (e) {
            console.error(e);
            setError(e);
        }
        finally {
            delete requests.homework[lessonId];
        }
        return request;
    }, [error, lessonId]);

    React.useEffect(() => {
        if (credentials && !(homework || homework === null || (requests.homework && requests.homework[lessonId]) || error)) {
            fetchHomework();
        }
    }, [credentials, homework, lessonId, error]);

    return {homework, error, reload: fetchHomework};
}

export type UpcomingWebinarsHookResult = {webinars?: WebinarInfo[] | false; error?: AxiosError; reload: SimpleCallback}
export function useUpcomingWebinars(): UpcomingWebinarsHookResult {
    const webinars = useSelector(({webinars}) => webinars.upcoming);
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.UPCOMING_WEBINARS_FETCH});
    }, [dispatch]);
    useEffect(() => {
        if (!webinars)
            dispatchFetchAction();
    }, []);
    return webinars instanceof Error
        ? {error: webinars, reload: dispatchFetchAction}
        : {webinars, reload: dispatchFetchAction};
}

export type CourseWebinarsHookResult = UpcomingWebinarsHookResult;
export function useCourseWebinars(courseId: number): CourseWebinarsHookResult {
    const webinars = useSelector(({webinars}) => webinars[courseId]);
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.COURSE_WEBINARS_FETCH, courseId});
    }, [dispatch]);
    useEffect(() => {
        if (!webinars)
            dispatchFetchAction();
    }, []);
    return webinars instanceof Error
        ? {error: webinars, reload: dispatchFetchAction}
        : {webinars, reload: dispatchFetchAction};
}

export type RedirectHookResult = SimpleCallback;
function useRedirect(redirectUrl?: string): RedirectHookResult {
    const history = useHistory();
    return  useCallback(() => {
        redirectUrl && history.replace(redirectUrl);
    }, [history, redirectUrl]);
}

export type DeleteCourseHookResult = (courseId: number) => void;
export function useDeleteCourse(redirectUrl?: string, onDelete?: CourseDeleteCallback, onError?: CourseDeleteErrorCallback): DeleteCourseHookResult {
    const dispatch = useDispatch();
    const redirectIfSupplied = useRedirect(redirectUrl);

    const deleteCallback = useCallback((courseId) => {
        redirectIfSupplied();
        onDelete && onDelete(courseId);
    }, [redirectIfSupplied, onDelete]);

    return useCallback((courseId) => {
        dispatch({type: ActionType.COURSE_DELETE_REQUEST, courseId, deleteCallback, onError});
    }, [dispatch, deleteCallback, onError]);
}

export type DeleteLessonHookResult = (courseId: number, lessonId: number) => void;
export function useDeleteLesson(redirectUrl?: string, onDelete?: LessonDeleteCallback, onError?: LessonDeleteErrorCallback): DeleteLessonHookResult {
    const dispatch = useDispatch();
    const redirectIfSupplied = useRedirect(redirectUrl);

    const deleteCallback = useCallback((courseId, lessonId) => {
        redirectIfSupplied();
        onDelete && onDelete(courseId, lessonId);
    }, [redirectIfSupplied, onDelete]);

    return useCallback((courseId, lessonId) => {
        dispatch({type: ActionType.LESSON_DELETE_REQUEST, courseId, lessonId, deleteCallback, onError});
    }, [dispatch, deleteCallback, onError]);
}

export type DeleteWebinarHookResult = (courseId: number, webinarId: number, webinarsSchedule: WebinarScheduleInfo) => void;
export function useDeleteWebinar(redirectUrl?: string, onDelete?: WebinarDeleteCallback, onError?: WebinarDeleteErrorCallback): DeleteWebinarHookResult {
    const dispatch = useDispatch();
    const redirectIfSupplied = useRedirect(redirectUrl);

    const deleteCallback = useCallback((courseId, lessonId) => {
        redirectIfSupplied();
        onDelete && onDelete(courseId, lessonId);
    }, [redirectIfSupplied, onDelete]);

    return useCallback((courseId, webinarId, webinarsSchedule) => {
        dispatch({type: ActionType.WEBINAR_DELETE_REQUEST, courseId, webinarId, webinarsSchedule, deleteCallback, onError});
    }, [dispatch, deleteCallback, onError]);
}
