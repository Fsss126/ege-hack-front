import APIRequest from 'api';
import Form, {useForm, useFormValidityChecker} from 'components/ui/Form';
import {Input} from 'components/ui/input';
import Popup, {PopupAnimation} from 'components/ui/Popup';
import {useForceUpdate} from 'hooks/common';
import {useUser} from 'hooks/selectors';
import React, {useCallback, useEffect, useRef} from 'react';
import {PaymentReq} from 'types/dtos';
import {CourseInfo} from 'types/entities';
import {SimpleCallback} from 'types/utility/common';

interface FormData {
  email: string;
}

const LOCAL_STORAGE_KEY = 'ege-hack-email';

function createLinkRequest(requestData: PaymentReq) {
  return APIRequest.post('/payments/tinkoff/link', requestData);
}

interface PurchasePopupProps {
  selectedCourses: Set<CourseInfo>;
  opened: boolean;
  onCloseClick: SimpleCallback;
}

const PurchasePopup: React.FC<PurchasePopupProps> = (props) => {
  const {opened, selectedCourses, onCloseClick} = props;
  const {userInfo} = useUser();
  const formElementRef = useRef(null);
  const forceUpdate = useForceUpdate();
  const checkValidity = useFormValidityChecker(
    formElementRef.current,
    undefined,
    [opened],
  );
  const {formData, isValid, onInputChange, reset} = useForm<FormData>(
    () => ({
      email:
        userInfo && !(userInfo instanceof Error) && userInfo.email
          ? userInfo.email
          : localStorage.getItem(LOCAL_STORAGE_KEY) || '',
    }),
    checkValidity,
  );

  const getRequestData = useCallback(
    (email: string, selectedCourses: Set<CourseInfo>): PaymentReq => {
      return {
        courses: [...selectedCourses].map(({id}) => id),
        email,
      };
    },
    [],
  );

  const {email} = formData;

  useEffect(() => {
    forceUpdate();
  }, [forceUpdate, opened]);

  useEffect(() => {
    if (userInfo && !(userInfo instanceof Error) && !email) {
      onInputChange(userInfo.email || '', 'email');
    }
  }, [opened, onInputChange, userInfo, email]);

  const onSubmit = React.useCallback(() => {
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
      console.error(error);
    },
    [],
  );

  const onSubmitted = React.useCallback((response) => {
    window.location = response.link;
  }, []);

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
