import Form, {
  ErrorHandler,
  FormSubmitHandler,
  RevokeRelatedDataCallback,
  SubmittedHandler,
  useForm,
  useFormValidityChecker,
} from 'components/ui/Form';
import * as Input from 'components/ui/input';
import React, {useCallback, useRef} from 'react';
import {LinkProps} from 'react-router-dom';
import {BasicAccountInfo} from 'types/entities';

interface AccountsFormData {
  accounts: string;
}

const INITIAL_FORM_DATA: AccountsFormData = {
  accounts: '',
};

function getAccountsData(formData: AccountsFormData): string[] {
  const {accounts} = formData;

  return accounts.split(/\s/);
}

type GetRequestDataCallback<Req> = (accounts: string[]) => Req;

export type AccountsFormProps<
  Req,
  R extends BasicAccountInfo = BasicAccountInfo
> = {
  title?: string;
  getRequestData: GetRequestDataCallback<Req>;
  createRequest: (data: Req) => Promise<R[]>;
  revokeRelatedData?: RevokeRelatedDataCallback<R[]>;
  errorMessage: string;
  successMessage: string;
  returnMessage: string;
  returnLink?: LinkProps<any>['to'];
  cancelLink?: LinkProps<any>['to'];
};

const AccountsForm = <Req, R extends BasicAccountInfo = BasicAccountInfo>(
  props: AccountsFormProps<Req, R>,
) => {
  const {
    title,
    getRequestData: getRequestDataCallback,
    createRequest,
    revokeRelatedData,
    errorMessage,
    successMessage,
    returnMessage,
    cancelLink,
    returnLink,
  } = props;

  const formElementRef = useRef<HTMLFormElement>(null);

  const checkValidity = useFormValidityChecker<AccountsFormData>(
    formElementRef.current,
  );

  const {formData, isValid, onInputChange, reset} = useForm<AccountsFormData>(
    () => INITIAL_FORM_DATA,
    checkValidity,
  );
  const {accounts} = formData;

  const getRequestData = useCallback(
    (data: AccountsFormData) => {
      const accounts = getAccountsData(data);

      return getRequestDataCallback(accounts);
    },
    [getRequestDataCallback],
  );

  const onSubmit = useCallback<
    FormSubmitHandler<[undefined], Promise<R[]>>
  >(() => {
    return createRequest(getRequestData(formData));
  }, [createRequest, formData, getRequestData]);

  const onSubmitted = useCallback<SubmittedHandler<R[]>>(
    (response, showSuccessMessage, reset) => {
      showSuccessMessage(successMessage, [
        {
          text: 'Ок',
          action: reset,
        },
        {
          text: returnMessage,
          url: returnLink,
        },
      ]);
    },
    [returnLink, returnMessage, successMessage],
  );

  const onError = React.useCallback<ErrorHandler>(
    (error, showErrorMessage, reloadCallback) => {
      showErrorMessage(errorMessage, [
        {
          text: 'Закрыть',
        },
        {
          text: 'Заново',
          action: reloadCallback,
        },
      ]);
    },
    [errorMessage],
  );

  return (
    <Form<R[]>
      ref={formElementRef}
      title={title}
      className="container p-0"
      isValid={isValid}
      reset={reset}
      onSubmit={onSubmit}
      onSubmitted={onSubmitted}
      revokeRelatedData={revokeRelatedData}
      onError={onError}
      cancelLink={cancelLink}
    >
      <Input.TextArea
        name="accounts"
        required
        placeholder="Ссылки на страницы"
        value={accounts}
        onChange={onInputChange}
      />
    </Form>
  );
};

export default AccountsForm;
