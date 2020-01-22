import React from "react";
import APIRequest from "api";
import Page, {PageContent} from "components/Page";
import {PERMISSIONS} from "definitions/constants";
import * as Input from "components/ui/input";
import Form, {useForm} from "components/ui/Form";

const INITIAL_FORM_DATA = {
    accounts: ''
};

function getRequestData(formData) {
    const {accounts} = formData;
    return  {
        accounts: accounts.split(/\s/)
    };
}

const ParticipantsPage = (props) => {
    const {match: {params: {courseId: param_course}}, location} = props;
    const courseId = parseInt(param_course);

    const createRequest = React.useCallback((requestData) => APIRequest.post(`/courses/${courseId}/participants`, requestData), [courseId]);

    const {
        formData,
        isValid,
        onInputChange,
        reset
    } = useForm(state => INITIAL_FORM_DATA);
    const {accounts} = formData;

    const onSubmit = React.useCallback(() => {
        console.log('submit', formData);
        return createRequest(getRequestData(formData));
    }, [formData, createRequest]);

    const onSubmitted = React.useCallback((response, showSuccessMessage, reset) => {
        showSuccessMessage("Изменения сохранены", [
            {
                text: 'Ок'
            },
            {
                text: 'Вернуться к курсу',
                url: `/shop/${courseId}/`
            }
        ]);
    }, [courseId]);

    const onError = React.useCallback((error, showErrorMessage, reloadCallback) => {
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

    const isLoaded = true;
    return (
        <Page
            isLoaded={isLoaded}
            requiredPermissions={PERMISSIONS.PARTICIPANT_MANAGEMENT}
            className="participants-form-page"
            title="Добавление учеников"
            location={location}>
            {isLoaded && (
                <PageContent>
                    <div className="layout__content-block">
                        <Form
                            title="Добавление учеников"
                            className="course-form container p-0"
                            isValid={isValid}
                            reset={reset}
                            onSubmit={onSubmit}
                            onSubmitted={onSubmitted}
                            onError={onError}
                            cancelLink={`/shop/${courseId}/`}>
                            <Input.TextArea
                                name="accounts"
                                required
                                placeholder="Ссылки на страницы"
                                value={accounts}
                                onChange={onInputChange}/>
                        </Form>
                    </div>
                </PageContent>
            )}
        </Page>
    );
};

export default ParticipantsPage;