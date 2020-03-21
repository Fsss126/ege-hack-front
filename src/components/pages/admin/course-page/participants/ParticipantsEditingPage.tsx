import React, {useCallback} from "react";
import APIRequest from "api";
import Page, {PageContent} from "components/Page";
import * as Input from "components/ui/input";
import Form, {
    FormErrorHandler,
    FormSubmitHandler,
    FormSubmittedHandler,
    RevokeRelatedDataCallback,
    useForm
} from "components/ui/Form";
import {useRevokeParticipants} from "store/selectors";
import {Permission} from "types/enums";
import {AddParticipantsReq} from "types/dtos";
import {RouteComponentProps} from "react-router";
import {CourseParticipantInfo} from "types/entities";

interface ParticipantsFormData {
    accounts: string;
}

const INITIAL_FORM_DATA: ParticipantsFormData = {
    accounts: ''
};

function getRequestData(formData: ParticipantsFormData): AddParticipantsReq {
    const {accounts} = formData;
    return  {
        accounts: accounts.split(/\s/)
    };
}

const returnLink = '..';

const ParticipantsEditingPage: React.FC<RouteComponentProps<{courseId: string}>> = (props) => {
    const {match: {params: {courseId: param_course}}, location} = props;
    const courseId = parseInt(param_course);

    const createRequest = useCallback((requestData: AddParticipantsReq) => {
        return APIRequest.post(`/courses/${courseId}/participants`, requestData) as unknown as Promise<CourseParticipantInfo[]>;
        }, [courseId]);
    const {
        formData,
        isValid,
        onInputChange,
        reset
    } = useForm<ParticipantsFormData>(() => INITIAL_FORM_DATA);
    const {accounts} = formData;

    const onSubmit = useCallback<FormSubmitHandler<[undefined], Promise<CourseParticipantInfo[]>>>(() => {
        console.log('submit', formData);
        return createRequest(getRequestData(formData));
    }, [formData, createRequest]);

    const onSubmitted = useCallback<FormSubmittedHandler<CourseParticipantInfo[]>>((response, showSuccessMessage, reset) => {
        showSuccessMessage("Изменения сохранены", [
            {
                text: 'Ок'
            },
            {
                text: 'Вернуться к ученикам',
                url: returnLink
            }
        ]);
    }, []);

    const onError = React.useCallback<FormErrorHandler>((error, showErrorMessage, reloadCallback) => {
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

    const revokeParticipants: RevokeRelatedDataCallback<CourseParticipantInfo[]> = useRevokeParticipants(courseId);

    const isLoaded = true;
    return (
        <Page
            isLoaded={isLoaded}
            requiredPermissions={Permission.PARTICIPANT_MANAGEMENT}
            className="participants-form-page"
            title="Добавление учеников"
            location={location}>
            {isLoaded && (
                <PageContent>
                    <div className="layout__content-block">
                        <Form<CourseParticipantInfo[]>
                            title="Добавление учеников"
                            className="course-form container p-0"
                            isValid={isValid}
                            reset={reset}
                            onSubmit={onSubmit}
                            onSubmitted={onSubmitted}
                            revokeRelatedData={revokeParticipants}
                            onError={onError}
                            cancelLink={returnLink}>
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

export default ParticipantsEditingPage;