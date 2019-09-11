import React from 'react';

function useChangeHandler(callback, inputProp = 'value') {
    return React.useCallback((event) => {
        callback(event.currentTarget[inputProp], event.currentTarget.name, event);
    }, [callback, inputProp])
}

const CheckBox = ({value, onChange: callback, name, label, ...props}) => {
    const onChange = useChangeHandler(callback, 'checked');
    return (
        <label className={`input input-checkbox`}>
            <input type="checkbox" name={name} checked={value} onChange={onChange} {...props}/>
            <span className="input__box"/>
            <span className="input__label">{label}</span>
        </label>
    );
};

const Input = ({className, onChange: callback, ...props}) => {
    const onChange = useChangeHandler(callback);
    return (
        <input className={`input ${className || ''}`} onChange={onChange} {...props}/>
    );
};

Object.assign(Input, {
    CheckBox
});

export default Input;

