import React from "react";
import Auth, {AuthEventTypes} from "../definitions/auth";
import {useHistory} from "react-router-dom";
import APIRequest, {API_ROOT} from "../definitions/api";
import {SHOP_CATALOG, SUBJECTS, TEACHERS} from "../data/test_data";

const StoreContext = React.createContext(null);

function useUserAuth() {
    const [user, setUser] = React.useState(Auth.getUser());
    const [userInfo, setUserInfo] = React.useState(null);

    React.useEffect(() => {
        const fetchUserInfo = async () => {
            // const userInfo = await Auth.getUserInfo();
            const userInfo = {};
            setUserInfo(userInfo);
        };
        if (user)
            fetchUserInfo();
    }, [user]);

    // const history = useHistory();
    const loginCallback = React.useCallback((user, userInfo) => {
        setUser(user);
        // setUserInfo(userInfo);
        // history.push('/shop/');
    }, []);

    const logoutCallback = React.useCallback(() => {
        setUser(null);
        setUserInfo(null);
        // history.push('/login/');
    }, []);

    React.useLayoutEffect(() => {
        Auth.subscribe(AuthEventTypes.login, loginCallback);
        Auth.subscribe(AuthEventTypes.logout, logoutCallback);
        return () => {
            Auth.unsubscribe(AuthEventTypes.login, loginCallback);
            Auth.unsubscribe(AuthEventTypes.logout, logoutCallback);
        }
    }, [loginCallback, logoutCallback]);
    return [user, userInfo];
}

const useShopCatalogStore = () => React.useState(null);
const useSubjectsStore = () => React.useState(null);
const useTeachersStore = () => React.useState(null);

function useStoreData() {
    const [catalog, setCatalog] = useShopCatalogStore();
    const [subjects, setSubjects] = useSubjectsStore();
    const [teachers, setTeachers] = useTeachersStore();
    return {
        data: {
            catalog,
            subjects,
            teachers
        },
        setters: {
            setCatalog,
            setSubjects,
            setTeachers
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
        // const request = APIRequest.get('/subjects');
        const request = null;
        requests.subjects = request;
        try {
            if (error)
                setError(null);
            // const subjects = await request;
            const subjects = SUBJECTS;
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
            // const teachers = await request;
            const teachers = TEACHERS;
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
        const request = APIRequest.get('/courses');
        requests.shopCatalog = request;
        try {
            if (error)
                setError(null);
            // const catalog = (await request).map(({date_start, date_end, image_link, teacher_id, ...rest}) => ({
            //     date_start: new Date(date_start),
            //     date_end: new Date(date_end),
            //     image_link: `${API_ROOT}${image_link}`,
            //     teacher_ids: [teacher_id],
            //     ...rest
            // }));
            const catalog = SHOP_CATALOG.catalog;
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

const GlobalStore = ({children}) => {
    const [user, userInfo] = useUserAuth();
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
