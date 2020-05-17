import _ from 'lodash';
import {
  AccountDto,
  AccountDtoResp,
  AnswerType,
  CorrectAnswerDto,
  CourseDtoResp,
  FileInfo,
  HomeworkDtoResp,
  KnowledgeLevelDtoResponse,
  LessonDtoResp,
  PupilDtoReq,
  PupilDtoResp,
  SolutionDto,
  SubjectDtoResp,
  TaskDtoResp,
  TeacherDtoResp,
  TestDtoResp,
  TestStateAnswerDto,
  TestStateDtoResp,
  TestStatus,
  TestStatusResp,
  UserAnswerDtoResp,
  VkUserDto,
} from 'types/dtos';
import {
  AccountInfo,
  ContactInfo,
  CorrectAnswerInfo,
  CourseInfo,
  HomeworkInfo,
  KnowledgeLevelInfo,
  LessonInfo,
  ProfileInfo,
  PupilInfo,
  PupilProfileInfo,
  SubjectInfo,
  TaskInfo,
  TestInfo,
  TestStateAnswerInfo,
  TestStateInfo,
  TestStatusInfo,
  UserAnswerInfo,
  VkUserInfo,
} from 'types/entities';

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
  ...lesson
}: LessonDtoResp): LessonInfo => ({
  ...lesson,
  locked,
  image_link: getImageLink(image_link),
  video_link: getVideoLink(video_link),
  attachments: attachments ? attachments.map(transformFileInfo) : [],
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

const transformVkInfo = (vkDto: VkUserDto): VkUserInfo => {
  const {photo_max: photo, first_name, last_name, ...info} = vkDto;

  return {
    ...info,
    photo,
    first_name,
    last_name,
    full_name: `${first_name} ${last_name}`,
  };
};

const transformContacts = (
  vkDto: VkUserDto,
  instagram?: string,
): ContactInfo => ({
  ig: instagram,
  vk: `https://vk.com/id${vkDto.id}`,
});

export const transformProfileInfo = <T extends TeacherDtoResp | PupilDtoResp>(
  accountDto: T,
): Omit<T, keyof AccountDto | 'instagram'> & ProfileInfo => {
  const {account_id: id, vk_info, instagram, ...user} = accountDto;

  return {
    ...user,
    id,
    vk_info: transformVkInfo(vk_info),
    contacts: transformContacts(vk_info, instagram),
  };
};

const transformPupilProfileInfo = (
  pupilDto: PupilDtoResp,
): PupilProfileInfo => ({
  ...transformProfileInfo(pupilDto),
  final_year: pupilDto.final_year ? new Date(pupilDto.final_year) : undefined,
});

const transformPupilInfo = <T extends PupilDtoReq>(
  pupilInfo: T,
): OmitCommon<T, PupilDtoReq> & PupilInfo => ({
  ...pupilInfo,
  final_year: pupilInfo.final_year ? new Date(pupilInfo.final_year) : undefined,
});

export const transformAccountInfo = ({
  vk_info,
  teacher,
  pupil,
  ...account
}: AccountDtoResp): AccountInfo => ({
  ...account,
  vk_info: transformVkInfo(vk_info),
  pupil: pupil ? transformPupilInfo(pupil) : undefined,
  teacher,
  contacts: transformContacts(vk_info, pupil?.instagram || teacher?.instagram),
});

export const transformHomework = ({
  file_info,
  pupil,
  date,
  ...rest
}: HomeworkDtoResp): HomeworkInfo => ({
  ...rest,
  date: date ? new Date(date) : undefined,
  files: file_info ? [transformFileInfo(file_info)] : undefined,
  pupil: transformPupilProfileInfo(pupil),
});

const getIsTestCompleted = (status: TestStatus) =>
  status === TestStatus.PASSED ||
  status === TestStatus.NOT_PASSED ||
  status === TestStatus.AWAIT;

export const transformTestStatus = (status: TestStatusResp): TestStatusInfo =>
  ({
    ...status,
    deadline: status.deadline ? new Date(status.deadline) : undefined,
    started_at: status.started_at ? new Date(status.started_at) : undefined,
    is_completed: getIsTestCompleted(status.status),
    completed_at: status.completed_at
      ? new Date(status.completed_at)
      : undefined,
  } as TestStatusInfo);

export const transformCorrectAnswer = (
  answer: CorrectAnswerDto,
  solution?: SolutionDto,
): CorrectAnswerInfo => {
  const {type, num_value, text_value} = answer;
  const {video_value, text_value: text_solution} = solution || {};

  return {
    type,
    value: type === AnswerType.TEXT ? text_value : num_value,
    video_solution: video_value ? getVideoLink(video_value) : video_value,
    text_solution,
  };
};

export const transformTask = ({
  image_link,
  answer,
  solution,
  ...rest
}: TaskDtoResp): TaskInfo => ({
  ...rest,
  image_link: image_link ? getImageLink(image_link) : image_link,
  answer: transformCorrectAnswer(answer, solution),
});

export const transformTest = ({
  deadline,
  tasks,
  ...rest
}: TestDtoResp): TestInfo => ({
  deadline: deadline ? new Date(deadline) : undefined,
  tasks: tasks.map((task, index) => ({
    ...transformTask(task),
    order: index,
  })),
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
  progress,
  ...rest
}: TestStateDtoResp): TestStateInfo =>
  ({
    answers: _.reduce<TestStateAnswerDto, Record<number, TestStateAnswerInfo>>(
      answers,
      (result, answer) => {
        const {user_answer, correct_answer, solution} = answer;
        result[answer.task_id] = {
          ...answer,
          user_answer: user_answer
            ? transformUserAnswer(user_answer)
            : undefined,
          correct_answer: correct_answer
            ? transformCorrectAnswer(correct_answer, solution)
            : correct_answer,
        };
        return result;
      },
      {},
    ) as any,
    ...rest,
    progress: progress || 0,
    is_completed: getIsTestCompleted(status),
    passed:
      status === TestStatus.PASSED
        ? true
        : status === TestStatus.NOT_PASSED
        ? false
        : undefined,
    status,
  } as TestStateInfo);

export const transformKnowledgeLevel = ({
  tasks,
  ...rest
}: KnowledgeLevelDtoResponse): KnowledgeLevelInfo => ({
  ...rest,
  tasks: tasks.map((task) => transformTask(task)),
});
