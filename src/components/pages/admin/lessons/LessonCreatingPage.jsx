import React from "react";
import _ from 'lodash';
import Page, {PageContent} from "components/Page";
import * as Input from "components/ui/input";
import Form, {FieldsContainer, useForm} from "components/ui/Form";
import {useLessons, useRevokeLessons, useRevokeShopCatalog, useTeachers} from "store";
import {PERMISSIONS} from "definitions/constants";
import APIRequest from "api";
import {FileInput} from "components/ui/input";

export const LESSON_EDIT_PERMISSIONS = [
    PERMISSIONS.LESSON_EDIT
];

const INITIAL_FORM_DATA = {
    name: '',
    num: '',
    image: null,
    video_link: '',
    description: '',
    is_locked: false,
    attachments: null,
    hometask_description: '',
    hometask_file: null,
    hometask_deadline: null
};

//TODO: check that course exists
function getRequestData(formData, courseId) {
    const {name, image, num, video_link, description, is_locked, attachments, hometask_description, hometask_file, hometask_deadline} = formData;
    const requestData = {
        course_id: courseId,
        name,
        num,
        description,
        is_locked,
        video_link: video_link.split('/').pop(),
        image: image[0].file_id,
    };
    if (hometask_file || hometask_description) {
        const hometask = {};
        hometask_description && (hometask.description = hometask_description);
        hometask_file && (hometask.file = hometask_file[0].file_id);
        hometask_deadline && (hometask.deadline = hometask_deadline.getTime());
        requestData.hometask = hometask;
    }
    if (attachments)
        requestData.attachments = attachments.map(({file_id}) => file_id);
    return requestData;
}

const LessonCreatingPage = (props) => {
    const {match: {params: {courseId: param_course}}, location} = props;
    const courseId = parseInt(param_course);

    const formElementRef = React.useRef(null);

    const checkValidity = React.useCallback((formData) => {
        const formElement = formElementRef.current;
        if (!formElement)
            return false;
        for (let name in INITIAL_FORM_DATA) {
            if (_.includes(['attachments', 'hometask_description', 'hometask_file', 'hometask_deadline'], name))
                continue;
            if (name === 'image') {
                if (!formData[name])
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

    const {lessonData} = props;
    const {
        formData,
        isValid,
        onInputChange,
        reset
    } = useForm(() => {
        if (lessonData) {
            const {
                image_link,
                video_link,
                id,
                assignment: {
                    deadline: hometask_deadline,
                    description: hometask_description,
                    files: hometask_file
                } = {},
                ...otherData} = lessonData;
            return ({
                image: image_link ? {file_id: image_link.split('/').pop(), file_link: image_link} : undefined,
                video_link,
                hometask_deadline,
                hometask_description,
                hometask_file,
                ...otherData
            })
        } else {
            return INITIAL_FORM_DATA;
        }
    }, checkValidity);

    const {
        name,
        num,
        image,
        video_link,
        description,
        is_locked,
        attachments,
        hometask_description,
        hometask_file,
        hometask_deadline
    } = formData;

    const initialImageFile = React.useMemo(() => (formData.image), []);

    // const dateStartInput = React.useRef(null);
    const dateEndInput = React.useRef(null);

    const onSubmit = React.useCallback(() => {
        console.log('submit', formData);
        return APIRequest.post('/lessons', getRequestData(formData, courseId));
    }, [formData, courseId]);

    const revokeLessons = useRevokeLessons(courseId);
    const onSubmitted = React.useCallback((showSuccessMessage) => {
        revokeLessons();
        showSuccessMessage("Урок создан", [
            {
                text: 'Новый урок',
                action: reset
            },
            {
                text: 'Вернуться к курсу',
                url: `/shop/${courseId}/`
            }
        ]);
    }, [reset, revokeLessons, courseId]);

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

    const modifiers = { start: hometask_deadline, end: hometask_deadline };

    const isLoaded = true;
    return (
        <Page
            requiredPermissions={LESSON_EDIT_PERMISSIONS}
            className="lesson-form-page"
            title="Создание урока"
            location={location}>
            {isLoaded && (
                <PageContent>
                    <div className="layout__content-block">
                        <Form
                            title="Новый урок"
                            ref={formElementRef}
                            className="lesson-form container p-0"
                            isValid={isValid}
                            reset={reset}
                            onSubmit={onSubmit}
                            onSubmitted={onSubmitted}
                            onError={onError}>
                            <div className="row">
                                <div className="preview-container col-12 col-md-auto">
                                    <Input.ImageInput
                                        name="image"
                                        value={image}
                                        // required
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
                                    <Input.Input
                                        name="num"
                                        type="number"
                                        required
                                        placeholder="Номер урока"
                                        value={num}
                                        onChange={onInputChange}/>
                                    <Input.Input
                                        name="video_link"
                                        type="text"
                                        required
                                        placeholder="Ссылка на видео"
                                        value={video_link}
                                        onChange={onInputChange}/>
                                    <Input.TextArea
                                        name="description"
                                        required
                                        placeholder="Описание"
                                        value={description}
                                        onChange={onInputChange}/>
                                    <Input.CheckBox
                                        name="is_locked"
                                        value={is_locked}
                                        label={is_locked ? "Урок заблокирован" : "Урок доступен"}
                                        onChange={onInputChange}/>
                                </FieldsContainer>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <FileInput
                                        name="attachments"
                                        filesName="Материалы к уроку"
                                        value={attachments}
                                        maxFiles={10}
                                        // accept="image/*,audio/*,video/*"
                                        initialFiles={lessonData ? lessonData.attachments : undefined}
                                        onChange={onInputChange}/>
                                </div>
                            </div>
                            <div className="row">
                                <FieldsContainer className="col-12">
                                    <h4 className="file-input__files-title">Домашнее задание</h4>
                                    <Input.TextArea
                                        name="hometask_description"
                                        placeholder="Описание"
                                        value={hometask_description}
                                        onChange={onInputChange}/>
                                    <Input.DateInput
                                        value={hometask_deadline}
                                        placeholder="Дедлайн"
                                        dayPickerProps={{
                                            selectedDays: hometask_deadline,
                                            disabledDays: { before: new Date() },
                                            modifiers,
                                        }}
                                        name="hometask_deadline"
                                        clickUnselectsDay={true}
                                        onChange={onInputChange}/>
                                    <FileInput
                                        name="hometask_file"
                                        filesName={null}
                                        value={hometask_file}
                                        maxFiles={1}
                                        // accept="image/*,audio/*,video/*"
                                        initialFiles={lessonData ? lessonData.assignment.files : undefined}
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

export default LessonCreatingPage;
