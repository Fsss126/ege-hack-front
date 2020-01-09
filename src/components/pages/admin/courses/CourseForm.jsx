import React from "react";
import APIRequest from "api";
import Form, {FieldsContainer, useForm} from "components/ui/Form";
import {useRevokeShopCatalog} from "store";
import * as Input from "components/ui/input";

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

const SUBJECT_SELECT_PROPS = {isClearable: false};
const TEACHER_SELECT_PROPS = {isClearable: false};

function getRequestData(formData) {
    const {name, subject_id, teacher_id, image, price, date_start, date_end, online, description} = formData;
    return {
        name,
        subject_id: parseInt(subject_id),
        teacher_id: parseInt(teacher_id),
        image: image[0].file_id,
        price: parseFloat(price),
        date_start: date_start.getTime(),
        date_end: date_end.getTime(),
        online,
        description
    };
}

const CourseForm = (props) => {
    const {subjects, teachers, title, createRequest, onSubmitted, errorMessage} = props;

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
                if (!(formData.image && formData.image[0]))
                    return false;
                // continue;
                else continue;
            }
            const input = formElement.elements[name];
            if (!input || !input.checkValidity())
                return false;
        }
        return true;
    }, []);

    const {course} = props;
    const {
        formData,
        isValid,
        onInputChange,
        reset
    } = useForm(state => {
        console.log('init', course);
        if (state || !course) {
            return INITIAL_FORM_DATA;
        } else {
            const {image_link, id, purchased, teacher_ids, status, ...otherData} = course;
            return ({
                teacher_id: teacher_ids[0],
                image: image_link ? [{file_id: image_link.split('/').pop(), file_link: image_link}] : undefined,
                ...otherData
            })
        }
    }, checkValidity);

    const {name, subject_id, teacher_id, image, price, date_start, date_end, online, description} = formData;

    const initialImageFile = React.useMemo(() => (formData.image), []);

    const from = date_start, to = date_end;
    const modifiers = { start: from, end: to };

    // const dateStartInputRef = React.useRef(null);
    const dateEndInputRef = React.useRef(null);

    const onSubmit = React.useCallback(() => {
        console.log('submit', formData);
        return createRequest(getRequestData(formData));
    }, [formData, createRequest]);

    const revokeShopCatalog = useRevokeShopCatalog();

    const onError = React.useCallback((error, showErrorMessage, reloadCallback) => {
        showErrorMessage(errorMessage, [
            {
                text: 'Закрыть'
            },
            {
                text: 'Заново',
                action: reloadCallback
            }
        ]);
    }, [errorMessage]);

    return (
        <Form
            title={title}
            ref={formElementRef}
            className="course-form container p-0"
            isValid={isValid}
            reset={reset}
            onSubmit={onSubmit}
            onSubmitted={onSubmitted}
            onError={onError}
            revokeRelatedData={revokeShopCatalog}>
            <div className="row">
                <div className="preview-container col-12 col-md-auto">
                    <Input.ImageInput
                        name="image"
                        // required
                        value={image}
                        maxFiles={1}
                        initialFiles={initialImageFile}
                        accept="image/*"
                        onChange={onInputChange}
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
                        placeholder="Преподаватель"
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
                                    onDayClick: () => dateEndInputRef.current.getInput().focus()
                                }}
                                name="date_start"
                                onChange={onInputChange}/>
                        </div>
                        <div className="col end-date-input-container">
                            <Input.DateInput
                                ref={dateEndInputRef}
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
                                onChange={onInputChange}/>
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
    );
};

export default CourseForm;
