/* eslint-disable @typescript-eslint/no-unused-vars */
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
  TEST_STATUS_COMPLETED,
  TEST_STATUS_NOT_STARTED,
  THEMES,
  WEBINAR_SCHEDULE,
} from 'api/mocks/mocks';
import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {DEBUG_MODE} from 'definitions/constants';
import {
  AnswerType,
  KnowledgeLevelDtoResponse,
  TestStateAnswerDto,
} from 'types/dtos';
import {SanitizedTaskInfo, TestAnswerValue} from 'types/entities';

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
      case url.pathname === '/courses':
        switch (config.params.group) {
          case 'ALL':
          case 'MARKET':
            return SHOP_CATALOG;
          case 'PERSON':
            return MY_COURSES;
          default:
            throw error;
        }
      case url.pathname === '/courses/homeworkCheck':
        return MY_COURSES;
      case url.pathname === '/lessons':
        return LESSONS;
      case /\/lessons\/(.*)\/homeworks\/pupil$/.test(url.pathname):
        return HOMEWORK;
      case url.pathname === '/catalog-page/schedule/person':
      case /\/courses\/schedule\/person$/.test(url.pathname):
      case /\/courses\/(.*)\/schedule\/person$/.test(url.pathname):
        return WEBINAR_SCHEDULE;
      default:
        throw error;
    }
  });
};

class Queue<T> {
  private queue: T[] = [];

  public push = (item: T) => this.queue.push(item);

  public pop = () => this.queue.shift();
}

const mockedTestAnswerResponses = new Queue<TestStateAnswerDto>();

export const addMockedTestAnswerResponses = (
  task: SanitizedTaskInfo,
  value: TestAnswerValue,
) => {
  const {
    id,
    answer: {type},
  } = task;
  mockedTestAnswerResponses.push(
    typeof value === 'object'
      ? {
          task_id: id,
          user_answer: {
            type: AnswerType.FILE,
            file_info: value,
          },
        }
      : {
          task_id: id,
          user_answer: {
            type,
            value: type === AnswerType.NUMBER ? Number(value) : value,
          },
        },
  );
};

export const mockTestsRequests = (api: AxiosInstance) => {
  if (!DEBUG_MODE) {
    return;
  }
  api.interceptors.response.use(
    (response) => {
      const {config, data} = response;
      const url = getUrl(config);
      switch (true) {
        case /\/lessons(\/\w*)?$/.test(url.pathname):
          if (config.method === 'get') {
            return {
              ...response,
              data: data.map((lesson: any) => ({
                ...lesson,
                test: TEST_STATUS_NOT_STARTED,
              })),
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
      const url = getUrl(config);
      switch (true) {
        case /\/knowledge\/tests\/(.*)\/answer$/.test(url.pathname):
          const response = mockedTestAnswerResponses.pop();

          if (response) {
            return getMockedResponse(config, response);
          }
        case /\/knowledge\/tests\/(.*)\/state$/.test(url.pathname):
          return getMockedResponse(config, TEST_STATE_NOT_STARTED);
        case /\/knowledge\/tests\/(.*)\/complete$/.test(url.pathname):
          return getMockedResponse(config, TEST_STATE_COMPLETED);
        case /\/knowledge\/tests\/(.*)$/.test(url.pathname):
          return getMockedResponse(config, TEST);
        case /\/knowledge\/content/.test(url.pathname):
          const {subjectId, themeId} = config.params;

          const content: KnowledgeLevelDtoResponse = {
            themes: THEMES.map((theme, index) => ({
              ...theme,
              id: parseInt(`${subjectId}${themeId || ''}${index}`),
              subjectId,
              parentThemeId: themeId,
            })),
            tasks: [],
          };

          return getMockedResponse(config, content);
        case /\/knowledge\/theme\/(.*)$/.test(url.pathname):
          return getMockedResponse(config, THEMES[0]);
        default:
          throw error;
      }
    },
  );
};
