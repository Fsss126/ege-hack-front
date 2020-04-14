import axios, {AxiosError, AxiosResponse} from 'axios';
import Auth from 'definitions/auth';
import _ from 'lodash';

import {
  AccountDto,
  CorrectAnswerDto,
  CourseDtoResp,
  CourseParticipantDto,
  FileInfo,
  HomeworkDtoResp,
  LessonDtoResp,
  PersonWebinarDto,
  TeacherDtoResp,
  TestDtoResp,
  TestStateAnswerDto,
  TestStateDtoResp,
  UserAnswerDto,
  UserInfoDtoResp,
  WebinarScheduleDtoResp,
} from '../types/dtos';
import {
  AccountInfo,
  CorrectAnswerInfo,
  CourseInfo,
  CourseParticipantInfo,
  HomeworkInfo,
  LessonInfo,
  PersonWebinar,
  TeacherInfo,
  TestInfo,
  TestStateInfo,
  UserAnswerInfo,
  UserCourseInfo,
  UserInfo,
  WebinarScheduleInfo,
} from '../types/entities';
import {LearningStatus} from '../types/enums';
import {getUrl} from './helpers';
import {mockTestsRequests} from './mocks';
// import {mockRequests} from "./mocks";

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

APIRequest.interceptors.request.use(function (config) {
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

const getVideoLink = (videoId: string) =>
  `https://player.vimeo.com/video/${videoId}`;
const getImageLink = (imagePath: string) => `${API_ROOT}${imagePath}`;

const transformFileInfo = (file: FileInfo): FileInfo => {
  const {file_link} = file;

  return {
    ...file,
    file_link: `${API_ROOT}${file_link}?disp=attachment`,
  };
};

const transformCourse = ({
  date_start,
  date_end,
  image_link,
  teacher_id,
  ...rest
}: CourseDtoResp): CourseInfo => ({
  date_start: new Date(date_start),
  date_end: new Date(date_end),
  image_link: `${API_ROOT}${image_link}`,
  teacher_ids: [teacher_id],
  ...rest,
});

const transformLesson = ({
  hometask,
  video_link,
  image_link,
  is_locked: locked,
  attachments,
  test,
  ...lesson
}: LessonDtoResp): LessonInfo => ({
  ...lesson,
  locked,
  image_link: getImageLink(image_link),
  video_link: getVideoLink(video_link),
  attachments: attachments ? attachments.map(transformFileInfo) : [],
  test: test
    ? {
        ...test,
        deadline: test.deadline ? new Date(test.deadline) : undefined,
        progress: test.progress || 0,
      }
    : undefined,
  assignment: hometask
    ? {
        deadline: new Date(hometask.deadline),
        description: hometask.description,
        files: hometask.file_info
          ? [transformFileInfo(hometask.file_info)]
          : undefined,
      }
    : hometask,
});

const transformUser = <
  T extends AccountDto | UserInfoDtoResp,
  R extends AccountInfo
>(
  accountDto: T,
): R => {
  const {account_id: id, vk_info, instagram, ...user} = accountDto as any;
  const {photo_max: photo, first_name, last_name, ...info} = vk_info || {};

  return {
    id,
    ...user,
    vk_info: vk_info
      ? {
          ...info,
          photo,
          first_name,
          last_name,
          full_name: `${first_name} ${last_name}`,
        }
      : undefined,
    contacts: {
      ig: instagram,
      vk: vk_info ? `https://vk.com/id${vk_info.id}` : undefined,
    },
  };
};

const transformHomework = ({
  file_info,
  pupil,
  date,
  ...rest
}: HomeworkDtoResp): HomeworkInfo => ({
  ...rest,
  date: date ? new Date(date) : undefined,
  files: file_info ? [transformFileInfo(file_info)] : undefined,
  pupil: transformUser(pupil),
});

const transformCorrectAnswer = (
  answer: CorrectAnswerDto,
): CorrectAnswerInfo => {
  const {videoSolution} = answer;

  return {
    ...answer,
    videoSolution: videoSolution ? getVideoLink(videoSolution) : videoSolution,
  };
};

const transformTest = ({deadline, tasks, ...rest}: TestDtoResp): TestInfo => ({
  deadline: deadline ? new Date(deadline) : undefined,
  tasks: _.sortBy(tasks, 'order').map((task, i) => {
    const {image_link, answer} = task;

    return {
      ...task,
      order: i,
      image_link: image_link ? getImageLink(image_link) : image_link,
      answer: transformCorrectAnswer(answer),
    };
  }),
  ...rest,
});

const transformUserAnswer = (answer: UserAnswerDto): UserAnswerInfo => {
  const {type, value, file_info} = answer;

  return {
    type,
    value: file_info ? transformFileInfo(file_info) : value,
  } as UserAnswerInfo;
};

const transformTestState = ({
  answers,
  status,
  last_task_id,
  progress,
  ...rest
}: TestStateDtoResp): TestStateInfo => ({
  answers: _.reduce<TestStateAnswerDto, Record<number, TestStateAnswerDto>>(
    answers,
    (result, answer) => {
      const {user_answer, correct_answer} = answer;
      result[answer.task_id] = {
        ...answer,
        user_answer: transformUserAnswer(user_answer),
        correct_answer: correct_answer
          ? transformCorrectAnswer(correct_answer)
          : correct_answer,
      };
      return result;
    },
    {},
  ) as any,
  ...rest,
  last_task_id: last_task_id || 0,
  progress: progress || 0,
  status: status as any,
});

//Interceptors
const transformData = (response: AxiosResponse): AxiosResponse => {
  const {config, data} = response;
  const url = getUrl(config);
  const getData = (): any => {
    switch (true) {
      case url.pathname === '/accounts/info':
        return transformUser<UserInfoDtoResp, UserInfo>(data);
      case url.pathname === '/accounts/teachers':
        return (data as TeacherDtoResp[]).map<TeacherInfo>(transformUser);
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
      case /\/knowledge\/tests\/(.*)\/state$/.test(url.pathname):
      case /\/knowledge\/tests\/(.*)\/complete$/.test(url.pathname): {
        return transformTestState(data) as TestStateInfo;
      }
      case /\/knowledge\/tests\/(.*)$/.test(url.pathname): {
        return transformTest(data) as TestInfo;
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

//returns mocks for all failed requests
// mockRequests(APIRequest);

window.APIRequest = APIRequest;

export default APIRequest;
