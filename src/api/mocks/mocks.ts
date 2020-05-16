import {API_ROOT} from 'api';
import poster from 'img/dummy_poster.jpg';
import pic from 'img/dummy-pic.jpg';
import _ from 'lodash';
import {LoremIpsum} from 'lorem-ipsum';
import {
  TaskDtoResp,
  TestDtoResp,
  TestStateDtoResp,
  TestStatus,
  TestStatusResp,
  ThemeDtoResp,
} from 'types/dtos';
import {
  AccountInfo,
  AnswerType,
  CourseInfo,
  HomeworkInfo,
  LessonInfo,
  PersonWebinar,
  SubjectInfo,
  TeacherInfo,
  TestStatusInfo,
  UserCourseInfo,
} from 'types/entities';
import {AccountRole, LearningStatus, Permission} from 'types/enums';

import {getVideoLink} from '../transforms';

const lorem = new LoremIpsum();

function getDate(daysForward: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysForward);
  return date;
}

export const ACCOUNT_INFO: AccountInfo = {
  id: 154792439,
  roles: [AccountRole.PUPIL, AccountRole.TEACHER, AccountRole.ADMIN],
  permissions: [
    Permission.HOMEWORK_CHECK,
    Permission.SUBJECT_EDIT,
    Permission.KNOWLEDGE_CONTENT_EDIT,
  ],
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
  {id: 1, name: 'Русский язык', image_link: poster},
  {id: 2, name: 'Литература', image_link: poster},
  {id: 3, name: 'Математика', image_link: poster},
  {id: 4, name: 'Информатика', image_link: poster},
  {id: 5, name: 'Физика', image_link: poster},
  {id: 6, name: 'Химия', image_link: poster},
  {id: 7, name: 'Биология', image_link: poster},
  {id: 8, name: 'Обществознание', image_link: poster},
  {id: 9, name: 'История', image_link: poster},
  {id: 10, name: 'География', image_link: poster},
  {id: 11, name: 'Английский язык', image_link: poster},
  {id: 12, name: 'Немецкий язык', image_link: poster},
  {id: 13, name: 'Французский язык', image_link: poster},
  {id: 14, name: 'Китайский язык', image_link: poster},
  {id: 15, name: 'Испанский язык', image_link: poster},
];

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

export const TEST_TASKS: TaskDtoResp[] = [
  {
    id: 0,
    image_link: '/files/938f8e5f-8819-11ea-808a-072fece60c1f',
    text:
      'Два велосипедиста совершают кольцевую гонку с одинаковой угловой скоростью. Положения и траектории движения велосипедистов показаны на рисунке. Чему равно отношение линейных скоростей велосипедистов?',
    subject_id: 1,
    name: 'Задача про велосипедистов',
    theme_id: 10,
    score: 1,
    complexity: 5,
    answer: {
      type: AnswerType.NUMBER,
      num_value: 0.5,
    },
  },
  {
    id: 1,
    text:
      'Верхнюю точку моста радиусом 100 м автомобиль проходит со скоростью 20 м/с. Чему равно центростремительное ускорение автомобиля? (Ответ дайте в метрах в секунду в квадрате.)',
    subject_id: 1,
    name: 'Задача про мост',
    theme_id: 1,
    score: 1,
    answer: {
      type: AnswerType.NUMBER,
      num_value: 1,
    },
  },
  {
    id: 2,
    image_link: '/files/e09c97c1-8819-11ea-808a-072fece60c1f',
    text:
      'В схеме на рисунке сопротивление резистора и полное сопротивление реостата равны R, ЭДС батарейки равна Е, её внутреннее сопротивление ничтожно (). Как ведут себя (увеличиваются, уменьшаются, остаются постоянными) показания идеального вольтметра при перемещении движка реостата из крайнего верхнего в крайнее нижнее положение? Ответ поясните, указав, какие физические закономерности Вы использовали для объяснения.',
    subject_id: 1,
    name: 'Задача про резистор',
    theme_id: 1,
    score: 1,
    complexity: 10,
    answer: {
      type: AnswerType.FILE,
    },
    solution: {
      video_value: '375255364',
      text_value:
        'Вольтметр подключают параллельно к тому участку, на котором нужно измерить напряжение. При этом, естественно, часть тока в цепи начинает течь через сам вольтметр. Тем самым вольтметр вносит возмущение в цепь и показывает напряжение, которое отличается от реального (когда вольтметра нет). Идеальным вольтметром называют прибор, который данной проблемой не страдает. То есть он имеет бесконечное собственное сопротивление.',
    },
  },
];

export const TEST: TestDtoResp = {
  id: 12,
  name: 'Движение по окружности',
  pass_criteria: 0.4,
  deadline: new Date(2020, 4, 1, 20).getTime(),
  tasks: _.times(10).map((i) => ({
    ...TEST_TASKS[i % TEST_TASKS.length],
    id: i,
    order: i,
  })),
};

export const TEST_STATUS_NOT_STARTED: TestStatusResp = {
  id: TEST.id,
  name: TEST.name,
  status: TestStatus.NOT_STARTED,
  progress: 0,
  deadline: TEST.deadline,
};

export const TEST_STATUS_COMPLETED: TestStatusResp = {
  id: TEST.id,
  name: TEST.name,
  status: TestStatus.PASSED,
  progress: 1,
  percentage: 1,
  passed: true,
  deadline: TEST.deadline,
  started_at: new Date().getTime(),
  completed_at: new Date().getTime(),
};

export const TEST_STATE_NOT_STARTED: TestStateDtoResp = {
  id: TEST.id,
  status: TestStatus.NOT_STARTED,
  last_task_id: 0,
  progress: 0,
  answers: [],
};

export const TEST_STATE_STARTED: TestStateDtoResp = {
  id: TEST.id,
  status: TestStatus.NOT_STARTED,
  last_task_id: 2,
  answers: TEST.tasks.slice(0, 2).map(({id, answer}) => ({
    task_id: id,
    user_answer: answer,
  })),
};

export const TEST_STATE_COMPLETED: TestStateDtoResp = {
  id: TEST.id,
  status: TestStatus.PASSED,
  last_task_id: TEST.tasks.length - 1,
  percentage: 0.8,
  passed: true,
  answers: TEST.tasks.map(({id, answer, solution}, i) => ({
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
    solution,
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

export const THEMES: ThemeDtoResp[] = [
  {
    id: 1,
    name: 'Lorem ipsum dolor sit amet',
    subject_id: 1,
    has_sub_themes: true,
    has_sub_tasks: false,
  },
  {
    id: 2,
    name: 'Lorem ipsum dolor sit amet',
    subject_id: 1,
    has_sub_themes: true,
    has_sub_tasks: false,
  },
  {
    id: 3,
    name: 'Lorem ipsum dolor sit amet',
    subject_id: 1,
    has_sub_themes: true,
    has_sub_tasks: false,
  },
  {
    id: 4,
    name: 'Lorem ipsum dolor sit amet',
    subject_id: 1,
    has_sub_themes: false,
    has_sub_tasks: false,
  },
];

// export const TEST_ID = 1;
// export const TEST_HASH = '2d01669a3c8cda169545b4f7b607efb3';
