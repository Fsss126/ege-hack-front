import {AxiosError} from 'axios';
import classnames from 'classnames';
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
  onSubmitted?: (result: R) => void,
  onError?: (error: E, retry: SimpleCallback) => void,
): FormStateHookResult<A, R, E> {
  const [hasChanged, setChanged] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean | null>(null);

  const onChange = useCallback(() => {
    setChanged(true);
  }, []);

  const handleSubmit = React.useCallback(
    (...params: A) => {
      const returnValue = callback(...params);

      if (returnValue) {
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
      console.log(checkValidity(formData));
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

export type FieldsContainer = {
  children: React.ReactNode;
  className?: string;
};

export const FieldsContainer: React.FC<FieldsContainer> = (props) => {
  const {children, className} = props;

  return (
    <div className={classnames('form__fields', className)}>{children}</div>
  );
};

export type FormElementProps = {
  index: number;
  name: string;
  className?: string;
  onChange: InputChangeHandler<any>;
  deletable: boolean;
  children: React.ReactNode;
};

export const FormElement: React.withDefaultProps<React.FC<FormElementProps>> = (
  props,
) => {
  const {index, name, className, onChange, deletable, children} = props;
  const onDelete = useCallback(() => {
    onChange && onChange(null, `${name}[${index}]`);
  }, [name, index, onChange]);

  return (
    <div className={classnames('form-entity', className)}>
      {deletable && (
        <div className="form-entity__delete-btn-container">
          <i className="icon-close" onClick={onDelete} />
        </div>
      )}
      {children}
    </div>
  );
};
FormElement.defaultProps = {
  deletable: true,
};

export type FormElementGroupProps<E> = {
  name: string;
  onChange: InputChangeHandler<E>;
  elements: E[];
  renderElement: (element: E, i: number) => React.ReactElement;
  maxElements?: number;
  initialElementData: E;
  addBtnText: string;
};

export const FormElementGroup = <E extends {}>(
  props: FormElementGroupProps<E>,
): React.ReactElement => {
  const {
    name,
    onChange,
    elements,
    renderElement,
    maxElements,
    initialElementData,
    addBtnText,
  } = props;
  const elementsCount = elements.length;
  const onAdd = useCallback(() => {
    onChange &&
      onChange(_.cloneDeep(initialElementData), `${name}[${elementsCount}]`);
  }, [name, elementsCount, initialElementData, onChange]);

  return (
    <div className="form-entities-group">
      {elements.map((element, i) => renderElement(element, i))}
      <div className="form-entities-group__add-btn-container">
        <Button
          neutral
          active={maxElements ? elementsCount < maxElements : true}
          icon={<i className="icon-add" />}
          onClick={onAdd}
        >
          {addBtnText}
        </Button>
      </div>
    </div>
  );
};
FormElementGroup.defaultProps = {
  addBtnText: 'Добавить элемент',
};

export type ShowSuccessMessageCallback = (
  message: string,
  actions: MessageAction[],
  modal?: boolean,
) => void;

export type ShowErrorMessageCallback = (
  message: string,
  actions: MessageAction[],
) => void;

export type FormSubmittedHandler<R> = (
  response: R,
  showSuccessMessage: ShowSuccessMessageCallback,
  reset: SimpleCallback,
) => void;

export type FormErrorHandler<E extends Error = AxiosError> = (
  error: E,
  showErrorMessage: ShowErrorMessageCallback,
  reloadCallback: SimpleCallback,
) => void;

export type RevokeRelatedDataCallback<R> = (response: R) => void;

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
  onSubmitted: FormSubmittedHandler<R>;
  onError: FormErrorHandler<E>;
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

  const handleSubmitted = React.useCallback(
    (response: R) => {
      const messagePopup = messagePopupRef.current;
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
    [revokeRelatedData, onSubmitted, reset],
  );

  const handleError = React.useCallback(
    (error: E, reloadCallback: SimpleCallback) => {
      const messagePopup = messagePopupRef.current;
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
    [onError],
  );

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
          <Button<typeof Link> tag={Link} neutral={true} to={cancelLink}>
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
    <div className={classnames('form', className)}>
      <form id={id} ref={ref} onChange={onChange} autoComplete={autocomplete} />
      {content}
    </div>
  ) : (
    <form
      id={id}
      ref={ref}
      onChange={onChange}
      className={classnames('form', className)}
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
