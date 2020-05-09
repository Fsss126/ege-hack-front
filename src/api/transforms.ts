import _ from 'lodash';

import {
  AccountDto,
  AccountDtoResp,
  CorrectAnswerDto,
  CourseDtoResp,
  FileInfo,
  HomeworkDtoResp,
  LessonDtoResp,
  SubjectDtoResp,
  TestDtoResp,
  TestStateAnswerDto,
  TestStateDtoResp,
  UserAnswerDtoResp,
} from '../types/dtos';
import {
  CommonAccountInfo,
  CorrectAnswerInfo,
  CourseInfo,
  HomeworkInfo,
  LessonInfo,
  SubjectInfo,
  TestInfo,
  TestStateInfo,
  TestStatusInfo,
  UserAnswerInfo,
} from '../types/entities';
import {API_ROOT} from './index';

export const getVideoLink = (videoId: string) =>
  `https://player.vimeo.com/video/${videoId}`;

export const getImageLink = (imagePath: string) => `${API_ROOT}${imagePath}`;

export const transformFileInfo = (file: FileInfo): FileInfo => {
  const {file_link} = file;

  return {
    ...file,
    file_link: `${API_ROOT}${file_link}?disp=attachment`,
  };
};

export const transformSubject = ({
  image_link,
  ...rest
}: SubjectDtoResp): SubjectInfo => ({
  image_link: image_link ? getImageLink(image_link) : image_link,
  ...rest,
});

export const transformCourse = ({
  date_start,
  date_end,
  image_link,
  teacher_id,
  ...rest
}: CourseDtoResp): CourseInfo => ({
  date_start: new Date(date_start),
  date_end: new Date(date_end),
  image_link: getImageLink(image_link),
  teacher_ids: [teacher_id],
  ...rest,
});

export const transformLesson = ({
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
    ? ({
        ...test,
        deadline: test.deadline ? new Date(test.deadline) : undefined,
        progress: test.progress || 0,
      } as TestStatusInfo)
    : undefined,
  assignment: hometask
    ? {
        deadline: hometask.deadline ? new Date(hometask.deadline) : undefined,
        description: hometask.description,
        files: hometask.file_info
          ? [transformFileInfo(hometask.file_info)]
          : undefined,
      }
    : hometask,
});

export const transformUser = <
  T extends AccountDto | AccountDtoResp,
  R extends CommonAccountInfo
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

export const transformHomework = ({
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

export const transformCorrectAnswer = (
  answer: CorrectAnswerDto,
): CorrectAnswerInfo => {
  const {videoSolution} = answer;

  return {
    ...answer,
    videoSolution: videoSolution ? getVideoLink(videoSolution) : videoSolution,
  };
};

export const transformTest = ({
  deadline,
  tasks,
  ...rest
}: TestDtoResp): TestInfo => ({
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

export const transformUserAnswer = (
  answer: UserAnswerDtoResp,
): UserAnswerInfo => {
  const {type, value, file_info} = answer;

  return {
    type,
    value: file_info ? transformFileInfo(file_info) : value,
  } as UserAnswerInfo;
};

export const transformTestState = ({
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
