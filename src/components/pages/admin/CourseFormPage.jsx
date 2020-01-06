import React from "react";
import Page, {PageContent} from "components/Page";
import * as Input from "components/ui/input";
import Form, {FieldsContainer, useForm} from "components/ui/Form";
import {useRevokeShopCatalog, useTeachers} from "store";
import {PERMISSIONS} from "definitions/constants";
import APIRequest from "api";

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

function getRequestData(formData) {
    const {name, subject_id, teacher_id, image, price, date_start, date_end, online, description} = formData;
    return {
        name,
        subject_id: parseInt(subject_id),
        teacher_id: parseInt(teacher_id),
        image,
        price: parseFloat(price),
        date_start: date_start.getTime(),
        date_end: date_end.getTime(),
        online,
        description
    };
}

const CourseFormPage = (props) => {
    const {location} = props;
    const {teachers, subjects, error: errorLoadingTeachers, retry: reloadTeachers} = useTeachers();
    const subjectOptions = React.useMemo(() =>
            subjects ? subjects.map(({id, name}) => ({value: id, label: name})) : undefined,
        [subjects]);
    const teacherOptions = React.useMemo(() =>
            teachers ? teachers.map(({id,  vk_info: {first_name, last_name}}) => ({value: id, label: `${first_name} ${last_name}`})) : undefined,
        [teachers]);

    const formElementRef = React.useRef(null);

    const checkValidity = React.useCallback((formData) => {
        const formElement = formElementRef.current;
        if (!formElement)
            return false;
        for (let name in INITIAL_FORM_DATA) {
            if (name === 'image') {
                if (!formData[name])
                    // return false;
                    continue;
                else continue;
            }
            const input = formElement.elements[name];
            if (!input || !input.checkValidity())
                return false;
        }
        return true;
    }, []);

    const {
        formData,
        isValid,
        onInputChange,
        reset
    } = useForm(() => {
        if (props.courseData) {
            const {image_link, id, purchased, teacher_ids, status, ...courseData} = props.courseData;
            return ({
                ...courseData,
                teacher_id: teacher_ids[0],
                image: image_link.split('/').pop()
            })
        } else {
            return INITIAL_FORM_DATA;
        }
    }, checkValidity);

    const {name, subject_id, teacher_id, image, price, date_start, date_end, online, description} = formData;

    const onFileChange = React.useCallback((files, name) => {
        const file = files ? files[0].file_id : null;
        onInputChange(file, name);
    }, [onInputChange]);

    const initialFiles = React.useMemo(() => (
        image ? [image] : undefined
    ), []);

    const from = date_start, to = date_end;
    const modifiers = { start: from, end: to };

    // const dateStartInput = React.useRef(null);
    const dateEndInput = React.useRef(null);

    const onSubmit = React.useCallback(() => {
        console.log('submit', formData);
        return APIRequest.post('/courses', getRequestData(formData));
    }, [formData]);

    const revokeShopCatalog = useRevokeShopCatalog();
    const onSubmitted = React.useCallback((showSuccessMessage) => {
        revokeShopCatalog();
        showSuccessMessage("Курс создан", [
            {
                text: 'Новый курс',
                action: reset
            },
            {
                text: 'Вернуться к курсам',
                url: '/courses'
            }
        ]);
    }, [reset, revokeShopCatalog]);

    const onError = React.useCallback((showErrorMessage, reloadCallback) => {
        showErrorMessage("Ошибка при создании курса", [
            {
                text: 'Закрыть'
            },
            {
                text: 'Заново',
                action: reloadCallback
            }
        ]);
    }, []);

    const isLoaded = teachers && subjects;
    return (
        <Page
            isLoaded={isLoaded}
            requiredPermissions={REQUIRED_PERMISSIONS}
            className="course-form-page"
            title="Магазин курсов"
            location={location}>
            {isLoaded && (
                <PageContent>
                    <div className="layout__content-block">
                        <h3>Новый курс</h3>
                        <Form
                            ref={formElementRef}
                            className="course-form container p-0 course-page"
                            isValid={isValid}
                            reset={reset}
                            onSubmit={onSubmit}
                            onSubmitted={onSubmitted}
                            onError={onError}>
                            <div className="row">
                                <div className="preview-container col-12 col-md-auto">
                                    <Input.ImageInput
                                        name="image"
                                        // required
                                        maxFiles={1}
                                        initialFiles={initialFiles}
                                        accept="image/*"
                                        onChange={onFileChange}
                                        maxSizeBytes={1024 * 1024}/>
                                </div>
                                <FieldsContainer className="col">
                                    <Input.Input
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Название"
                                        value={name}
                                        onChange={onInputChange}/>
                                    <Input.Select
                                        name="subject_id"
                                        required
                                        placeholder="Предмет"
                                        options={subjectOptions}
                                        value={subject_id}
                                        selectProps={SUBJECT_SELECT_PROPS}
                                        callback={onInputChange}/>
                                    <Input.Select
                                        name="teacher_id"
                                        required
                                        placeholder="Предмет"
                                        options={teacherOptions}
                                        value={teacher_id}
                                        selectProps={TEACHER_SELECT_PROPS}
                                        callback={onInputChange}/>
                                    <Input.Input //TODO: add ₽ sign
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
                                        <div className="col start-date-input-container">
                                            <Input.DateInput
                                                value={from}
                                                required
                                                placeholder="Дата начала"
                                                dayPickerProps={{
                                                    selectedDays: [from, { from, to }],
                                                    disabledDays: { after: to },
                                                    toMonth: to,
                                                    modifiers,
                                                    onDayClick: () => dateEndInput.current.getInput().focus()
                                                }}
                                                name="date_start"
                                                onChange={onInputChange}
                                            />
                                        </div>
                                        <div className="col end-date-input-container">
                                            <Input.DateInput
                                                ref={dateEndInput}
                                                required
                                                value={to}
                                                placeholder="Дата окончания"
                                                dayPickerProps={{
                                                    selectedDays: [from, { from, to }],
                                                    disabledDays: { before: from },
                                                    modifiers,
                                                    month: from,
                                                    fromMonth: from
                                                }}
                                                name="date_end"
                                                onChange={onInputChange}
                                            />
                                        </div>
                                    </div>
                                    <Input.TextArea
                                        name="description"
                                        required
                                        placeholder="Описание"
                                        value={description}
                                        onChange={onInputChange}/>
                                </FieldsContainer>
                            </div>
                        </Form>
                    </div>
                </PageContent>
            )}
        </Page>
    );
};

export default CourseFormPage;
