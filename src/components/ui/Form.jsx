import React, {Fragment, useCallback} from "react";
import _ from 'lodash';
import classnames from 'classnames';
import Button from "./Button";
import {LOADING_STATE, LoadingIndicator, useLoadingState} from "./LoadingIndicator";
import MessagePopup from "./MessagePopup";
import NavigationBlocker from "../common/NavigationBlocker";
import {Link} from "react-router-dom";

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

export function useFormValidityChecker(formRef, checkInput, dependencies=[]) {
    return React.useCallback((formData) => {
        const formElement = formRef.current;
        if (!formElement)
            return false;
        for (let name in formData) {
            const input = formElement.elements[name];
            const checkResult = checkInput && checkInput(name, input, formData);
            if (checkResult === false)
                return false;
            else if (checkResult === true)
                continue;
            if (!input || !input.checkValidity())
                return false;
        }
        return true;
    }, [...dependencies]);
}

export function useForm(initFormData, checkValidity) {
    const [formData, setFormData] = React.useState(initFormData);
    const [isValid, setValidity] = React.useState(false);

    const onInputChange = React.useCallback((value, name) => {
        setFormData(state => {
            if (/\W/.test(name)) {
                const arrayMatch = name.match(/(.*)\[(.*)\]$/);
                if (arrayMatch) {
                    const [, arrayName, indexString] = arrayMatch;
                    const arrayIndex = parseInt(indexString);
                    const array = _.get(state, arrayName);
                    let newArray;
                    if (arrayIndex >= array.length) {
                        newArray = [...array];
                        newArray.push(value)
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
      <div className={classnames('form__fields', className)}>
          {children}
      </div>);
};

export const FormElement = ({index, name, className, onChange, deletable=true, children}) => {
    const onDelete = useCallback(() => {
        onChange && onChange(null, `${name}[${index}]`);
    }, [name, index, onChange]);
    return (
        <div className={classnames('form-entity', className)}>
            {deletable && (
                <div className="form-entity__delete-btn-container">
                    <i
                        className="icon-close"
                        onClick={onDelete}/>
                </div>
            )}
            {children}
        </div>
    );
};

export const FormElementGroup = ({name, onChange, elements, renderElement, maxElements, initialElementData, addBtnText = 'Добавить элемент'}) => {
    const elementsCount = elements.length;
    const onAdd = useCallback(() => {
        onChange && onChange(_.cloneDeep(initialElementData), `${name}[${elementsCount}]`);
    }, [name, elementsCount, initialElementData, onChange]);
    return (
        <div className="form-entities-group">
            {elements.map((element, i) => renderElement(element, i))}
            <div className="form-entities-group__add-btn-container">
                <Button
                    neutral
                    active={maxElements ? elementsCount < maxElements : true}
                    icon={<i className="icon-add"/>}
                    onClick={onAdd}>
                    {addBtnText}
                </Button>
            </div>
        </div>
    );
};

const Form = (props, ref) => {
    const {
        title,
        id,
        className,
        children,
        submitButtonText = 'Сохранить',
        cancelButtonText='Отменить',
        isValid,
        autocomplete="off",
        onSubmit,
        onSubmitted,
        onError,
        reset,
        revokeRelatedData,
        blockNavigation=true,
        cancelLink,
        onCancelClick,
        withNestedForms=false
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
        revokeRelatedData && revokeRelatedData(response);
        onSubmitted && onSubmitted(response, showSuccessMessage, reset);
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
        onError && onError(error, showErrorMessage, reloadCallback);
    }, [onError]);

    const {submitting, handleSubmit, hasChanged, onChange} = useFormState(onSubmit, handleSubmitted, handleError);
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
                    <Button
                        tag={Link}
                        neutral={true}
                        to={cancelLink}>
                        {cancelButtonText}
                    </Button>
                )}
                {onCancelClick && (
                    <Button
                        neutral={true}
                        onClick={onCancelClick}>
                        {cancelButtonText}
                    </Button>
                )}
                {' '}
                <Button
                    active={isValid}
                    icon={(hasChanged || state !== LOADING_STATE.DONE) && (<LoadingIndicator state={state}/>)}
                    onClick={handleSubmit}>
                    {submitButtonText}
                </Button>
            </div>
            <MessagePopup ref={messagePopupRef}/>
            {blockNavigation && hasChanged && <NavigationBlocker/>}
        </Fragment>
    );
    return withNestedForms ? (
        <div
            className={classnames('form', className)}>
            <form
                id={id}
                ref={ref}
                onChange={onChange}
                autoComplete={autocomplete}/>
            {content}
        </div>
    ) : (
        <form
            id={id}
            ref={ref}
            onChange={onChange}
            className={classnames('form', className)}
            autoComplete={autocomplete}>
            {content}
        </form>
    )
};

export default React.forwardRef(Form);
