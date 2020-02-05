import React, {useCallback} from "react";
import TimePicker from 'react-times';
import {Input} from "./Input";
import {renderDate} from "definitions/helpers";
import {useToggle} from "hooks/common";

import 'react-times/css/material/default.css';

const TimeInput = ({value, name, onChange, disabled, focused = false}) => {
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
                onClick={toggleFocus}
                value={time || ''}/>}
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
