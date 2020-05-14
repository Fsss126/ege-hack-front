import axios, {AxiosError, AxiosResponse} from 'axios';
import Auth from 'definitions/auth';
import _ from 'lodash';
import {
  AccountDtoResp,
  CourseDtoResp,
  CourseParticipantDto,
  HomeworkDtoResp,
  LessonDtoResp,
  PersonWebinarDto,
  SubjectDtoResp,
  TeacherDtoResp,
  TestStateAnswerDto,
  WebinarScheduleDtoResp,
} from 'types/dtos';
import {
  AccountInfo,
  CourseInfo,
  CourseParticipantInfo,
  HomeworkInfo,
  LessonInfo,
  PersonWebinar,
  TeacherInfo,
  TestStateAnswerInfo,
  UserCourseInfo,
  WebinarScheduleInfo,
} from 'types/entities';
import {LearningStatus} from 'types/enums';

import {getUrl} from './helpers';
import {mockTestsRequests} from './mocks';
// tslint:disable-next-line:no-duplicate-imports
import {mockRequests} from './mocks';
import {
  transformCourse,
  transformHomework,
  transformKnowledgeLevel,
  transformLesson,
  transformSubject,
  transformTask,
  transformTest,
  transformTestState,
  transformTestStatus,
  transformUser,
  transformUserAnswer,
} from './transforms';

export const API_ROOT = process.env.REACT_APP_API_ROOT;

const CancelToken = axios.CancelToken;

export const getCancelToken = () => {
  const source = CancelToken.source();

  return {
    token: source.token,
    cancel: source.cancel,
  };
};

