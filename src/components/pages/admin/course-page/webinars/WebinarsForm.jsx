import React, {useRef} from "react";
import _ from "lodash";
import * as Input from "components/ui/input";
import {FileInput} from "components/ui/input";
import Form, {
    FieldsContainer,
    FormElement,
    FormElementGroup,
    useForm,
    useFormValidityChecker
} from "components/ui/Form";
import {useRevokeWebinars} from "store";

const INITIAL_FORM_DATA = {
    click_meeting_link: '',
    image: null,
    webinars: []
};

const INITIAL_WEBINAR_DATA = {
    name: '',
    description: '',
    date_start: null,
    duration: ''
};

function getRequestData(formData, courseId) {
    const {image, click_meeting_link, webinars} = formData;
    return {
        course_id: courseId,
        click_meeting_link,
        image: image[0].file_id,
        webinars: webinars.map(({date_start, duration, ...rest}) => ({
            ...rest,
            date_start: date_start.getTime(),
            duration: parseInt(duration)
        }))
    };
}

const WebinarsForm = (props) => {
    const {courseId, title, createRequest, onSubmitted, errorMessage, cancelLink} = props;

    const formElementRef = useRef(null);

    const checkValidity = useFormValidityChecker(formElementRef, (name, input, formData) => {
        if (name === 'image') {
            return formData.image && !!formData.image[0];
        }
        if (name === 'webinars') {
            for (let webinar of formData.webinars) {
                if (!(webinar.name && webinar.duration && webinar.date_start))
                    return false;
            }
            return true;
        }
    });

    const {webinars: webinarsSchedule} = props;
    const {
        formData,
        isValid,
        onInputChange,
        reset
    } = useForm(state => {
        if (state || !webinarsSchedule) {
            return INITIAL_FORM_DATA;
        } else {
            const {image_link, click_meeting_link, webinars} = webinarsSchedule;
            return ({
                image: image_link ? [{file_id: image_link.split('/').pop(), file_link: image_link}] : undefined,
                click_meeting_link: click_meeting_link || '',
                webinars: webinars.map(({date_start, duration, name, description}) => ({
                    date_start,
                    duration,
                    name,
                    description: description || ''
                }))
            })
        }
    }, checkValidity);

    const {
        image,
        click_meeting_link,
        webinars
    } = formData;

    const initialImageFile = React.useMemo(() => (formData.image), []);

    const revokeWebinars = useRevokeWebinars(courseId);

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

    return (
        <Form
            title={title}
            ref={formElementRef}
            className="webinars-form container p-0"
            isValid={isValid}
            reset={reset}
            revokeRelatedData={revokeWebinars}
            onSubmit={onSubmit}
            onSubmitted={onSubmitted}
            onError={onError}
            cancelLink={cancelLink}>
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
                        name="click_meeting_link"
                        type="text"
                        maxLength={300}
                        required
                        placeholder="ClickMeeting"
                        value={click_meeting_link}
                        onChange={onInputChange}/>
                </FieldsContainer>
            </div>
            <FormElementGroup
                elements={webinars}
                onChange={onInputChange}
                name="webinars"
                addBtnText="Добавить вебинар"
                initialElementData={INITIAL_WEBINAR_DATA}
                renderElement={({name, date_start, duration, description}, i) => (
                    <FormElement
                        name="webinars"
                        index={i}
                        onChange={onInputChange}
                        key={i}>
                        <FieldsContainer className="row">
                            <div className="col-12">
                                <Input.Input
                                    name={`webinars[${i}].name`}
                                    type="text"
                                    required
                                    placeholder="Название"
                                    value={name}
                                    onChange={onInputChange}/>
                            </div>
                            <div className="col-12">
                                <Input.TextArea
                                    name={`webinars[${i}].description`}
                                    placeholder="Описание"
                                    value={description}
                                    onChange={onInputChange}/>
                            </div>
                            <div className="col start-date-input-container">
                                <Input.DateInput
                                    value={date_start}
                                    required
                                    placeholder="Дата начала"
                                    dayPickerProps={{
                                        selectedDays: date_start,
                                        disabledDays: { before: new Date() },
                                        modifiers: { start: date_start, end: date_start }
                                    }}
                                    name={`webinars[${i}].date_start`}
                                    onChange={onInputChange}/>
                            </div>
                            <div className="col">
                                <Input.TimeInput
                                    name={`webinars[${i}].date_start`}
                                    required
                                    disabled={!date_start}
                                    placeholder="Время"
                                    value={date_start}
                                    onChange={onInputChange}/>
                            </div>
                            <div className="col">
                                <Input.Input
                                    name={`webinars[${i}].duration`}
                                    type="number"
                                    required
                                    placeholder="Длительность"
                                    value={duration}
                                    onChange={onInputChange}/>
                            </div>
                        </FieldsContainer>
                    </FormElement>
                )}/>
        </Form>
    );
};

export default WebinarsForm;
