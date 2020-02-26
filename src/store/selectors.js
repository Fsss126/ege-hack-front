import React, {useCallback, useEffect, useRef} from "react";
import Auth, {AuthEventTypes} from "definitions/auth";
import APIRequest, {getCancelToken} from "api";
import _ from "lodash";
import {useHistory} from "react-router-dom";
import {useCheckPermissions} from "../components/ConditionalRender";
import {Permissions} from "types/common";
import {useDispatch, useSelector} from "react-redux";
import {ActionType} from "./actions";

export function useUserAuth() {
    const {credentials, userInfo} = useSelector(({credentials, userInfo}) => ({credentials, userInfo}));
    const dispatch = useDispatch();

    React.useLayoutEffect(() => {
        const loginCallback = (credentials) => {
            dispatch({type: ActionType.LOG_IN_SUCCESS, credentials});
        };
        const logoutCallback = () => {
            dispatch({type: ActionType.LOG_OUT});
        };
        Auth.subscribe(AuthEventTypes.login, loginCallback);
        Auth.subscribe(AuthEventTypes.logout, logoutCallback);
        return () => {
            Auth.unsubscribe(AuthEventTypes.login, loginCallback);
            Auth.unsubscribe(AuthEventTypes.logout, logoutCallback);
        }
    }, [dispatch]);
    return {credentials, userInfo};
}

const requests = {};

export function useUser() {
    const {credentials, userInfo} = useSelector(({credentials, userInfo}) => ({credentials, userInfo}));
    return {credentials, userInfo};
}

export function useSubjects() {
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
        ? {subjects: undefined, error: subjects, reload: dispatchFetchAction}
        : {subjects, reload: dispatchFetchAction};
}

export function useDiscount(selectedCourses) {
    const {credentials} = useUser();
    const [discount, setDiscount] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [isLoading, setLoading] = React.useState(true);
    const cancelRef = useRef();
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
                setError(null);
            // setDiscount(null);
            setLoading(true);
            const discount = await APIRequest.get('/payments/discounts', {
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

export function useTeachers() {
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

export function useTeacher(teacherId) {
    const {teachers, error, reload} = useTeachers();
    const teacher = teachers ? _.find(teachers, {id: teacherId}) : undefined;
    return {
        teacher,
        error: teachers && !teacher ? true : error,
        reload
    }
}

export function useShopCatalog() {
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

export function useShopCourse(courseId) {
    const {catalog, error, reload} = useShopCatalog();
    const course = catalog ? _.find(catalog, {id: courseId}) : undefined;
    return {
        course,
        error: catalog && !course ? true : error,
        reload
    }
}

//TODO: check permissions in sagas
export function useAdminCourses() {
    const isAllowed = useCheckPermissions(Permissions.COURSE_EDIT);
    const adminCourses = useSelector(({adminCourses}) => adminCourses);
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.ADMIN_COURSES_FETCH});
    }, [dispatch]);
    useEffect(() => {
        if (isAllowed === true) {
            if (!adminCourses)
                dispatchFetchAction();
        }
    }, [isAllowed]);
    return adminCourses instanceof Error
        ? {error: adminCourses, reload: dispatchFetchAction}
        : {catalog: isAllowed === false ? false : adminCourses, reload: dispatchFetchAction};
}

export function useAdminCourse(courseId) {
    const {catalog, error, reload} = useAdminCourses();
    const course = catalog ? _.find(catalog, {id: courseId}) : undefined;
    return {
        course: catalog === false ? false : course,
        error: catalog && !course ? true : error,
        reload
    }
}

export function useTeacherCourses() {
    const isAllowed = useCheckPermissions(Permissions.HOMEWORK_CHECK);
    const teacherCourses = useSelector(({teacherCourses}) => teacherCourses);
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.TEACHER_COURSES_FETCH});
    }, [dispatch]);
    useEffect(() => {
        if (isAllowed === true) {
            if (!teacherCourses)
                dispatchFetchAction();
        }
    }, [isAllowed]);
    return teacherCourses instanceof Error
        ? {error: teacherCourses, reload: dispatchFetchAction}
        : {catalog: isAllowed === false ? false : teacherCourses, reload: dispatchFetchAction};
}

export function useTeacherCourse(courseId) {
    const {catalog, error, reload} = useTeacherCourses();
    const course = catalog ? _.find(catalog, {id: courseId}) : undefined;
    return {
        course,
        error: catalog && !course ? true : error,
        reload
    }
}

export function useRevokeCourses() {
    const dispatch = useDispatch();

    return useCallback((responseCourse) => {
        dispatch({type: ActionType.COURSES_REVOKE, responseCourse});
    }, [dispatch]);
}

