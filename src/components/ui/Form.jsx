import React from "react";
import Button from "./Button";
import {LOADING_STATE, LoadingIndicator, useLoadingState} from "./LoadingIndicator";
import MessagePopup from "./MessagePopup";

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
                    onSubmitted && onSubmitted();
                }
                catch (e) {
                    console.error(e);
                    onError && onError(handleSubmit);
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

export function useForm(initialFormData, checkValidity) {
    const [formData, setFormData] = React.useState(initialFormData);
    const [isValid, setValidity] = React.useState(false);

    const onInputChange = React.useCallback((value, name) => {
        setFormData(state => ({...state, [name]: value}));
    }, []);

    const reset = React.useCallback(() => {
        setFormData(initialFormData);
    }, []);

    React.useEffect(() => {
        if (checkValidity) {
            console.log(checkValidity(formData), formData);
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
        className,
        children,
        submitButtonText = 'Сохранить',
        isValid,
        autocomplete="off",
        onSubmit,
        onSubmitted,
        onError
        // reset,
        // redirectUrl
    } = props;

    const messagePopupRef = React.useRef(null);

    const handleSubmitted = React.useCallback(() => {
        const messagePopup = messagePopupRef.current;
        const showSuccessMessage = (message, actions) => {
            messagePopup.showMessage({
                message,
                success: true,
                modal: true,
                actions
            });
        };
        onSubmitted(showSuccessMessage);
    }, [onSubmitted]);

    const handleError = React.useCallback((reloadCallback) => {
        const messagePopup = messagePopupRef.current;
        const showErrorMessage = (message, actions) => {
            messagePopup.showMessage({
                message,
                error: true,
                modal: true,
                actions
            });
        };
        onError(showErrorMessage, reloadCallback);
    }, [onError]);

    const {submitting, handleSubmit, hasChanged, onChange} = useFormState(onSubmit, handleSubmitted, handleError);
    const state = useLoadingState(submitting, submitting === false);

    return (
        <form
            ref={ref}
            onChange={onChange}
            className={`form ${className || ''}`}
            autoComplete={autocomplete}>
            {children}
            <div className="form__action-container d-flex justify-content-end">
                <Button
                    active={isValid}
                    icon={(hasChanged || state !== LOADING_STATE.DONE) && (<LoadingIndicator state={state}/>)}
                    onClick={handleSubmit}>
                    {submitButtonText}
                </Button>
            </div>
            <MessagePopup ref={messagePopupRef}/>
        </form>
    )
};

export default React.forwardRef(Form);
