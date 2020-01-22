import React, {forwardRef} from 'react';

function useChangeHandler(callback, inputProp = 'value', parse) {
    return React.useCallback((event) => {
        const value = event.currentTarget[inputProp];
        const name = event.currentTarget.name;
        callback(parse ? parse(value) : value, name, event);
    }, [callback, inputProp, parse])
}

export let CheckBox = ({value, onChange: callback, name, label, ...props}, ref) => {
    const onChange = useChangeHandler(callback, 'checked');
    return (
        <label className={`input input-checkbox`}>
            <input ref={ref} type="checkbox" name={name} checked={value} onChange={onChange} {...props}/>
            <span className="input__box"/>
            <span className="input__label">{label}</span>
        </label>
    );
};
CheckBox = forwardRef(CheckBox);

function onNumberKeyPress(event) {
    let enteredChar = event.key;
    if (!(enteredChar >= '0' && enteredChar <= '9'))
        event.preventDefault();
}

function formatPrice(value) {
    if (value === null || value === undefined)
        return value;
    const str = value.toString();
    return str.length > 0 ? `${value}₽` : value;
}

function parsePrice(price) {
    return price.replace(/[^\d]+/g, '');
}

export const getPlaceholder = (placeholder, required) => placeholder ? (required ? `${placeholder}*` : placeholder) : undefined;

export let Input = ({value, className, onChange: callback, type = "text", format, parse, placeholder, required, ...props}, ref) => {
    // if (type === "price") {
    //     format || (format = formatPrice);
    //     parse || (parse = parsePrice);
    // }
    const onChange = useChangeHandler(callback, undefined, parse);
    return (
        <input
            ref={ref}
            className={`input ${className || ''}`}
            required={required}
            placeholder={getPlaceholder(placeholder, required)}
            value={format ? format(value) : value}
            onChange={onChange}
            type={type === "number" || type === "price" ? "text" : type}
            onKeyPress={type === "number" || type === "price" ? onNumberKeyPress : undefined}
            {...props}/>
    );
};
Input = forwardRef(Input);
Input.defaultProps = {
    maxLength: 50
};


export let TextArea = ({className, onChange: callback, placeholder, required, ...props}, ref) => {
    const onChange = useChangeHandler(callback);
    return (
        <textarea
            ref={ref}
            className={`input ${className || ''}`} onChange={onChange}
            required={required}
            placeholder={getPlaceholder(placeholder, required)}
            {...props}/>
    );
};
TextArea = forwardRef(TextArea);


