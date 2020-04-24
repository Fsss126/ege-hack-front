import {AxiosError} from 'axios';
import classNames from 'classnames';
import _ from 'lodash';
import React, {
  Fragment,
  Ref,
  RefAttributes,
  useCallback,
  useRef,
  useState,
} from 'react';
import {Link, LinkProps} from 'react-router-dom';
import {SimpleCallback} from 'types/utility/common';

import NavigationBlocker from '../common/NavigationBlocker';
import Button from './Button';
import {InputChangeHandler} from './input/Input';
import {
  LOADING_STATE,
  LoadingIndicator,
  useLoadingState,
} from './LoadingIndicator';
import MessagePopup, {MessageAction} from './MessagePopup';

export type FormSubmitHandler<
  A extends Array<any>,
  R extends Promise<any> | void = void
> = (...args: A) => R;

export type FormSubmittedHandler<R> = (response: R) => void;

export type FormErrorHandler<E> = (response: E, retry: SimpleCallback) => void;

export type FormStateHookResult<
  A extends Array<any>,
  R,
  E extends Error = Error
> = {
  submitting: boolean | null;
  hasChanged: boolean;
  onChange: SimpleCallback;
  handleSubmit: (...params: A) => Promise<R> | void;
};

export function useFormState<A extends Array<any>, R, E extends Error = Error>(
  callback: FormSubmitHandler<A, Promise<R> | void>,
  onSubmitted?: FormSubmittedHandler<R>,
  onError?: FormErrorHandler<E>,
): FormStateHookResult<A, R, E> {
  const [hasChanged, setChanged] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean | null>(null);

  const onChange = useCallback(() => {
    console.log('change');
    setChanged(true);
  }, []);

  const handleSubmit = React.useCallback(
    (...params: A) => {
      const returnValue = callback(...params);

      if (returnValue instanceof Promise) {
        (async (params: A, returnValue: Promise<R>) => {
          setSubmitting(true);
          try {
            const result = await returnValue;
            setChanged(false);
            onSubmitted && onSubmitted(result);
          } catch (e) {
            console.error(e);
            onError && onError(e, () => handleSubmit(...params));
          } finally {
            setSubmitting(false);
          }
        })(params, returnValue);
      }
      return returnValue;
    },
    [callback, onSubmitted, onError],
  );

  return {
    submitting,
    handleSubmit,
    hasChanged,
    onChange,
  };
}

export type FormData = {[field: string]: any};

export type FormValidityChecker<D extends FormData> = (data: D) => boolean;

export function useFormValidityChecker<D extends FormData>(
  formElement: HTMLFormElement | null,
  checkInput?: (
    name: string,
    input: HTMLInputElement | undefined,
    data: D,
  ) => boolean | undefined,
  dependencies = [],
): FormValidityChecker<D> {
  return React.useCallback(
    (formData: D) => {
      if (!formElement) {
        return false;
      }
      for (const name in formData) {
        const input = formElement.elements[name];
        const checkResult = checkInput && checkInput(name, input, formData);

        if (checkResult === false) {
          return false;
        } else if (checkResult === true) {
          continue;
        }
        if (!input || !input.checkValidity()) {
          return false;
        }
      }
      return true;
    },
    [checkInput, formElement],
  );
}

export type FormHookResult<D> = {
  formData: D;
  isValid: boolean;
  onInputChange: InputChangeHandler<any, any>;
  reset: SimpleCallback;
};

export function useForm<D extends FormData>(
  initFormData: (data?: D) => D,
  checkValidity?: FormValidityChecker<D>,
): FormHookResult<D> {
  const [formData, setFormData] = useState<D>(initFormData);
  const [isValid, setValidity] = useState<boolean>(false);

  const onInputChange = React.useCallback((value, name) => {
    console.log(value, name);
    setFormData((state) => {
      if (/\W/.test(name)) {
        const arrayMatch = name.match(/(.*)\[(.*)\]$/);

        if (arrayMatch) {
          const [, arrayName, indexString] = arrayMatch;
          const arrayIndex = parseInt(indexString);
          const array: any = _.get(state, arrayName);

          if (!(typeof array === 'object' && array instanceof Array)) {
            throw new Error();
          }
          let newArray;

          if (arrayIndex >= array.length) {
            newArray = [...array];
            newArray.push(value);
          } else {
            newArray = array.filter((element, i) => i !== arrayIndex);
          }
          return _.set(_.cloneDeep(state), arrayName, newArray);
        }
        return _.set(_.cloneDeep(state), name, value);
      }
      return {...state, [name]: value};
    });
  }, []);

  const reset = React.useCallback(() => {
    setFormData(initFormData);
  }, [initFormData]);

  React.useEffect(() => {
    if (checkValidity) {
      setValidity(checkValidity(formData));
    } else {
      setValidity(false);
    }
  }, [formData, checkValidity]);

  return {
    formData,
    isValid,
    onInputChange,
    reset,
  };
}

export type ShowSuccessMessageCallback = (
  message: string,
  actions: MessageAction[],
  modal?: boolean,
) => void;

export type ShowErrorMessageCallback = (
  message: string,
  actions: MessageAction[],
) => void;

export type SubmittedHandler<R> = (
  response: R,
  showSuccessMessage: ShowSuccessMessageCallback,
  reset: SimpleCallback,
) => void;

export type ErrorHandler<E extends Error = AxiosError> = (
  error: E,
  showErrorMessage: ShowErrorMessageCallback,
  reloadCallback: SimpleCallback,
) => void;

