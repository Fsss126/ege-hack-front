import {API_ROOT} from 'api';
import poster from 'img/dummy_poster.jpg';
import pic from 'img/dummy-pic.jpg';
import _ from 'lodash';
import {LoremIpsum} from 'lorem-ipsum';
import {
  TestDtoResp,
  TestStateDtoResp,
  TestStatus,
  TestStatusResp,
} from 'types/dtos';
import {
  AnswerType,
  CourseInfo,
  HomeworkInfo,
  LessonInfo,
  PersonWebinar,
  SubjectInfo,
  TeacherInfo,
  TestStatusInfo,
  UserCourseInfo,
  UserInfo,
} from 'types/entities';
import {AccountRole, LearningStatus, Permission} from 'types/enums';

import {getVideoLink} from '../transforms';

const lorem = new LoremIpsum();

function getDate(daysForward: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysForward);
  return date;
}

export const ACCOUNT_INFO: UserInfo = {
  id: 154792439,
  roles: [AccountRole.PUPIL, AccountRole.TEACHER],
  permissions: [Permission.HOMEWORK_CHECK],
  vk_info: {
    id: 154792439,
    first_name: 'Alexandra',
    last_name: 'Petrova',
    photo: poster,
    full_name: 'Alexandra Petrova',
  },
  pupil: {
    account_id: 154792439,
  },
  teacher: {
    account_id: 154792439,
  },
  contacts: {},
};

export const SUBJECTS: SubjectInfo[] = [
  // { id: 'russian', name: 'Русский язык' },
  // { id: 'literature', name: 'Литература' },
  // { id: 'math', name: 'Математика' },
  // { id: 'informatics', name: 'Информатика' },
  // { id: 'physics', name: 'Физика' },
  // { id: 'chemistry', name: 'Химия' },
  // { id: 'biology', name: 'Биология' },
  // { id: 'sociology', name: 'Обществознание' },
  // { id: 'history', name: 'История' },
  // { id: 'geography', name: 'География' },
  // { id: 'english', name: 'Английский язык' },
  // { id: 'german', name: 'Немецкий язык' },
  // { id: 'french', name: 'Французский язык' },
  // { id: 'chinese', name: 'Китайский язык' },
  // { id: 'spanish', name: 'Испанский язык' }
  {id: 1, name: 'Русский язык'},
  {id: 2, name: 'Литература'},
  {id: 3, name: 'Математика'},
  {id: 4, name: 'Информатика'},
  {id: 5, name: 'Физика'},
  {id: 6, name: 'Химия'},
  {id: 7, name: 'Биология'},
  {id: 8, name: 'Обществознание'},
  {id: 9, name: 'История'},
  {id: 10, name: 'География'},
  {id: 11, name: 'Английский язык'},
  {id: 12, name: 'Немецкий язык'},
  {id: 13, name: 'Французский язык'},
  {id: 14, name: 'Китайский язык'},
  {id: 15, name: 'Испанский язык'},
].map((subj) => ({...subj, image_link: ''}));

export const TEACHERS: TeacherInfo[] = [
  {
    id: 154792439,
    vk_info: {
      id: 154792439,
      first_name: 'Alexandra',
      last_name: 'Petrova',
      full_name: 'Alexandra Petrova',
      photo: poster,
    },
    subjects: [
      {
        id: 1,
        name: 'Математика',
        description: 'Лучший предмет',
        image_link: '/files/asdsadasda.jpg',
      },
    ],
    contacts: {},
  },
  {
    id: 1,
    vk_info: {
      id: 1,
      first_name: 'Елена',
      last_name: 'Черткова',
      full_name: 'Черткова',
      photo: poster,
    },
    subjects: SUBJECTS.slice(0, 2),
    contacts: {vk: '/', fb: '/', ok: '/', ig: '/'},
    bio: lorem.generateSentences(1),
  },
  {
    id: 2,
    vk_info: {
      id: 2,
      first_name: 'Сергей',
      last_name: 'Авдошин',
      full_name: 'Авдошин',
      photo: poster,
    },
    subjects: [SUBJECTS[3]],
    contacts: {vk: '/', fb: '/', ok: '/', ig: '/'},
    bio: lorem.generateSentences(1),
  },
];

export const COURSES: CourseInfo[] = SUBJECTS.slice(0, 5).map((subject, i) => ({
  name: `${subject.name}. Мастер группа. Апрель.`,
  id: i,
  subject_id: subject.id,
  online: i <= 2,
  image_link: poster,
  date_start: getDate(7 + i),
  date_end: getDate(7 + i),
  // totalHours: 80,
  description: lorem.generateParagraphs(1),
  teacher_ids: i <= 2 ? [TEACHERS[0].id] : TEACHERS.map(({id}) => id),
  hide_from_market: false,
  price: 1,
}));

export const HOMEWORK: HomeworkInfo = {
  comment: 'Очень плохо',
  date: new Date(),
  files: [
    {
      file_name: 'Стыд.jpg',
      file_id: '51657ffc-fc8f-11e9-a562-0338e4bfa1ca.jpg',
      file_link: `${API_ROOT}/files/51657ffc-fc8f-11e9-a562-0338e4bfa1ca.jpg?disp=attachment`,
    },
  ],
  lesson_id: 0,
  mark: 4,
  pupil: ACCOUNT_INFO,
};

