import {
  ACCOUNT_INFO,
  HOMEWORK,
  LESSONS,
  MY_COURSES,
  SHOP_CATALOG,
  SUBJECTS,
  TEACHERS,
  TEST,
  TEST_STATE_COMPLETED,
  TEST_STATE_NOT_STARTED,
  TEST_STATUS,
  WEBINAR_SCHEDULE,
} from 'api/mocks/mocks';
import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

import {getUrl} from '../helpers';

const getMockedResponse = <T>(
  config: AxiosRequestConfig,
  data?: T,
): AxiosResponse => {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  };
};

export const mockRequests = (api: AxiosInstance) => {
  api.interceptors.response.use(undefined, (error) => {
    if (!error.toJSON) {
      throw error;
    }
    const {config} = error;

    if (config.method !== 'get') {
      throw error;
    }
    const url = getUrl(config);
    switch (true) {
      case url.pathname === '/accounts/info':
        return ACCOUNT_INFO;
      case url.pathname === '/subjects':
        return SUBJECTS;
      case url.pathname === '/accounts/teachers':
        return TEACHERS;
      case url.pathname === '/catalog-page':
        switch (config.params.group) {
          case 'MARKET':
            return SHOP_CATALOG;
          case 'PERSON':
            return MY_COURSES;
          default:
            throw error;
        }
      case url.pathname === '/lessons':
        return LESSONS;
      case /\/lessons\/(.*)\/homeworks\/pupil$/.test(url.pathname):
        return HOMEWORK;
      case url.pathname === '/catalog-page/schedule/person':
      case /\/courses\/(.*)\/schedule\/person$/.test(url.pathname):
        return WEBINAR_SCHEDULE;
      default:
        throw error;
    }
  });
};

export const mockTestsRequests = (api: AxiosInstance) => {
  api.interceptors.response.use(
    (response) => {
      const {config, data} = response;
      const url = getUrl(config);
      switch (true) {
        case /\/lessons(\/\w*)?$/.test(url.pathname):
          if (config.method === 'get') {
            return {
              ...response,
              data: data.map((lesson: any) => ({...lesson, test: TEST_STATUS})),
            };
          } else {
            return response;
          }
        default:
          return response;
      }
    },
    (error) => {
      if (!error.toJSON) {
        throw error;
      }
      const {config} = error;
      console.log(config);
      const url = getUrl(config);
      switch (true) {
        case /\/knowledge\/tests\/(.*)\/answer$/.test(url.pathname):
          return getMockedResponse(config);
        case /\/knowledge\/tests\/(.*)\/state$/.test(url.pathname):
          return getMockedResponse(config, TEST_STATE_NOT_STARTED);
        case /\/knowledge\/tests\/(.*)\/complete$/.test(url.pathname):
          return getMockedResponse(config, TEST_STATE_COMPLETED);
        case /\/knowledge\/tests\/(.*)$/.test(url.pathname):
          return getMockedResponse(config, TEST);
        default:
          throw error;
      }
    },
  );
};
