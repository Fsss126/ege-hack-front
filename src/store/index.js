import React from "react";
import Auth, {AuthEventTypes} from "definitions/auth";
import APIRequest, {getCancelToken} from "api";
import {useRefValue} from "hooks/common";

const StoreContext = React.createContext(null);

function useUserAuth() {
    const [user, setUser] = React.useState(Auth.getUser());
    const [userInfo, setUserInfo] = React.useState(null);

    React.useEffect(() => {
        const fetchUserInfo = async () => {
            const userInfo = await Auth.getUserInfo();
            setUserInfo(userInfo);
        };
        if (user)
            fetchUserInfo();
    }, [user]);

    const loginCallback = React.useCallback((user, userInfo) => {
        setUser(user);
    }, []);

    const logoutCallback = React.useCallback(() => {
        setUser(null);
    }, []);

    React.useLayoutEffect(() => {
        Auth.subscribe(AuthEventTypes.login, loginCallback);
        Auth.subscribe(AuthEventTypes.logout, logoutCallback);
        return () => {
            Auth.unsubscribe(AuthEventTypes.login, loginCallback);
            Auth.unsubscribe(AuthEventTypes.logout, logoutCallback);
        }
    }, [loginCallback, logoutCallback]);
    return {user, userInfo};
}

const useShopCatalogStore = () => React.useState(null);
const useUserCoursesStore = () => React.useState(null);
const useSubjectsStore = () => React.useState(null);
const useTeachersStore = () => React.useState(null);
const useLessonsStore = () => React.useState({});
const useWebinarsStore = () => React.useState({});

function useStoreData() {
    const [catalog, setCatalog] = useShopCatalogStore();
    const [userCourses, setUserCourses] = useUserCoursesStore();
    const [subjects, setSubjects] = useSubjectsStore();
    const [teachers, setTeachers] = useTeachersStore();
    const [lessons, setLessons] = useLessonsStore();
    const [webinars, setWebinars] = useWebinarsStore();
    return {
        data: {
            catalog,
            subjects,
            teachers,
            lessons,
            userCourses,
            webinars
        },
        setters: {
            setCatalog,
            setSubjects,
            setTeachers,
            setLessons,
            setUserCourses,
            setWebinars
        }
    }
}

const requests = {};

export function useSubjects() {
    const {data: {subjects}, setters: {setSubjects}} = React.useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchSubjects = React.useCallback(async () => {
        if (requests.subjects)
            return requests.subjects;
        const request = APIRequest.get('/subjects');
        requests.subjects = request;
        try {
            if (error)
                setError(null);
            const subjects = await request;
            setSubjects(subjects);
        } catch (e) {
            console.error(e);
            setError(e);
        }
        finally {
            delete requests.subjects;
        }
        return request;
    }, [error]);

    React.useEffect(() => {
        if (!(subjects || requests.subjects || error)) {
            fetchSubjects();
        }
    }, [subjects, error]);
    if (error) {
        return {subjects, error, retry: fetchSubjects};
    }
    else {
        return {subjects};
    }
}

export function useDiscount(selectedCourses) {
    const [discount, setDiscount] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [getCancel, setCancel] = useRefValue(null);
    const fetchDiscount = React.useCallback(async () => {
        const courses = selectedCourses instanceof Set ? [...selectedCourses].map(({id}) => id) : [selectedCourses];
        if (courses.length === 0)
            return ;
        const cancelPrev = getCancel();
        if (cancelPrev)
            cancelPrev();
        const {token: cancelToken, cancel} = getCancelToken();
        setCancel(cancel);
        try {
            if (error)
                setError(null);
            setDiscount(null);
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
        }
    }, [selectedCourses, error]);

    React.useEffect(() => {
        if (!(error))
            fetchDiscount();
    }, [selectedCourses, error]);
    if (error) {
        return {discount, error, retry: fetchDiscount};
    }
    else {
        return {discount};
    }
}

