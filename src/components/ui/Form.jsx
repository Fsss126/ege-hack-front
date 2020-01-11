import React, {useCallback} from "react";
import Button from "./Button";
import {LOADING_STATE, LoadingIndicator, useLoadingState} from "./LoadingIndicator";
import MessagePopup from "./MessagePopup";
import NavigationBlocker from "../common/NavigationBlocker";
import {Link, useHistory} from "react-router-dom";

export function useFormState(callback, onSubmitted, onError) {
    const [hasChanged, setChanged] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(null);

    const onChange = React.useCallback(() => {
        setChanged(true);
    }, []);

    const handleSubmit = React.useCallback(async (...params) => {
        if (callback) {
            const returnValue = callback(...params);
            if (returnValue instanceof Promise) {
                setSubmitting(true);
                try {
                    const result = await returnValue;
                    setChanged(false);
                    onSubmitted && onSubmitted(result);
                }
                catch (e) {
                    console.error(e);
                    onError && onError(e, handleSubmit);
                }
                finally {
                    setSubmitting(false);
                }
            }
        }
    }, [callback, onSubmitted, onError]);

    return {
        submitting,
        handleSubmit,
        hasChanged,
        onChange
    }
}

export function useForm(initFormData, checkValidity) {
    const [formData, setFormData] = React.useState(initFormData);
    const [isValid, setValidity] = React.useState(false);

    const onInputChange = React.useCallback((value, name) => {
        setFormData(state => ({...state, [name]: value}));
    }, []);

    const reset = React.useCallback(() => {
        setFormData(initFormData);
    }, []);

    React.useEffect(() => {
        if (checkValidity) {
            setValidity(checkValidity(formData));
        }
        else
            setValidity(undefined);
    }, [formData, checkValidity]);

    return {
        formData,
        isValid,
        onInputChange,
        reset
    }
}

export const FieldsContainer = ({children, className}) => {
  return (
      <div className={`form__fields ${className || ''}`}>
          {children}
      </div>);
};

const Form = (props, ref) => {
    const {
        title,
        className,
        children,
        submitButtonText = 'Сохранить',
        isValid,
        autocomplete="off",
        onSubmit,
        onSubmitted,
        onError,
        reset,
        revokeRelatedData,
        cancelLink
    } = props;

    const messagePopupRef = React.useRef(null);

    const handleSubmitted = React.useCallback((response) => {
        const messagePopup = messagePopupRef.current;
        const showSuccessMessage = (message, actions, modal = true) => {
            messagePopup.showMessage({
                message,
                success: true,
                modal,
                actions
            });
        };
        revokeRelatedData(response);
        onSubmitted(response, showSuccessMessage, reset);
    }, [revokeRelatedData, onSubmitted, reset]);

    const handleError = React.useCallback((error, reloadCallback) => {
        const messagePopup = messagePopupRef.current;
        const showErrorMessage = (message, actions) => {
            messagePopup.showMessage({
                message,
                error: true,
                modal: true,
                actions
            });
        };
        onError(error, showErrorMessage, reloadCallback);
    }, [onError]);

    const {submitting, handleSubmit, hasChanged, onChange} = useFormState(onSubmit, handleSubmitted, handleError);
    const state = useLoadingState(submitting, submitting === false);

    // const history = useHistory();
    // const cancelCallback = useCallback(() => {
    //     if (history.length > 0)
    //         history.goBack();
    //     else
    //         history.push(cancelLink);
    // }, [history, cancelLink]);
    return (
        <form
            ref={ref}
            onChange={onChange}
            className={`form ${className || ''}`}
            autoComplete={autocomplete}>
            {title && <h3 className="form__title">{title}</h3>}
            {children}
            <div className="form__action-container btn-container text-right">
                <Button
                    tag={Link}
                    neutral={true}
                    to={cancelLink}>
                    Отменить
                </Button>
                {' '}
                <Button
                    active={isValid}
                    icon={(hasChanged || state !== LOADING_STATE.DONE) && (<LoadingIndicator state={state}/>)}
                    onClick={handleSubmit}>
                    {submitButtonText}
                </Button>
            </div>
            <MessagePopup ref={messagePopupRef}/>
            {hasChanged && <NavigationBlocker/>}
        </form>
    )
};

export default React.forwardRef(Form);
