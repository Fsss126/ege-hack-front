import {LoremIpsum} from "lorem-ipsum";
import _ from "lodash";
import {LEARNING_STATUS} from "definitions/constants";
import {API_ROOT} from "api";

import poster from "img/dummy_poster.jpg";
import pic from "img/dummy-pic.jpg";

const lorem = new LoremIpsum();

function getDate(daysForward) {
    const date = new Date();
    date.setDate(date.getDate() + daysForward);
    return date;
}

export const ACCOUNT_INFO = {
    id: 154792439,
    roles: [
        "PUPIL",
        "TEACHER"
    ],
    permissions: [],
    vk_info: {
        id: 154792439,
        first_name: "Alexandra",
        last_name: "Petrova",
        photo_max_orig: poster,
    },
    pupil: {
        account_id: 154792439
    },
    teacher: {
        account_id: 154792439,
        subjects: [
            {
                id: 1,
                name: "Математика",
                description: "Лучший предмет",
                image_link: "/files/asdsadasda.jpg"
            }
        ]
    }
};

export const SUBJECTS = [
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
    { id: 1, name: 'Русский язык' },
    { id: 2, name: 'Литература' },
    { id: 3, name: 'Математика' },
    { id: 4, name: 'Информатика' },
    { id: 5, name: 'Физика' },
    { id: 6, name: 'Химия' },
    { id: 7, name: 'Биология' },
    { id: 8, name: 'Обществознание' },
    { id: 9, name: 'История' },
    { id: 10, name: 'География' },
    { id: 11, name: 'Английский язык' },
    { id: 12, name: 'Немецкий язык' },
    { id: 13, name: 'Французский язык' },
    { id: 14, name: 'Китайский язык' },
    { id: 15, name: 'Испанский язык' }
];

export const TEACHERS = [
    {
        id: 154792439,
        vk_info: {
            id: 154792439,
            first_name: "Alexandra",
            last_name: "Petrova",
            photo_max_orig: poster,
        },
        subjects: [
            {
                id: 1,
                name: "Математика",
                description: "Лучший предмет",
                image_link: "/files/asdsadasda.jpg"
            }
        ]
    },
    {
        id: 1,
        vk_info: {
            id: 1,
            first_name: 'Елена',
            last_name: 'Черткова',
            photo_max_orig: poster,
        },
        subjects: SUBJECTS.slice(0,2),
        contacts: {vk: '/', fb: '/', ok: '/', ig: '/'},
        bio: lorem.generateSentences(1)
    },
    {
        id: 2,
        vk_info: {
            id: 2,
            first_name: 'Сергей',
            last_name: 'Авдошин',
            photo_max_orig: poster,
        },
        subjects: [SUBJECTS[3]],
        contacts: {vk: '/', fb: '/', ok: '/', ig: '/'},
        bio: lorem.generateSentences(1)
    }
];

export const COURSES = SUBJECTS.slice(0, 5).map((subject, i) => ({
    name: `${subject.name}. Мастер группа. Апрель.`,
    id: i,
    subject_id: subject.id,
    online: i <= 2,
    image_link: poster,
    date_start: getDate(7 + i),
    date_end: getDate(7 + i),
    // totalHours: 80,
    description: lorem.generateParagraphs(1),
    teacher_ids: i <= 2 ? [TEACHERS[0].id] : TEACHERS.map(({id}) => id)
}));

export const LESSONS = _.times(4, (j) => {
    const locked = -2 + j > 0;
    return ({
        num: j + 1,
        id: j,
        // date: getDate(-4 + i + j),
        name: `Занятие ${j + 1}`,
        description: lorem.generateParagraphs(1),
        image_link: poster,
        video_link: '375255364',
        locked,
        assignment: {
            description: lorem.generateParagraphs(1),
            files: [
                {name: "Задание", url: "/robots.txt"},
                {name: "Дополнительное задание", url: "/robots.txt"}
            ],
            deadline:  getDate(7)
        },
        watchProgress: locked ? undefined : (100 - j * 15),
    });
});

export const HOMEWORK = {
    comment: "Очень плохо",
    date: new Date(),
    files: [
        {
            original_file_name: 'Стыд.jpg',
            id_file_name: '51657ffc-fc8f-11e9-a562-0338e4bfa1ca.jpg',
            file_link: `${API_ROOT}/files/51657ffc-fc8f-11e9-a562-0338e4bfa1ca.jpg?disp=attachment`
        }
    ],
    lesson_id: 0,
    mark: 4,
    pupil_id: 0
};

export const SHOP_CATALOG = COURSES.map((course, i) => ({...course, price: 2500, discount: i === 0 ? 1000 : undefined}));

export const MY_COURSES = COURSES.slice(0, 3).map((course, i) => ({
    ...course,
    status: i <= 1 ? LEARNING_STATUS.finished : LEARNING_STATUS.learning
}));
// export const MY_COURSES = COURSES.map((course, i) => ({
//     ...course,
//     lessons: LESSONS.map((lesson, j) => ({
//         ...lesson,
//         watchProgress: lesson.locked ? undefined : (100 - j * 15),
//         homework: {
//             files: [
//                 {name: "Задание", url: "/robots.txt"},
//                 {name: "Дополнительное задание", url: "/robots.txt"}
//             ],
//             description: lorem.generateParagraphs(1),
//             deadline: getDate(7),
//             submit: true,
//             submittedFiles: [
//                 {
//                     original_file_name: "5_64x64.png",
//                     id_file_name: "501371cc-f349-11e9-aa47-7990bff4dcd7.png",
//                     file_link: "/files/601371cc-f349-11e9-aa47-7990bff4dcd7.png"
//                 }
//             ]
//         }
//     })),
//     status: i <= 2 ? LEARNING_STATUS.finished : LEARNING_STATUS.learning
// }));

export const WEBINAR_SCHEDULE = COURSES.slice(0, 3).map(({id, name, subject_id}, i) => ({
    subject_id,
    subject_name: SUBJECTS[subject_id - 1].name,
    course_id: id,
    course_name: name,
    id: i,
    name: "Играю в майнкрафт",
    description: "Скидывайте ваши донаты",
    date_start: getDate(i),
    duration: 60*2,
    date_end: new Date(getDate(1 + i).getTime() + 60*2 * 1000 * 60),
    image_link: pic
}));

export const TEST_ID = 1;
export const TEST_HASH = '2d01669a3c8cda169545b4f7b607efb3';
