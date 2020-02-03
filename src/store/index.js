import React, {useCallback, useContext, useRef} from "react";
import Auth, {AuthEventTypes} from "definitions/auth";
import APIRequest, {getCancelToken} from "api";
import _ from "lodash";

const StoreContext = React.createContext(null);
StoreContext.displayName = 'StoreContext';

function useUserAuth() {
    const [user, setUser] = React.useState(Auth.getUser());
    const [userInfo, setUserInfo] = React.useState(null);

    React.useEffect(() => {
        if (!user)
            return;
        const fetchUserInfo = async () => {
            const userInfo = await Auth.getUserInfo();
            setUserInfo(userInfo);
        };
        if (user)
            fetchUserInfo();
    }, [user]);

    const loginCallback = useCallback((user, userInfo) => {
        setUser(user);
    }, []);

    const logoutCallback = useCallback(() => {
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

//TODO: use Redux
const useShopCoursesStore = () => React.useState(null);
const useUserCoursesStore = () => React.useState(null);
const useAdminCoursesStore = () => React.useState(null);
const useSubjectsStore = () => React.useState(null);
const useTeachersStore = () => React.useState(null);
const useLessonsStore = () => React.useState({});
const useWebinarsStore = () => React.useState({});
const useParticipantsStore = () => React.useState({});
const useAdminWebinarsStore = () => React.useState({});

function useStoreData() {
    const [shopCourses, setShopCourses] = useShopCoursesStore();
    const [userCourses, setUserCourses] = useUserCoursesStore();
    const [adminCourses, setAdminCourses] = useAdminCoursesStore();
    const [subjects, setSubjects] = useSubjectsStore();
    const [teachers, setTeachers] = useTeachersStore();
    const [lessons, setLessons] = useLessonsStore();
    const [webinars, setWebinars] = useWebinarsStore();
    const [adminWebinars, setAdminWebinars] = useWebinarsStore();
    const [participants, setParticipants] = useParticipantsStore();
    return {
        data: {
            shopCourses,
            subjects,
            teachers,
            lessons,
            userCourses,
            webinars,
            adminWebinars,
            participants,
            adminCourses
        },
        setters: {
            setShopCourses,
            setSubjects,
            setTeachers,
            setLessons,
            setUserCourses,
            setWebinars,
            setAdminWebinars,
            setParticipants,
            setAdminCourses
        }
    }
}

const requests = {};

export function useUser() {
    const {user, userInfo} = useContext(StoreContext);
    return {user, userInfo};
}

export function useSubjects() {
    const {user, data: {subjects}, setters: {setSubjects}} = useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchSubjects = useCallback(async () => {
        if (Auth.getUser() === undefined)
            return;
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
    }, [user, subjects, error]);

    return {subjects, error, reload: fetchSubjects};
}

export function useDiscount(selectedCourses) {
    const {user} = useUser();
    const [discount, setDiscount] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [isLoading, setLoading] = React.useState(true);
    const cancelRef = useRef();
    const fetchDiscount = useCallback(async () => {
        if (Auth.getUser() === undefined)
            return;
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
        if (!(error))
            fetchDiscount();
    }, [user, selectedCourses, error]);

    return {discount, error, reload: fetchDiscount, isLoading};
}

export function useTeachers() {
    const {user, data: {teachers}, setters: {setTeachers}} = useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchTeachers = useCallback(async () => {
        if (Auth.getUser() === undefined)
            return;
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
    }, [user, teachers, error]);

    return {teachers, error, reload: fetchTeachers};
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
    const {user, data: {shopCourses}, setters: {setShopCourses}} = useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchCatalog = useCallback(async () => {
        if (Auth.getUser() === undefined)
            return;
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
            setShopCourses(catalog);
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
        if (!(shopCourses || requests.shopCatalog || error)) {
            fetchCatalog();
        }
    }, [user, shopCourses, error]);

    return {catalog: shopCourses, error, reload: fetchCatalog};
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

export function useAdminCourses() {
    const {user, data: {adminCourses}, setters: {setAdminCourses}} = useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchCatalog = useCallback(async () => {
        if (Auth.getUser() === undefined)
            return;
        if (requests.adminCourses)
            return requests.adminCourses;
        const request = APIRequest.get('/courses', {
            params: {
                group: 'ALL'
            }
        });
        requests.adminCourses = request;
        try {
            if (error)
                setError(null);
            const catalog = await request;
            setAdminCourses(catalog);
        } catch (e) {
            console.error(e);
            setError(e);
        }
        finally {
            delete requests.adminCourses;
        }
        return request;
    }, [error]);

    React.useEffect(() => {
        if (!(adminCourses || requests.adminCourses || error)) {
            fetchCatalog();
        }
    }, [user, adminCourses, error]);

    return {catalog: adminCourses, error, reload: fetchCatalog};
}

export function useAdminCourse(courseId) {
    const {catalog, error, reload} = useAdminCourses();
    const course = catalog ? _.find(catalog, {id: courseId}) : undefined;
    return {
        course,
        error: catalog && !course ? true : error,
        reload
    }
}

export function useRevokeCoursesCatalog() {
    const {setters: {setShopCourses, setUserCourses, setAdminCourses}} = useContext(StoreContext);

    return useCallback((responseCourse) => {
        console.log('response', responseCourse);
        const updateCatalog = catalog => {
            const courseIndex = _.findIndex(catalog, {id: responseCourse.id});
            if (courseIndex !== undefined) {
                const prevCourse = catalog[courseIndex];
                const newCatalog = [...catalog];
                newCatalog[courseIndex] = {...prevCourse, ...responseCourse};
                return newCatalog;
            }
            return null;
        };
        setUserCourses(null);
        setShopCourses(updateCatalog);
        setAdminCourses(updateCatalog);
    }, [setShopCourses, setUserCourses, setAdminCourses]);
}

export function useUserCourses() {
    const {user, data: {userCourses}, setters: {setUserCourses}} = useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchUserCourses = useCallback(async () => {
        if (Auth.getUser() === undefined)
            return;
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
    }, [user, userCourses, error]);

    return {courses: userCourses, error, reload: fetchUserCourses};
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
    const {user, data: {lessons}, setters: {setLessons}} = useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchLessons = useCallback(async () => {
        if (Auth.getUser() === undefined)
            return;
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
    }, [error, courseId]);

    React.useEffect(() => {
        if (!(lessons[courseId] || (requests.lessons && requests.lessons[courseId]) || error)) {
            fetchLessons();
        }
    }, [user, lessons, courseId, error]);

    return {lessons: lessons[courseId], error, reload: fetchLessons};
}

export function useRevokeLessons(courseId) {
    const {setters: {setLessons}} = useContext(StoreContext);

    return useCallback((responseLesson) => {
        console.log('response', responseLesson);
        setLessons(({[courseId]: courseLessons, ...loadedLessons}) => {
            const lessonIndex = _.findIndex(courseLessons, {id: responseLesson.id});
            if (lessonIndex !== undefined) {
                const prevLesson = courseLessons[lessonIndex];
                const newLessons = [...courseLessons];
                newLessons[lessonIndex] = {...prevLesson, ...responseLesson};
                return {[courseId]: newLessons, ...loadedLessons};
            }
            return {...loadedLessons};
        });
    }, [setLessons, courseId]);
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

export function useParticipants(courseId) {
    const {user, data: {participants}, setters: {setParticipants}} = useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchParticipants = useCallback(async () => {
        if (Auth.getUser() === undefined)
            return;
        if (requests.participants && requests.participants[courseId])
            return requests.participants[courseId];
        const request = APIRequest.get(`/courses/${courseId}/participants`);
        (requests.participants || (requests.participants = {}))[courseId] = request;
        try {
            if (error)
                setError(null);
            const participants = await request;
            console.log('set participants', participants);
            setParticipants(loadedParticipants => ({...loadedParticipants, [courseId]: participants}));
        } catch (e) {
            console.error(e);
            setError(e);
        }
        finally {
            delete requests.participants[courseId];
        }
        return request;
    }, [error, courseId]);

    React.useEffect(() => {
        if (!(participants[courseId] || (requests.participants && requests.participants[courseId]) || error)) {
            fetchParticipants();
        }
    }, [user, participants, courseId, error]);

    return {participants: participants[courseId], error, reload: fetchParticipants};
}

export function useRevokeParticipants(courseId) {
    const {setters: {setParticipants}} = useContext(StoreContext);

    return useCallback((responseParticipants) => {
        console.log('response', responseParticipants);
        setParticipants((loadedParticipants) => ({...loadedParticipants, [courseId]: responseParticipants}));
    }, [setParticipants, courseId]);
}

export function useAdminWebinars(courseId) {
    const {user, data: {adminWebinars}, setters: {setAdminWebinars}} = useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchWebinars = useCallback(async () => {
        if (Auth.getUser() === undefined)
            return;
        if (requests.adminWebinars && requests.adminWebinars[courseId])
            return requests.adminWebinars[courseId];
        const request = APIRequest.get(`/courses/${courseId}/schedule`);
        (requests.adminWebinars || (requests.adminWebinars = {}))[courseId] = request;
        try {
            if (error)
                setError(null);
            const webinars = await request;
            console.log('set admin webinars', webinars);
            setAdminWebinars(loadedWebinars => ({...loadedWebinars, [courseId]: webinars}));
        } catch (e) {
            console.error(e);
            setError(e);
        }
        finally {
            delete requests.adminWebinars[courseId];
        }
        return request;
    }, [error, courseId]);

    React.useEffect(() => {
        if (!(adminWebinars[courseId] || adminWebinars[courseId] === null || (requests.adminWebinars && requests.adminWebinars[courseId]) || error)) {
            fetchWebinars();
        }
    }, [user, adminWebinars, courseId, error]);

    return {webinars: adminWebinars[courseId], error, reload: fetchWebinars};
}

export function useRevokeAdminWebinars(courseId) {
    const {setters: {setAdminWebinars, setWebinars}} = useContext(StoreContext);

    return useCallback((responseWebinars) => {
        console.log('response', responseWebinars);
        setAdminWebinars(({...loadedParticipants}) => (
            {...loadedParticipants, [courseId]: responseWebinars}
        ));
        setWebinars((loadedWebinars) => ({...loadedWebinars, [courseId]: undefined, upcoming: undefined}))
    }, [setAdminWebinars, setWebinars, courseId]);
}

export function useHomework(lessonId) {
    const {user} = useContext(StoreContext);
    const [homework, setHomework] = React.useState(undefined);
    const [error, setError] = React.useState(null);
    const fetchHomework = useCallback(async () => {
        if (Auth.getUser() === undefined)
            return;
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
        if (!(homework || homework === null || (requests.homework && requests.homework[lessonId]) || error)) {
            fetchHomework();
        }
    }, [user, homework, lessonId, error]);

    return {homework, error, reload: fetchHomework};
}

export function useUpcomingWebinars() {
    const {user, data: {webinars}, setters: {setWebinars}} = useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchWebinars = useCallback(async () => {
        if (Auth.getUser() === undefined)
            return;
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
    }, [user, webinars, error]);

    return {webinars: webinars.upcoming, error, reload: fetchWebinars};
}

export function useCourseWebinars(courseId) {
    const {user, data: {webinars}, setters: {setWebinars}} = useContext(StoreContext);
    const [error, setError] = React.useState(null);
    const fetchWebinars = useCallback(async () => {
        if (Auth.getUser() === undefined)
            return;
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
    }, [error, courseId]);

    React.useEffect(() => {
        if (!(webinars[courseId] || (requests.webinars && requests.webinars[courseId]) || error)) {
            fetchWebinars();
        }
    }, [user, webinars, courseId, error]);

    return {webinars: webinars[courseId], error, reload: fetchWebinars};
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
