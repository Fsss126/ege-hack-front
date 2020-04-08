import APIRequest from 'api';
import {useForm, useFormValidityChecker} from 'components/ui/Form';
import Form from 'components/ui/Form';
import {Input} from 'components/ui/input';
import Popup, {PopupAnimation} from 'components/ui/Popup';
import {useUser} from 'hooks/selectors';
import React, {useCallback, useEffect, useRef} from 'react';

import {useForceUpdate} from '../../../hooks/common';

const LOCAL_STORAGE_KEY = 'ege-hack-email';

function createLinkRequest(requestData) {
  return APIRequest.post('/payments/tinkoff/link', requestData);
}

const PurchasePopup = ({opened, selectedCourses, onCloseClick}) => {
  const {userInfo} = useUser();
  const formElementRef = useRef(null);
  const forceUpdate = useForceUpdate();
  const checkValidity = useFormValidityChecker(
    formElementRef.current,
    undefined,
    [opened, formElementRef.current],
  );
  const {formData, isValid, onInputChange, reset} = useForm(
    (state) => ({
      email:
        userInfo && userInfo.email
          ? userInfo.email
          : localStorage.getItem(LOCAL_STORAGE_KEY) || '',
    }),
    checkValidity,
  );

  const getRequestData = useCallback(
    (email, selectedCourses) => {
      if (!userInfo) {
        return;
      }
      return {
        courses: [...selectedCourses].map(({id}) => id),
        vk_address: userInfo.contacts.vk,
        email,
      };
    },
    [userInfo],
  );

  const {email} = formData;

  useEffect(() => {
    forceUpdate();
  }, [forceUpdate, opened]);

  useEffect(() => {
    if (userInfo && !email) {
      onInputChange(userInfo.email || '', 'email');
    }
  }, [opened, onInputChange, userInfo, email]);

  const onSubmit = React.useCallback(() => {
    console.log('submit', email);
    localStorage.setItem(LOCAL_STORAGE_KEY, email);
    return createLinkRequest(getRequestData(email, selectedCourses));
  }, [email, getRequestData, selectedCourses]);

  const onError = React.useCallback(
    (error, showErrorMessage, reloadCallback) => {
      showErrorMessage('Невозможно перейти к оплате', [
        {
          text: 'Закрыть',
        },
        {
          text: 'Заново',
          action: reloadCallback,
        },
      ]);
      console.log(error);
    },
    [],
  );

  const onSubmitted = React.useCallback(
    (response, showSuccessMessage, reset) => {
      window.location = response.link;
    },
    [],
  );

  return (
    <Popup
      className="purchase-popup message-popup"
      opened={opened}
      close={onCloseClick}
      closeOnBackgroundClick
      appearAnimation={PopupAnimation.BOTTOM}
    >
      <div className="overlay-window container">
        <div className="row justify-content-end">
          <div className="col-auto">
            <i className="close-button icon-close" />
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
              blockNavigation={false}
            >
              <div className="purchase-form__note font-size-sm">
                Введите адрес электронной почты для получения квитанции об
                оплате
              </div>
              <Input
                type="email"
                name="email"
                required
                placeholder="Электронная почта"
                value={email}
                onChange={onInputChange}
              />
            </Form>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default PurchasePopup;
