import React, {useCallback, useRef, useState} from "react";
import APIRequest from "api";
import * as Input from "components/ui/input";
import Form, {FieldsContainer, useForm, useFormValidityChecker} from "components/ui/Form";
import { useRevokeHomeworks} from "store/selectors";

const INITIAL_FORM_DATA = {
    mark: '',
    comment: ''
};

function getRequestData(formData) {
    const {mark, comment} = formData;
    return  {
        mark: parseInt(mark),
        comment
    };
}

const HomeworkForm = (props) => {
    const {homework, cancelAssess} = props;
    const {pupil: {id: pupilId}, lesson_id: lessonId} = homework;

    const formElementRef = useRef(null);

    const checkValidity = useFormValidityChecker(formElementRef);

    const createRequest = useCallback((requestData) => APIRequest.patch(`/lessons/${lessonId}/homeworks/pupil/${pupilId}`, requestData), [lessonId, pupilId]);
    // const createRequest = useCallback(async (requestData) => ({...homework, ...requestData}), [homework]);

    const {
        formData,
        isValid,
        onInputChange,
        reset
    } = useForm(state => {
        if (state || !homework) {
            return INITIAL_FORM_DATA;
        } else {
            const {
                mark,
                comment
            } = homework;
            return ({
                comment: comment || '',
                mark: mark || ''
            });
        }
    }, checkValidity);
    const {mark, comment} = formData;

    const onSubmit = useCallback(() => {
        console.log('submit', formData);
        return createRequest(getRequestData(formData));
    }, [formData, createRequest]);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const onSubmitted = useCallback((response, showSuccessMessage, reset) => {
        setIsSubmitted(true);
        // showSuccessMessage("Изменения сохранены", [
        //     {
        //         text: 'Ок'
        //     },
        //     {
        //         text: 'Продолжить',
        //         action: cancelAssess
        //     }
        // ]);
    }, []);

    const onError = useCallback((error, showErrorMessage, reloadCallback) => {
        showErrorMessage("Ошибка при выполнении запроса", [
            {
                text: 'Закрыть'
            },
            {
                text: 'Заново',
                action: reloadCallback
            }
        ]);
    }, []);

    const revokeHomeworks = useRevokeHomeworks(lessonId);
    return (
        <Form
            ref={formElementRef}
            className="homework-form container p-0"
            isValid={isValid}
            reset={reset}
            onSubmit={onSubmit}
            onSubmitted={onSubmitted}
            revokeRelatedData={revokeHomeworks}
            onError={onError}
            onCancelClick={cancelAssess}
            cancelButtonText={isSubmitted ? 'Закрыть' : 'Отменить'}>
            <FieldsContainer>
                <Input.Input
                    name="mark"
                    value={mark}
                    placeholder="Оценка"
                    required
                    type="number"
                    onChange={onInputChange}/>
                <Input.TextArea
                    name="comment"
                    placeholder="Комментарий"
                    value={comment}
                    maxLength={300}
                    onChange={onInputChange}/>
            </FieldsContainer>
        </Form>
    );
};

export default HomeworkForm;