export function useUserCourses() {
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
export function useUserCourse(courseId) {
    const {courses, error, reload} = useUserCourses();
    const course = courses ? _.find(courses, {id: courseId}) : undefined;
    return {
        course,
        error: courses && !course ? true : error,
        reload
    }
}

export function useLessons(courseId) {
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

export function useRevokeLessons(courseId) {
    const dispatch = useDispatch();

    return useCallback((responseLesson) => {
        dispatch({type: ActionType.LESSONS_REVOKE, courseId, responseLesson});
    }, [dispatch, courseId]);
}

export function useLesson(courseId, lessonId) {
    const {lessons, error, reload} = useLessons(courseId);
    const lesson = lessons ? _.find(lessons, {id: lessonId}) : undefined;
    return {
        lesson,
        error: lessons && !lesson ? true : error,
        reload
    }
}

export function useTeacherHomeworks(lessonId) {
    const isAllowed = useCheckPermissions(Permissions.HOMEWORK_CHECK);
    const homeworks = useSelector(({homeworks}) => homeworks[lessonId]);
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.HOMEWORKS_FETCH, lessonId});
    }, [dispatch]);
    useEffect(() => {
        if (isAllowed === true) {
            if (!homeworks)
                dispatchFetchAction();
        }
    }, [isAllowed]);
    return homeworks instanceof Error
        ? {error: homeworks, reload: dispatchFetchAction}
        : {homeworks: isAllowed === false ? false : homeworks, reload: dispatchFetchAction};
}

export function useRevokeTeacherHomeworks(lessonId) {
    const dispatch = useDispatch();

    return useCallback((responseHomework) => {
        dispatch({type: ActionType.HOMEWORKS_REVOKE, lessonId, responseHomework});
    }, [dispatch, lessonId]);
}

export function useAdminLessons(courseId) {
    const {lessons, error, reload} = useLessons(courseId);
    const isAllowed = useCheckPermissions(Permissions.LESSON_EDIT);

    return {lessons: isAllowed === false ? false : lessons, error, reload};
}

export function useAdminLesson(courseId, lessonId) {
    const {lesson, error, reload} = useLesson(courseId, lessonId);
    const isAllowed = useCheckPermissions(Permissions.LESSON_EDIT);

    return {lesson: isAllowed === false ? false : lesson, error, reload};
}

export function useParticipants(courseId) {
    const isAllowed = useCheckPermissions(Permissions.PARTICIPANT_MANAGEMENT);
    const participants = useSelector(({participants}) => participants[courseId]);
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.PARTICIPANTS_FETCH, courseId});
    }, [dispatch]);
    useEffect(() => {
        if (isAllowed === true) {
            if (!participants)
                dispatchFetchAction();
        }
    }, [isAllowed]);
    return participants instanceof Error
        ? {error: participants, reload: dispatchFetchAction}
        : {participants: isAllowed === false ? false : participants, reload: dispatchFetchAction};
}

export function useRevokeParticipants(courseId) {
    const dispatch = useDispatch();

    return useCallback((responseParticipants) => {
        dispatch({type: ActionType.PARTICIPANTS_REVOKE, courseId, responseParticipants});
    }, [dispatch, courseId]);
}

export function useAdminWebinars(courseId) {
    const isAllowed = useCheckPermissions(Permissions.WEBINAR_EDIT);
    const webinars = useSelector(({adminWebinars}) => adminWebinars[courseId]);
    const dispatch = useDispatch();
    const dispatchFetchAction = useCallback(() => {
        dispatch({type: ActionType.ADMIN_WEBINARS_FETCH, courseId});
    }, [dispatch]);
    useEffect(() => {
        if (isAllowed === true) {
            if (!webinars)
                dispatchFetchAction();
        }
    }, [isAllowed]);
    return webinars instanceof Error
        ? {error: webinars, reload: dispatchFetchAction}
        : {webinars: isAllowed === false ? false : webinars, reload: dispatchFetchAction};
}

export function useRevokeWebinars(courseId) {
    const dispatch = useDispatch();

    return useCallback((responseWebinars) => {
        dispatch({type: ActionType.WEBINARS_REVOKE, courseId, responseWebinars});
    }, [dispatch, courseId]);
}

export function useHomework(lessonId) {
    const {credentials} = useUser();
    const [homework, setHomework] = React.useState(undefined);
    const [error, setError] = React.useState(null);
    const fetchHomework = useCallback(async () => {
        if (requests.homework && requests.homework[lessonId])
            return requests.homework[lessonId];
        const request = APIRequest.get(`/lessons/${lessonId}/homeworks/pupil`);
        (requests.homework || (requests.homework = {}))[lessonId] = request;
        try {
            if (error)
                setError(null);
            const homework = await request;
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

export function useUpcomingWebinars() {
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

export function useCourseWebinars(courseId) {
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

function useRedirect(redirectUrl) {
    const history = useHistory();
    return  useCallback(() => {
        redirectUrl && history.replace(redirectUrl);
    }, [history, redirectUrl]);
}

export function useDeleteCourse(redirectUrl, onDelete, onError) {
    const dispatch = useDispatch();
    const redirectIfSupplied = useRedirect(redirectUrl);

    const deleteCallback = useCallback((courseId, lessonId) => {
        redirectIfSupplied();
        onDelete && onDelete(courseId, lessonId);
    }, [redirectIfSupplied, onDelete]);

    return useCallback((courseId) => {
        dispatch({type: ActionType.COURSE_DELETE_REQUEST, courseId, deleteCallback, onError});
    }, [dispatch, deleteCallback, onError]);
}

export function useDeleteLesson(redirectUrl, onDelete, onError) {
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

export function useDeleteWebinar(redirectUrl, onDelete, onError) {
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
