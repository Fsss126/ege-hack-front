import React from 'react';

function useChangeHandler(callback, inputProp = 'value', parse) {
    return React.useCallback((event) => {
        const value = event.currentTarget[inputProp];
        const name = event.currentTarget.name;
        callback(parse ? parse(value) : value, name, event);
    }, [callback, inputProp, parse])
}

export const CheckBox = ({value, onChange: callback, name, label, ...props}) => {
    const onChange = useChangeHandler(callback, 'checked');
    return (
        <label className={`input input-checkbox`}>
            <input type="checkbox" name={name} checked={value} onChange={onChange} {...props}/>
            <span className="input__box"/>
            <span className="input__label">{label}</span>
        </label>
    );
};

function onNumberKeyPress(event) {
    let enteredChar = String.fromCharCode(event.charCode);
    if (!(enteredChar >= '0' && enteredChar <= '9'))
        event.preventDefault();
}

// function formatPrice(value) {
//     return value && value.length > 0 ? `${value}₽` : value;
// }
//
// function parsePrice(price) {
//     return price.slice(0, price.length - 1);
// }

export const Input = ({value, className, onChange: callback, type = "text", format, parse, ...props}) => {
    // if (type === "price") {
    //     format || (format = formatPrice);
    //     parse || (parse = parsePrice);
    // }
    const onChange = useChangeHandler(callback, undefined, parse);
    return (
        <input
            className={`input ${className || ''}`}
            value={format ? format(value) : value}
            onChange={onChange}
            type={type === "number" ? "text" : type}
            onKeyPress={type === "number" ? onNumberKeyPress : undefined}
            {...props}/>
    );
};

Input.defaultProps = {
    maxLength: 50
};

export const TextArea = ({className, onChange: callback, ...props}) => {
    const onChange = useChangeHandler(callback);
    return (
        <textarea className={`input ${className || ''}`} onChange={onChange} {...props}/>
    );
};

