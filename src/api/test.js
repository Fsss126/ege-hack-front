import {ACCOUNT_INFO, HOMEWORK, LESSONS, MY_COURSES, SHOP_CATALOG, SUBJECTS, TEACHERS} from "data/test_data";

const getResponse = (data) => (data);

export const handleRequstsWithTestData = (api) => {
    api.interceptors.response.use(undefined, (error) => {
        if (!error.toJSON)
            throw error;
        const {config} = error.toJSON();
        const url = new URL(config.url);
        switch (true) {
            case url.pathname === '/accounts/info':
                return getResponse(ACCOUNT_INFO);
            case url.pathname === '/subjects':
                return getResponse(SUBJECTS);
            case url.pathname === '/accounts/teachers':
                return getResponse(TEACHERS);
            case url.pathname === '/courses':
                switch (config.params.group) {
                    case 'MARKET':
                        return getResponse(SHOP_CATALOG);
                    case 'PERSON':
                        return getResponse(MY_COURSES);
                    default:
                        throw error;
                }
            case url.pathname === '/lessons':
                return getResponse(LESSONS);
            case /\/lessons\/(.*)\/homeworks\/pupil$/.test(url.pathname):
                return getResponse(HOMEWORK);
            default:
                throw error;
        }
    });
};
