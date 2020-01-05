import React from "react";
import Page, {PageContent} from "components/Page";
import Input from "components/ui/Input";
import {useTeachers} from "store";
import {ImageInput} from "components/ui/file-input";
import {PERMISSIONS} from "definitions/constants";

const REQUIRED_PERMISSIONS = [
    PERMISSIONS.COURSE_EDIT
];

const INITIAL_FORM_DATA = {
    name: '',
    subject_id: null,
    teacher_id: null,
    image: null,
    price: '',
    date_start: null,
    date_end: null,
    online: false,
    description: ''
};

const SUBJECT_SELECT_PROPS = {isClearable: false, placeholder: 'Предмет'};
const TEACHER_SELECT_PROPS = {isClearable: false, placeholder: 'Преподаватель', };

const CourseFormPage = (props) => {
    const {location} = props;
    const {teachers, subjects, error: errorLoadingTeachers, retry: reloadTeachers} = useTeachers();
    const subjectOptions = React.useMemo(() =>
            subjects ? subjects.map(({id, name}) => ({value: id, label: name})) : undefined,
        [subjects]);
    const teacherOptions = React.useMemo(() =>
            teachers ? teachers.map(({id,  vk_info: {first_name, last_name}}) => ({value: id, label: `${first_name} ${last_name}`})) : undefined,
        [teachers]);
    const [formData, setFormData] = React.useState(() => {
        if (props.courseData) {
            const {image_link: image, id, ...courseData} = props.courseData;
            return ({
                ...courseData,
                image
            })
        } else {
            return INITIAL_FORM_DATA;
        }
    });
    const {name, subject_id, teacher_id, image, price, date_start, date_end, online, description} = formData;
    const initialFiles = React.useMemo(() => (
        image ? [image] : undefined
    ), []);
    const onInputChange = React.useCallback((value, name) => {
        setFormData(state => ({...state, [name]: value}));
    }, []);
    const onFileUpload = React.useCallback((changed, files) => {
        console.log(files);
        const file = files && files[0] ? files[0]: null;
        setFormData(state => ({...state, image: file}));
    }, []);

    const isLoaded = teachers && subjects;

    return (
        <Page
            isLoaded={isLoaded}
            requiredPermissions={REQUIRED_PERMISSIONS}
            className="course-form-page"
            title="Магазин курсов"
            location={location}>
            <PageContent>
                <div className="layout__content-block">
                    <h3>Новый курс</h3>
                    <form className="course-form form container p-0 course-page">
                        <div className="row">
                            <div className="preview-container col-12 col-md-auto">
                                <ImageInput
                                    maxFiles={1}
                                    initialFiles={initialFiles}
                                    accept="image/*"
                                    onChange={onFileUpload}
                                    maxSizeBytes={1024 * 1024}/>
                            </div>
                            <div className="col form__fields">
                                <Input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Название"
                                    value={name}
                                    onChange={onInputChange}/>
                                <Input.Select
                                    name="subject_id"
                                    placeholder="Предмет"
                                    options={subjectOptions}
                                    value={subject_id}
                                    selectProps={SUBJECT_SELECT_PROPS}
                                    callback={onInputChange}/>
                                <Input.Select
                                    name="teacher_id"
                                    placeholder="Предмет"
                                    options={teacherOptions}
                                    value={teacher_id}
                                    selectProps={TEACHER_SELECT_PROPS}
                                    callback={onInputChange}/>
                                <Input //TODO: add ₽ sign
                                    name="price"
                                    type="number"
                                    required
                                    placeholder="Цена"
                                    value={price}
                                    onChange={onInputChange}/>
                                <Input.CheckBox
                                    name="online"
                                    value={online}
                                    label="Онлайн курс"
                                    onChange={onInputChange}/>
                                <div className="row">
                                    <div className="col">
                                        <Input
                                            name="date_start"
                                            type="date"
                                            required
                                            placeholder="Дата начала"
                                            value={date_start}
                                            onChange={onInputChange}/>
                                    </div>
                                    <div className="col">
                                        <Input
                                            name="date_end"
                                            type="date"
                                            required
                                            placeholder="Дата окончания"
                                            value={date_end}
                                            onChange={onInputChange}/>
                                    </div>
                                </div>
                                <Input.TextArea
                                    name="description"
                                    required
                                    placeholder="Описание"
                                    value={description}
                                    onChange={onInputChange}/>
                            </div>
                        </div>
                    </form>
                </div>
            </PageContent>
        </Page>
    );
};

export default CourseFormPage;