export function useTeachers() {
    const {subjects, errorLoadingSubjects, reloadSubjects} = useSubjects();
    const {data: {teachers}, setters: {setTeachers}} = React.useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchTeachers = React.useCallback(async () => {
        if (requests.teachers)
            return requests.teachers;
        const request = APIRequest.get('/accounts/teachers');
        requests.teachers = request;
        try {
            if (error)
                setError(null);
            const teachers = await request;
            console.log('set teachers', teachers);
            setTeachers(teachers);
        } catch (e) {
            console.error(e);
            setError(e);
        }
        finally {
            delete requests.teachers;
        }
        return request;
    }, [error]);

    React.useEffect(() => {
        if (!(teachers || requests.teachers || error)) {
            fetchTeachers();
        }
    }, [teachers, error]);

    if (error || errorLoadingSubjects) {
        return {
            teachers,
            subjects,
            error: error || errorLoadingSubjects ,
            retry: () => {
                if (error)
                    fetchTeachers();
                if (errorLoadingSubjects)
                    reloadSubjects();
            }
        };
    }
    else {
        return {teachers, subjects};
    }
}

export function useShopCatalog() {
    const {subjects, errorLoadingSubjects, reloadSubjects} = useSubjects();
    const {data: {catalog}, setters: {setCatalog}} = React.useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchCatalog = React.useCallback(async () => {
        if (requests.shopCatalog)
            return requests.shopCatalog;
        const request = APIRequest.get('/courses', {
            params: {
                group: 'MARKET'
            }
        });
        requests.shopCatalog = request;
        try {
            if (error)
                setError(null);
            const catalog = await request;
            setCatalog(catalog);
        } catch (e) {
            console.error(e);
            setError(e);
        }
        finally {
            delete requests.shopCatalog;
        }
        return request;
    }, [error]);

    React.useEffect(() => {
        if (!(catalog || requests.shopCatalog || error)) {
            fetchCatalog();
        }
    }, [catalog, error]);

    if (error || errorLoadingSubjects) {
        return {
            catalog,
            subjects,
            error: error || errorLoadingSubjects ,
            retry: () => {
                if (error)
                    fetchCatalog();
                if (errorLoadingSubjects)
                    reloadSubjects();
            }
        };
    }
    else {
        return {catalog, subjects};
    }
}

export function useUserCourses() {
    const {subjects, errorLoadingSubjects, reloadSubjects} = useSubjects();
    const {data: {userCourses}, setters: {setUserCourses}} = React.useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchUserCourses = React.useCallback(async () => {
        if (requests.userCourses)
            return requests.userCourses;
        const request = APIRequest.get('/courses', {
            params: {
                group: 'PERSON'
            }
        });
        requests.userCourses = request;
        try {
            if (error)
                setError(null);
            const courses = await request;
            setUserCourses(courses);
        } catch (e) {
            console.error(e);
            setError(e);
        }
        finally {
            delete requests.userCourses;
        }
        return request;
    }, [error]);

    React.useEffect(() => {
        if (!(userCourses || requests.userCourses || error)) {
            fetchUserCourses();
        }
    }, [userCourses, error]);

    if (error || errorLoadingSubjects) {
        return {
            courses: userCourses,
            subjects,
            error: error || errorLoadingSubjects ,
            retry: () => {
                if (error)
                    fetchUserCourses();
                if (errorLoadingSubjects)
                    reloadSubjects();
            }
        };
    }
    else {
        return {courses: userCourses, subjects};
    }
}

