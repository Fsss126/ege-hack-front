import {LoremIpsum} from "lorem-ipsum";
import poster from "../img/dummy_poster.jpg";
import _ from "lodash";
import {USER_COURSE_STATUS} from "../definitions/constants";

const lorem = new LoremIpsum();
function getDate(daysForward) {
    const date = new Date();
    date.setDate(date.getDate() + daysForward);
    return date;
}

export const SUBJECTS = [
    { id: 'russian', name: 'Русский язык' },
    { id: 'literature', name: 'Литература' },
    { id: 'math', name: 'Математика' },
    { id: 'informatics', name: 'Информатика' },
    { id: 'physics', name: 'Физика' },
    { id: 'chemistry', name: 'Химия' },
    { id: 'biology', name: 'Биология' },
    { id: 'sociology', name: 'Обществознание' },
    { id: 'history', name: 'История' },
    { id: 'geography', name: 'География' },
    { id: 'english', name: 'Английский язык' },
    { id: 'german', name: 'Немецкий язык' },
    { id: 'french', name: 'Французский язык' },
    { id: 'chinese', name: 'Китайский язык' },
    { id: 'spanish', name: 'Испанский язык' }
];

export const TEACHERS = [
    {
        id: '1',
        firstName: 'Елена',
        lastName: 'Черткова',
        subjects: SUBJECTS.slice(0,2),
        photo: poster,
        contacts: {vk: '/', fb: '/', ok: '/', ig: '/'}
    },
    {
        id: '2',
        firstName: 'Сергей',
        lastName: 'Авдошин',
        subjects: [SUBJECTS[3]],
        photo: poster,
        contacts: {vk: '/', fb: '/', ok: '/', ig: '/'}
    }
];

export const COURSES = SUBJECTS.slice(0, 5).map((subject, i) => ({
    title: `${subject.name}. Мастер группа. Апрель.`,
    id: i.toString(),
    subject: subject,
    online: i <= 2,
    cover: poster,
    start: getDate(7 + i),
    totalHours: 80,
    description: lorem.generateParagraphs(1),
    classes: _.times(4, (i) => ({
        number: i,
        date: getDate(7 + i),
        title: `Занятие ${i + 1}`,
        description: lorem.generateParagraphs(1),
        cover: poster
    })),
    teachers: i <= 2 ? [TEACHERS[0]] : TEACHERS
}));

export const SHOP_CATALOG = {
    catalog: COURSES.map(course => ({...course, offer: {price: 2500, discount: 1300}})),
    // subjects:
};

export const MY_COURSES = COURSES.map((course, i) => ({
    ...course,
    status: i <= 2 ? USER_COURSE_STATUS.finished : USER_COURSE_STATUS.learning
}));
