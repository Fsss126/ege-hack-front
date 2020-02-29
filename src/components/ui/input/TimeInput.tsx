import React, {useCallback} from "react";
import TimePicker from 'react-times';
import {Input, InputChangeHandler, InputProps} from "./Input";
import {renderDate} from "definitions/helpers";
import {useToggle} from "hooks/common";

import 'react-times/css/material/default.css';

export type TimeInputProps = {
    value: Date;
    name: string;
    onChange?: InputChangeHandler<Date>;
    disabled?: boolean;
    placeholder?: string;
    required?: boolean;
    focused?: boolean;
} & InputProps;
const TimeInput: React.FC<TimeInputProps> = (props) => {
    const {value, name, onChange, disabled, placeholder, focused = false, ...inputProps} = props;
    const [isFocused, toggleFocus] = useToggle(focused);
    const onTimeChange = useCallback(({hour, minute}) => {
        const time = new Date(value.getTime());
        time.setHours(hour);
        time.setMinutes(minute);
        onChange && onChange(time, name);
    }, [value, name, onChange]);

    const time = value ? renderDate(value, {...renderDate.time, hour12: false}) : null;
    return (
        <TimePicker
            trigger={<Input
                placeholder={placeholder}
                onClick={toggleFocus}
                value={time || ''}
                {...inputProps}/>}
            time={time}
            focused={isFocused}
            onTimeChange={onTimeChange}
            onFocusChange={toggleFocus}
            disabled={disabled}
            withoutIcon
            timeMode="24"/>
    );
};

export default TimeInput;