export function useLessons(courseId) {
    const {data: {lessons}, setters: {setLessons}} = React.useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchLessons = React.useCallback(async (courseId) => {
        if (requests.lessons && requests.lessons[courseId])
            return requests.lessons[courseId];
        const request = APIRequest.get('/lessons', {params: {
                courseId
            }});
        (requests.lessons || (requests.lessons = {}))[courseId] = request;
        try {
            if (error)
                setError(null);
            const lessons = await request;
            console.log('set lessons', lessons);
            setLessons(loadedLessons => ({...loadedLessons, [courseId]: lessons}));
        } catch (e) {
            console.error(e);
            setError(e);
        }
        finally {
            delete requests.lessons[courseId];
        }
        return request;
    }, [error]);

    React.useEffect(() => {
        if (!(lessons[courseId] || (requests.lessons && requests.lessons[courseId]) || error)) {
            fetchLessons(courseId);
        }
    }, [lessons, courseId, error]);

    if (error) {
        return {
            lessons: lessons[courseId],
            error: error,
            retry: () => {
                if (error)
                    fetchLessons(courseId);
            }
        };
    }
    else {
        return {lessons: lessons[courseId]};
    }
}

export function useHomework(lessonId) {
    const [homework, setHomework] = React.useState(null);
    const [error, setError] = React.useState(null);
    const fetchHomework = React.useCallback(async (lessonId) => {
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
    }, [error]);

    React.useEffect(() => {
        if (!(homework || (requests.homework && requests.homework[lessonId]) || error)) {
            fetchHomework(lessonId);
        }
    }, [homework, lessonId, error]);

    if (error) {
        return {
            homework,
            error: error,
            retry: () => {
                if (error)
                    fetchHomework(lessonId);
            }
        };
    }
    else {
        return {homework};
    }
}

export function useUpcomingWebinars() {
    const {data: {webinars}, setters: {setWebinars}} = React.useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchWebinars = React.useCallback(async () => {
        if (requests.webinars && requests.webinars.upcoming)
            return requests.webinars.upcoming;
        const request = APIRequest.get('/courses/schedule/person');
        (requests.webinars || (requests.webinars = {})).upcoming = request;
        try {
            if (error)
                setError(null);
            const webinars = await request;
            console.log('set webinars', webinars);
            setWebinars(loadedWebinars => ({...loadedWebinars, upcoming: webinars}));
        } catch (e) {
            console.error(e);
            setError(e);
        }
        finally {
            delete requests.webinars.upcoming;
        }
        return request;
    }, [error]);

    React.useEffect(() => {
        if (!(webinars.upcoming || (requests.webinars && requests.webinars.upcoming) || error)) {
            fetchWebinars();
        }
    }, [webinars, error]);

    if (error) {
        return {
            webinars: webinars.upcoming,
            error: error,
            retry: () => {
                if (error)
                    fetchWebinars();
            }
        };
    }
    else {
        return {webinars: webinars.upcoming};
    }
}

export function useCourseWebinars(courseId) {
    const {data: {webinars}, setters: {setWebinars}} = React.useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchWebinars = React.useCallback(async (courseId) => {
        if (requests.webinars && requests.webinars[courseId])
            return requests.webinars.upcoming;
        const request = APIRequest.get(`/courses/${courseId}/schedule/person`);
        (requests.webinars || (requests.webinars = {}))[courseId] = request;
        try {
            if (error)
                setError(null);
            const webinars = await request;
            console.log('set course webinars', webinars);
            setWebinars(loadedWebinars => ({...loadedWebinars, [courseId]: webinars}));
        } catch (e) {
            console.error(e);
            setError(e);
        }
        finally {
            delete requests.webinars[courseId];
        }
        return request;
    }, [error]);

    React.useEffect(() => {
        if (!(webinars[courseId] || (requests.webinars && requests.webinars[courseId]) || error)) {
            fetchWebinars(courseId);
        }
    }, [webinars, courseId, error]);

    if (error) {
        return {
            webinars: webinars[courseId],
            error: error,
            retry: () => {
                if (error)
                    fetchWebinars(courseId);
            }
        };
    }
    else {
        return {webinars: webinars[courseId]};
    }
}

const GlobalStore = ({children}) => {
    const {user, userInfo} = useUserAuth();
    const data = useStoreData();
    return (
        <StoreContext.Provider value={{user, userInfo, ...data}}>
            {children}
        </StoreContext.Provider>
    )
};

export default GlobalStore;

export function useUser() {
   const {user, userInfo} = React.useContext(StoreContext);
   return {user, userInfo};
}
