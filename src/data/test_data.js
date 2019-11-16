import {LoremIpsum} from "lorem-ipsum";
import poster from "../img/dummy_poster.jpg";
import _ from "lodash";
import {LEARNING_STATUS} from "../definitions/constants";

const lorem = new LoremIpsum();

function getDate(daysForward) {
    const date = new Date();
    date.setDate(date.getDate() + daysForward);
    return date;
}

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
        id: 1,
        first_name: 'Елена',
        last_name: 'Черткова',
        subject_ids: SUBJECTS.slice(0,2).map(({id}) => id),
        photo: poster,
        contacts: {vk: '/', fb: '/', ok: '/', ig: '/'},
        bio: lorem.generateSentences(1)
    },
    {
        id: 2,
        first_name: 'Сергей',
        last_name: 'Авдошин',
        subject_ids: [SUBJECTS[3].id],
        photo: poster,
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
    lessons: _.times(4, (j) => ({
        number: j + 1,
        id: j,
        date: getDate(-4 + i + j),
        title: `Занятие ${j + 1}`,
        description: lorem.generateParagraphs(1),
        cover: poster
    })),
    teacher_ids: i <= 2 ? [TEACHERS[0].id] : TEACHERS.map(({id}) => id)
}));

export const SHOP_CATALOG = {
    catalog: COURSES.map((course, i) => ({...course, price: 2500, discount: i === 0 ? 1000 : undefined})),
    // promotions: [{
    //
    // }]
};

export const MY_COURSES = COURSES.map((course, i) => ({
    ...course,
    lessons: course.lessons.map((lesson, j) => ({
        ...lesson,
        watchProgress: lesson.date < new Date() ? (100 - j * 15) : undefined,
        homework: {
            files: [
                {name: "Задание", url: "/robots.txt"},
                {name: "Дополнительное задание", url: "/robots.txt"}
            ],
            description: lorem.generateParagraphs(1),
            deadline: getDate(7),
            submit: true,
            submittedFiles: [
                {
                    "original_file_name": "5_64x64.png",
                    "id_file_name": "501371cc-f349-11e9-aa47-7990bff4dcd7.png",
                    "file_link": "/files/601371cc-f349-11e9-aa47-7990bff4dcd7.png"
                }
            ]
        }
    })),
    status: i <= 2 ? LEARNING_STATUS.finished : LEARNING_STATUS.learning
}));

export const TEST_ID = 1;
export const TEST_HASH = '68ab57e7e70fae3f8f96afc0d85465a9';
