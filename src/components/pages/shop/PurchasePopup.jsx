import React, {useCallback, useRef} from "react";
import Auth from 'definitions/auth';
import Popup, {APPEAR_ANIMATION} from "components/ui/Popup";
import {Input} from "components/ui/input";
import {useForm, useFormValidityChecker} from "components/ui/Form";
import Form from "components/ui/Form";
import APIRequest from "api";
import {useUser} from "../../../store";

const LOCAL_STORAGE_KEY = 'ege-hack-email';

function createLinkRequest(requestData) {
    return APIRequest.post('/payments/form/tinkoff/link', requestData);
}

const PurchasePopup = ({opened, selectedCourses, onCloseClick}) => {
    const {userInfo} = useUser();
    const formElementRef = useRef(null);
    const checkValidity = useFormValidityChecker(formElementRef, undefined, [opened]);
    const {
        formData,
        isValid,
        onInputChange,
        reset
    } = useForm(state => ({
        email: userInfo && userInfo.email ? userInfo.email : localStorage.getItem(LOCAL_STORAGE_KEY) || ''
    }), checkValidity);

    const getRequestData = useCallback((email, selectedCourses) => {
        if (!userInfo)
            return;
        return {
            courses_ids: [...selectedCourses].map(({id}) => id),
            vk_address: userInfo.contacts.vk,
            email
        };
    }, [userInfo]);

    const {
        email
    } = formData;

    const onSubmit = React.useCallback(() => {
        console.log('submit', email);
        localStorage.setItem(LOCAL_STORAGE_KEY, email);
        return createLinkRequest(getRequestData(email, selectedCourses));
    }, [email, selectedCourses]);

    const onError = React.useCallback((error, showErrorMessage, reloadCallback) => {
        showErrorMessage('Невозможно перейти к оплате', [
            {
                text: 'Закрыть'
            },
            {
                text: 'Заново',
                action: reloadCallback
            }
        ]);
        console.log(error);
    }, []);

    const onSubmitted = React.useCallback((response, showSuccessMessage, reset) => {
        window.location = response.link;
    }, []);

    return (
        <Popup
            className="purchase-popup message-popup"
            opened={opened}
            close={onCloseClick}
            closeOnBackgroundClick
            appearAnimation={APPEAR_ANIMATION.BOTTOM}>
            <div className="overlay-window container">
                <div className="row justify-content-end">
                    <div className="col-auto">
                        <i
                            className="close-button icon-close"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Form
                            title="Оплата"
                            className="purchase-form"
                            ref={formElementRef}
                            submitButtonText="Перейти к оплате"
                            isValid={isValid}
                            reset={reset}
                            onSubmitted={onSubmitted}
                            onSubmit={onSubmit}
                            onError={onError}
                            blockNavigation={false}>
                            <div className="purchase-form__note font-size-sm">
                                Введите адрес электронной почты для получения квитанции об оплате
                            </div>
                            <Input
                                type="email"
                                name="email"
                                required
                                placeholder="Электронная почта"
                                value={email}
                                onChange={onInputChange}/>
                        </Form>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default PurchasePopup;
