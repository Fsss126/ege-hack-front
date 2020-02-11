import React, {useCallback, useRef} from "react";
import _ from "lodash";
import * as Input from "components/ui/input";
import Form, {FieldsContainer, useForm, useFormValidityChecker} from "components/ui/Form";
import {FileInput} from "components/ui/input";
import {useRevokeLessons} from "store";

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

const LessonForm = (props) => {
    const {courseId, title, createRequest, onSubmitted, errorMessage, cancelLink} = props;

    const formElementRef = useRef(null);

    const checkValidity = useFormValidityChecker(formElementRef, (name, input, formData) => {
        if (_.includes(['attachments', 'hometask_description', 'hometask_file', 'hometask_deadline'], name))
            return true;
        if (name === 'image') {
            return formData.image && !!formData.image[0];
        }
    });

    const {lesson} = props;
    const {
        formData,
        isValid,
        onInputChange,
        reset
    } = useForm(state => {
        if (state || !lesson) {
            return INITIAL_FORM_DATA;
        } else {
            const {
                image_link,
                video_link,
                id,
                course_id,
                locked: is_locked,
                num,
                description,
                assignment: {
                    deadline: hometask_deadline,
                    description: hometask_description,
                    files: hometask_file
                } = {},
                ...otherData
            } = lesson;
            return ({
                image: image_link ? [{file_id: image_link.split('/').pop(), file_link: image_link}] : undefined,
                video_link: video_link || '',
                num: num || '',
                description: description || '',
                is_locked,
                hometask_deadline,
                hometask_description: hometask_description || '',
                hometask_file,
                ...otherData
            })
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

    const revokeLessons = useRevokeLessons(courseId);

    const onSubmit = React.useCallback(() => {
        console.log('submit', formData);
        return createRequest(getRequestData(formData, courseId));
    }, [formData, courseId, createRequest]);

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

    const modifiers = { start: hometask_deadline, end: hometask_deadline };

    return (
        <Form
            title={title}
            ref={formElementRef}
            className="lesson-form container p-0"
            isValid={isValid}
            reset={reset}
            revokeRelatedData={revokeLessons}
            onSubmit={onSubmit}
            onSubmitted={onSubmitted}
            onError={onError}
            cancelLink={cancelLink}>
            <div className="row">
                <div className="preview-container col-12 col-md-auto">
                    <Input.ImageInput
                        name="image"
                        value={image}
                        required
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
                        placeholder="Номер урока"
                        value={num}
                        onChange={onInputChange}/>
                    <Input.Input
                        name="video_link"
                        type="text"
                        placeholder="Ссылка на видео"
                        value={video_link}
                        onChange={onInputChange}/>
                    <Input.TextArea
                        name="description"
                        placeholder="Описание"
                        value={description}
                        onChange={onInputChange}/>
                    <Input.CheckBox
                        name="is_locked"
                        value={is_locked}
                        label="Урок заблокирован"
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
                        initialFiles={lesson ? lesson.attachments : undefined}
                        onChange={onInputChange}/>
                </div>
            </div>
            <FieldsContainer className="row">
                <div className="col-12">
                    <h4 className="file-input__files-title">Домашнее задание</h4>
                </div>
                <div className="col-12">
                    <Input.TextArea
                        name="hometask_description"
                        placeholder="Описание"
                        className="large"
                        value={hometask_description}
                        onChange={onInputChange}/>
                </div>
                <div className="col-auto">
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
                </div>
                <div className="col-auto">
                    <Input.TimeInput
                        name="hometask_deadline"
                        disabled={!hometask_deadline}
                        value={hometask_deadline}
                        placeholder="Время"
                        onChange={onInputChange}/>
                </div>
                <div className="col-12">
                    <FileInput
                        name="hometask_file"
                        filesName={null}
                        value={hometask_file}
                        maxFiles={1}
                        // accept="image/*,audio/*,video/*"
                        initialFiles={lesson && lesson.assignment && lesson.assignment.files ? lesson.assignment.files : undefined}
                        onChange={onInputChange}/>
                </div>
            </FieldsContainer>
        </Form>
    );
};

export default LessonForm;