export const SHOP_CATALOG: CourseInfo[] = COURSES.map((course, i) => ({
  ...course,
  price: 2500,
  discount: i === 0 ? 1000 : undefined,
}));

export const MY_COURSES: UserCourseInfo[] = COURSES.slice(0, 3).map(
  (course, i) => ({
    ...course,
    status: i <= 1 ? LearningStatus.FINISHED : LearningStatus.LEARNING,
  }),
);

export const WEBINAR_SCHEDULE: PersonWebinar[] = COURSES.slice(0, 3).map(
  ({id, name, subject_id}, i) => ({
    subject_id,
    subject_name: SUBJECTS[subject_id - 1].name,
    course_id: id,
    course_name: name,
    image_link: pic,
    id: i,
    name: 'Играю в майнкрафт',
    description: 'Скидывайте ваши донаты',
    date_start: getDate(i),
    duration: 60 * 2,
    date_end: new Date(getDate(1 + i).getTime() + 60 * 2 * 1000 * 60),
  }),
);

export const TEST: TestDtoResp = {
  id: 1,
  name: 'Кто ты из Винкс?',
  percentage: 100,
  deadline: new Date(2020, 4, 1, 20).getTime(),
  tasks: [
    {
      id: 0,
      image_link: '/files/3464f188-47fd-11ea-a7f3-c7dbce9db8e5',
      text: 'Год твоего рождения?',
      subjectId: 0,
      themeId: 0,
      order: 0,
      weight: 1,
      complexity: 5,
      answer: {
        type: AnswerType.NUMBER,
        value: 2000,
        videoSolution: '375255364',
        textSolution: 'Используем правило буравчика.',
      },
    },
    {
      id: 1,
      image_link: '/files/e1339082-1455-11ea-9d4a-2b3e25df3362',
      text: 'Какой твой любимый цвет?',
      subjectId: 0,
      themeId: 0,
      order: 1,
      weight: 1,
      complexity: 10,
      answer: {
        type: AnswerType.TEXT,
        value: 'розовый',
      },
    },
    {
      id: 2,
      text: 'Твой знак зодиака?',
      subjectId: 0,
      themeId: 0,
      order: 1,
      weight: 1,
      answer: {
        type: AnswerType.FILE,
      },
    },
  ],
};

export const TEST_STATUS_NOT_STARTED: TestStatusResp = {
  id: 1,
  name: 'Кто ты из Винкс?',
  status: TestStatus.NOT_STARTED,
  progress: 0,
  deadline: TEST.deadline,
};

export const TEST_STATUS_COMPLETED: TestStatusResp = {
  id: 1,
  name: 'Кто ты из Винкс?',
  status: TestStatus.COMPLETED,
  percentage: 1,
  passed: true,
  deadline: TEST.deadline,
};

export const TEST_STATE_NOT_STARTED: TestStateDtoResp = {
  status: TestStatus.NOT_STARTED,
  last_task_id: 0,
  progress: 0,
  answers: [],
};

export const TEST_STATE_STARTED: TestStateDtoResp = {
  status: TestStatus.NOT_STARTED,
  last_task_id: 2,
  answers: TEST.tasks.slice(0, 2).map(({id, answer}) => ({
    task_id: id,
    user_answer: answer,
  })),
};

export const TEST_STATE_COMPLETED: TestStateDtoResp = {
  status: TestStatus.COMPLETED,
  last_task_id: TEST.tasks.length - 1,
  percentage: 0.8,
  passed: true,
  answers: TEST.tasks.map(({id, answer}, i) => ({
    task_id: id,
    user_answer:
      answer.type === AnswerType.FILE
        ? {
            type: answer.type,
            file_info: {
              file_id: 'eace0c12-7698-11ea-a56a-17a865e9a7a5',
              file_name: 'add.png',
              file_link: '/files/eace0c12-7698-11ea-a56a-17a865e9a7a5',
            },
          }
        : answer,
    correct_answer: answer,
    is_correct: i !== 0,
  })),
};

export const LESSONS: LessonInfo[] = _.times(4, (j) => {
  const locked = -2 + j > 0;

  return {
    course_id: j,
    num: j + 1,
    id: j,
    date: getDate(-4 + j),
    name: `Занятие ${j + 1}`,
    description: lorem.generateParagraphs(1),
    image_link: poster,
    video_link: getVideoLink('375255364'),
    locked,
    attachments: [],
    assignment: {
      description: lorem.generateParagraphs(1),
      files: [
        {file_name: 'Задание', file_id: '0', file_link: '/robots.txt'},
        {
          file_name: 'Дополнительное задание',
          file_id: '1',
          file_link: '/robots.txt',
        },
      ],
      deadline: getDate(7),
    },
    watchProgress: locked ? undefined : 100 - j * 15,
    test: {
      ...TEST_STATUS_COMPLETED,
      deadline: new Date(TEST_STATUS_COMPLETED.deadline as any),
    } as TestStatusInfo,
  };
});

// export const TEST_ID = 1;
// export const TEST_HASH = '2d01669a3c8cda169545b4f7b607efb3';