const APIRequest = axios.create({
  baseURL: API_ROOT,
  timeout: 10000,
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    _.forEach(params, (value, key) => {
      if (value instanceof Array) {
        for (const element of value) {
          searchParams.append(key, element);
        }
      } else {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  },
});

APIRequest.interceptors.request.use((config) => {
  const url = getUrl(config);

  if (/\/login/.test(url.pathname)) {
    return config;
  }
  try {
    return {
      ...config,
      headers: {
        Authorization: Auth.getAccessToken(),
      },
    };
  } catch (e) {
    throw new axios.Cancel(e.message);
  }
});

// Interceptors
const transformData = (response: AxiosResponse): AxiosResponse => {
  const {config, data} = response;
  const url = getUrl(config);
  const getData = (): any => {
    switch (true) {
      case url.pathname === '/accounts/info':
        return transformUser<AccountDtoResp, AccountInfo>(data);
      case url.pathname === '/accounts/teachers':
        return (data as TeacherDtoResp[]).map<TeacherInfo>(transformUser);
      case url.pathname === '/accounts/management':
        return (data as AccountDtoResp[]).map<AccountInfo>(transformUser);
      case url.pathname === '/subjects':
        if (config.method === 'get') {
          return (data as SubjectDtoResp[]).map(transformSubject);
        } else {
          return transformSubject(data);
        }
      case /\/subjects\/(\w*)$/.test(url.pathname):
        return transformSubject(data);
      case /\/accounts\/teachers\/(\w*)$/.test(url.pathname):
        return transformUser<TeacherDtoResp, TeacherInfo>(
          data as TeacherDtoResp,
        );
      case /\/courses\/(\w*)\/participants$/.test(url.pathname):
        return (data as CourseParticipantDto[]).map<CourseParticipantInfo>(
          (participant) => ({
            ...transformUser(participant),
            join_date_time: new Date(participant.join_date_time),
          }),
        );
      case /\/courses(\/\w*)?$/.test(url.pathname): {
        if (config.method === 'get') {
          return (data as CourseDtoResp[]).map<CourseInfo | UserCourseInfo>(
            (courseData) => {
              const courseInfo = transformCourse(courseData);

              if (config.params && config.params.group === 'PERSON') {
                const userCourseInfo: UserCourseInfo = {
                  ...courseInfo,
                  status: LearningStatus.LEARNING,
                };

                return userCourseInfo;
              }
              return courseInfo;
            },
          );
        } else {
          return transformCourse(data);
        }
      }
      case /\/lessons(\/\w*)?$/.test(url.pathname): {
        if (config.method === 'get') {
          return _.sortBy(data as LessonDtoResp[], 'num').map<LessonInfo>(
            transformLesson,
          );
        } else {
          return transformLesson(data);
        }
      }
      case /\/lessons\/(\w*)\/homeworks$/.test(url.pathname): {
        return (data as HomeworkDtoResp[]).map<HomeworkInfo>(transformHomework);
      }
      case /\/lessons\/(\w*)\/homeworks\/pupil/.test(url.pathname): {
        if (
          config.method === 'get' ||
          config.method === 'put' ||
          config.method === 'patch'
        ) {
          return transformHomework(data);
        }
        return null;
      }
      case url.pathname === '/courses/schedule/person':
      case /\/courses\/\w*\/schedule\/person$/.test(url.pathname): {
        return _.sortBy(
          (data as PersonWebinarDto[]).map<PersonWebinar>(
            ({
              webinar: {date_start, duration, ...webinar},
              image_link,
              ...rest
            }) => ({
              date_start: new Date(date_start),
              date_end: new Date(date_start + duration * 1000 * 60),
              duration,
              image_link: `${API_ROOT}${image_link}`,
              ...webinar,
              ...rest,
            }),
          ),
          'date_start',
        );
      }
      case /\/courses\/\w*\/schedule$/.test(url.pathname): {
        if (!data) {
          return data;
        }
        const {
          image_link: link,
          webinars,
          ...rest
        } = data as WebinarScheduleDtoResp;
        const image_link = `${API_ROOT}${link}`;

        return {
          image_link,
          webinars: webinars.map(({date_start, duration, ...webinar}) => ({
            ...webinar,
            date_start: new Date(date_start),
            date_end: new Date(date_start + duration * 1000 * 60),
            duration,
            image_link,
          })),
          ...rest,
        } as WebinarScheduleInfo;
      }
      case /\/knowledge\/test\/status/.test(url.pathname):
      case /\/knowledge\/test\/(.*)\/status/.test(url.pathname):
        return transformTestStatus(data);
      case /\/knowledge\/test\/(.*)\/answer$/.test(url.pathname):
        const {user_answer, ...rest} = data as TestStateAnswerDto;

        return {
          ...rest,
          user_answer: transformUserAnswer(user_answer),
        } as TestStateAnswerInfo;
      case /\/knowledge\/test\/state/.test(url.pathname):
      case /\/knowledge\/test\/(.*)\/state$/.test(url.pathname):
      case /\/knowledge\/test\/(.*)\/complete$/.test(url.pathname): {
        return transformTestState(data);
      }
      case /\/knowledge\/tests\/(.*)$/.test(url.pathname): {
        return transformTest(data);
      }
      case /\/knowledge\/content$/.test(url.pathname): {
        return transformKnowledgeLevel(data);
      }
      case /\/knowledge\/content\/tasks\/(.*)$/.test(url.pathname): {
        if (config.method !== 'delete') {
          return transformTask(data);
        }
      }
      default:
        return response.data;
    }
  };

  return getData();
};
const transformError = (error: AxiosError) => {
  if (!error.toJSON) {
    throw error;
  }
  const {config} = error;
  const url = getUrl(config);

  if (config.method !== 'get') {
    throw error;
  }
  if (error.response && error.response.status === 404) {
    switch (true) {
      case /\/knowledge\/test\/status/.test(url.pathname):
      case /\/lessons\/(\w*)\/homeworks\/pupil$/.test(url.pathname):
        return null;
      case /\/courses\/\w*\/schedule$/.test(url.pathname):
        return {webinars: []};
      default:
        throw error;
    }
  } else {
    throw error;
  }
};

mockTestsRequests(APIRequest);

APIRequest.interceptors.response.use(transformData, transformError);

// returns mocks for all failed requests
// mockRequests(APIRequest);

window.APIRequest = APIRequest;

export default APIRequest;
