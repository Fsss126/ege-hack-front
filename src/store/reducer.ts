import {Reducer} from 'redux';
import {AppState} from './store';
import {Action, ActionType} from './actions';
import Auth from 'definitions/auth';
import _ from "lodash";
import {CourseInfo} from "types/entities";
import {AxiosError} from "axios";

const defaultState: AppState = {
    credentials: Auth.getCredentials(),
    userInfo: undefined,
    shopCourses: undefined,
    userCourses: undefined,
    subjects: undefined,
    teachers: undefined,
    lessons: {},
    webinars: {},
    participants: {},
    adminCourses: undefined,
    adminWebinars: {},
    teacherCourses: undefined,
    homeworks: {}
};

//TODO: add data normalization
export const reducer: Reducer<AppState, Action> = (state = defaultState, action): AppState => {
    switch (action.type) {
        case ActionType.LOG_IN_SUCCESS: {
            const {credentials} = action;
            return {
                ...state,
                credentials
            };
        }
        case ActionType.LOG_OUT: {
            return {
                ...defaultState,
                credentials: null
            };
        }
        case ActionType.USER_INFO_FETCHED: {
            const {userInfo} = action;
            return {
                ...state,
                userInfo
            };
        }
        case ActionType.SHOP_COURSES_FETCHED: {
            const {courses} = action;
            return {
                ...state,
                shopCourses: courses
            };
        }
        case ActionType.USER_COURSES_FETCHED: {
            const {courses} = action;
            return {
                ...state,
                userCourses: courses
            };
        }
        case ActionType.SUBJECTS_FETCHED: {
            const {subjects} = action;
            return {
                ...state,
                subjects
            };
        }
        case ActionType.TEACHERS_FETCHED: {
            const {teachers} = action;
            return {
                ...state,
                teachers
            };
        }
        case ActionType.LESSONS_FETCHED: {
            const {courseId, lessons} = action;
            return {
                ...state,
                lessons: {
                    ...state.lessons,
                    [courseId]: lessons
                }
            };
        }
        case ActionType.COURSE_WEBINARS_FETCHED: {
            const {courseId, webinars} = action;
            return {
                ...state,
                webinars: {
                    ...state.webinars,
                    [courseId]: webinars
                }
            };
        }
        case ActionType.UPCOMING_WEBINARS_FETCHED: {
            const {webinars} = action;
            return {
                ...state,
                webinars: {
                    ...state.webinars,
                    upcoming: webinars
                }
            };
        }
        case ActionType.PARTICIPANTS_FETCHED: {
            const {courseId, participants} = action;
            return {
                ...state,
                participants: {
                    ...state.participants,
                    [courseId]: participants
                }
            };
        }
        case ActionType.ADMIN_COURSES_FETCHED: {
            const {courses} = action;
            return {
                ...state,
                adminCourses: courses
            };
        }
        case ActionType.ADMIN_WEBINARS_FETCHED: {
            const {courseId, webinars} = action;
            return {
                ...state,
                adminWebinars: {
                    ...state.adminWebinars,
                    [courseId]: webinars
                }
            };
        }
        case ActionType.TEACHER_COURSES_FETCHED: {
            const {courses} = action;
            return {
                ...state,
                teacherCourses: courses
            };
        }
        case ActionType.HOMEWORKS_FETCHED: {
            const {lessonId, homeworks} = action;
            return {
                ...state,
                homeworks: {
                    ...state.homeworks,
                    [lessonId]: homeworks
                }
            };
        }
        case ActionType.LESSONS_REVOKE: {
            const {courseId, responseLesson} = action;
            const {lessons: {[courseId]: courseLessons, ...loadedLessons}} = state;
            if (courseLessons instanceof Error)
                return state;
            const lessonIndex = _.findIndex(courseLessons, {id: responseLesson.id});
            const newLessons = [...courseLessons];
            if (lessonIndex !== -1) {
                const prevLesson = courseLessons[lessonIndex];
                const newLessons = [...courseLessons];
                newLessons[lessonIndex] = {...prevLesson, ...responseLesson};
            }
            else {
                newLessons.push(responseLesson);
            }
            return {
                ...state,
                lessons: {[courseId]: newLessons, ...loadedLessons}
            };
        }
        case ActionType.LESSON_DELETE: {
            const {courseId, lessonId} = action;
            const {lessons: {[courseId]: courseLessons, ...loadedLessons}} = state;
            if (courseLessons instanceof Error)
                return state;
            return {
                ...state,
                lessons: {
                    ...loadedLessons,
                    [courseId]: courseLessons.filter(({id}) => id !== lessonId)
                }
            };
        }
        case ActionType.PARTICIPANTS_REVOKE: {
            const {responseParticipants, courseId} = action;
            return {
                ...state,
                participants: {...state.participants, [courseId]: responseParticipants},
                userCourses: undefined
            };
        }
        case ActionType.HOMEWORKS_REVOKE: {
            const {lessonId, responseHomework} = action;
            const {pupil: {id: studentId}, mark, comment} = responseHomework;
            const {homeworks: {[lessonId]: lessonHomeworks, ...loadedHomeworks}} = state;
            if (lessonHomeworks instanceof Error)
                return state;
            const lessonIndex = _.findIndex(lessonHomeworks, {pupil: {id: studentId}});
            const homework = lessonHomeworks[lessonIndex];
            const newHomeworks = [...lessonHomeworks];
            newHomeworks[lessonIndex] = {...homework, mark, comment};
            return {
                ...state,
                homeworks: {[lessonId]: newHomeworks, ...loadedHomeworks}
            };
        }
        case ActionType.COURSES_REVOKE: {
            const {responseCourse} = action;
            const updateCatalog = <T extends CourseInfo>(catalog: T[] | AxiosError | undefined): T[] | AxiosError | undefined => {
                if (!(catalog instanceof Array))
                    return catalog;
                const courseIndex = _.findIndex<CourseInfo>(catalog, {id: responseCourse.id});
                const newCatalog = [...catalog];
                if (courseIndex !== -1) {
                    const prevCourse = catalog[courseIndex];
                    newCatalog[courseIndex] = {...prevCourse, ...responseCourse};
                } else {
                    newCatalog.push(responseCourse as T);
                }
                return newCatalog;
            };
            const {userCourses, adminCourses, shopCourses} = state;
            return {
                ...state,
                userCourses: updateCatalog(userCourses),
                adminCourses: updateCatalog(adminCourses),
                shopCourses: updateCatalog(shopCourses)
            };
        }
        case ActionType.COURSE_DELETE: {
            const {courseId} = action;
            const removeCourse = <T extends CourseInfo>(catalog: T[] | AxiosError | undefined): T[] | AxiosError | undefined => (
                catalog instanceof Array ? catalog.filter(({id}) => id !== courseId) : catalog
            );
            const {userCourses, adminCourses, shopCourses} = state;
            return {
                ...state,
                userCourses: removeCourse(userCourses),
                adminCourses: removeCourse(adminCourses),
                shopCourses: removeCourse(shopCourses)
            };
        }
        case ActionType.WEBINARS_REVOKE:
        case ActionType.WEBINAR_DELETE: {
            const {courseId, responseWebinars} = action;
            const {adminWebinars, webinars: {...loadedWebinars}} = state;
            delete loadedWebinars[courseId];
            delete loadedWebinars.upcoming;
            return {
                ...state,
                adminWebinars: {...adminWebinars, [courseId]: responseWebinars},
                webinars: loadedWebinars
            }
        }
        default:
            return state;
    }
};