export type RevokeRelatedDataCallback<R> = (response: R) => void;

export interface FormHandleSubmittedHookParams<R> {
  onSubmitted?: SubmittedHandler<R>;
  revokeRelatedData?: RevokeRelatedDataCallback<R>;
  reset: SimpleCallback;
  messagePopup: MessagePopup | null;
}

export function useFormHandleSubmitted<R>(
  params: FormHandleSubmittedHookParams<R>,
): FormSubmittedHandler<R> {
  const {onSubmitted, revokeRelatedData, reset, messagePopup} = params;

  return useCallback(
    (response: R) => {
      const showSuccessMessage: ShowSuccessMessageCallback = (
        message,
        actions,
        modal = true,
      ) => {
        if (messagePopup) {
          messagePopup.showMessage({
            message,
            success: true,
            modal,
            actions,
          });
        }
      };
      revokeRelatedData && revokeRelatedData(response);
      onSubmitted && onSubmitted(response, showSuccessMessage, reset);
    },
    [revokeRelatedData, onSubmitted, reset, messagePopup],
  );
}

export interface FormHandleErrorHookParams<E extends Error = AxiosError> {
  onError: ErrorHandler<E>;
  messagePopup: MessagePopup | null;
}

export function useFormHandleError<E extends Error = AxiosError>(
  params: FormHandleErrorHookParams<E>,
): FormErrorHandler<E> {
  const {messagePopup, onError} = params;

  return React.useCallback(
    (error: E, reloadCallback: SimpleCallback) => {
      const showErrorMessage: ShowErrorMessageCallback = (message, actions) => {
        if (messagePopup) {
          messagePopup.showMessage({
            message,
            error: true,
            modal: true,
            actions,
          });
        }
      };
      onError && onError(error, showErrorMessage, reloadCallback);
    },
    [onError, messagePopup],
  );
}

export type FormProps<R, E extends Error = AxiosError> = {
  title?: string;
  id?: string;
  className?: string;
  children: React.ReactNode;
  submitButtonText?: string;
  cancelButtonText?: string;
  isValid: boolean;
  autocomplete?: string;
  onSubmit: FormSubmitHandler<[undefined], Promise<R>>;
  onSubmitted: SubmittedHandler<R>;
  onError: ErrorHandler<E>;
  reset: SimpleCallback;
  revokeRelatedData?: RevokeRelatedDataCallback<R>;
  blockNavigation?: boolean;
  cancelLink?: LinkProps<any>['to'];
  onCancelClick?: SimpleCallback;
  withNestedForms?: boolean;
};
const Form = <R, E extends Error = AxiosError>(
  props: FormProps<R, E>,
  ref: React.Ref<HTMLFormElement>,
): React.ReactElement => {
  const {
    title,
    id,
    className,
    children,
    submitButtonText = 'Сохранить',
    cancelButtonText = 'Отменить',
    isValid,
    autocomplete = 'off',
    onSubmit,
    onSubmitted,
    onError,
    reset,
    revokeRelatedData,
    blockNavigation = true,
    cancelLink,
    onCancelClick,
    withNestedForms = false,
  } = props;

  const messagePopupRef = useRef<MessagePopup>(null);
  const messagePopup = messagePopupRef.current;

  const handleSubmitted = useFormHandleSubmitted({
    onSubmitted,
    revokeRelatedData,
    reset,
    messagePopup,
  });

  const handleError = useFormHandleError({
    onError,
    messagePopup,
  });

  const {submitting, handleSubmit, hasChanged, onChange} = useFormState<
    [undefined],
    R,
    E
  >(onSubmit, handleSubmitted, handleError);
  const state = useLoadingState(submitting, submitting === false);

  // const history = useHistory();
  // const cancelCallback = React.useCallback(() => {
  //     if (history.length > 0)
  //         history.goBack();
  //     else
  //         history.push(cancelLink);
  // }, [history, cancelLink]);
  const content = (
    <Fragment>
      {title && <h3 className="form__title">{title}</h3>}
      {children}
      <div className="form__action-container btn-container text-right">
        {cancelLink && (
          <Button<typeof Link> component={Link} neutral={true} to={cancelLink}>
            {cancelButtonText}
          </Button>
        )}
        {onCancelClick && (
          <Button neutral={true} onClick={onCancelClick}>
            {cancelButtonText}
          </Button>
        )}{' '}
        <Button
          active={isValid}
          icon={
            (hasChanged || state !== LOADING_STATE.DONE) && (
              <LoadingIndicator state={state} />
            )
          }
          onClick={handleSubmit}
        >
          {submitButtonText}
        </Button>
      </div>
      <MessagePopup ref={messagePopupRef} />
      {blockNavigation && hasChanged && <NavigationBlocker />}
    </Fragment>
  );

  return withNestedForms ? (
    <div className={classNames('form', className)}>
      <form id={id} ref={ref} onChange={onChange} autoComplete={autocomplete} />
      {content}
    </div>
  ) : (
    <form
      id={id}
      ref={ref}
      onChange={onChange}
      className={classNames('form', className)}
      autoComplete={autocomplete}
    >
      {content}
    </form>
  );
};

const FormWithRef = (React.forwardRef(Form) as any) as <
  R,
  E extends Error = AxiosError
>(
  props: FormProps<R, E> & RefAttributes<HTMLFormElement>,
) => React.ReactElement;

export default FormWithRef;
