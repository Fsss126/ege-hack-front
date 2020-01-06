import React from "react";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {
    formatDate,
    parseDate,
} from 'react-day-picker/moment';
import 'moment/locale/ru';

import 'react-day-picker/lib/style.css';

const localeProps = {
    localeUtils: MomentLocaleUtils,
    locale: 'ru'
};

const classNames = {
    container: 'DayPickerInput',
    overlayWrapper: 'DayPickerInput-OverlayWrapper',
    overlay: 'DayPickerInput-Overlay overlay-window'
};

const DateInput = (props, forwardedRef) => {
    const {
        dayPickerProps = {},
        name,
        inputProps,
        onChange,
        required = false,
        value,
        ...otherProps
    } = props;

    const ownRef = React.useRef(null);
    const setRef = React.useCallback((ref) => {
        if (forwardedRef)
            forwardedRef.current = ref;
        ownRef.current = ref;
    }, [forwardedRef]);

    const onDayChange = React.useCallback((day, modifiers, dayPickerInput) => {
        onChange && onChange(day, dayPickerInput.getInput().name);
    }, [onChange]);

    React.useEffect(() => {
        if (!value) {
            const dayPicker = ownRef.current;
            dayPicker.getInput().value = '';
        }
    }, [value]);

    return (
        <DayPickerInput
            ref={setRef}
            value={value}
            formatDate={formatDate}
            parseDate={parseDate}
            classNames={classNames}
            dayPickerProps={{
                ...localeProps,
                ...dayPickerProps
            }}
            inputProps={{
                name,
                type: "text",
                required,
                ...inputProps
            }}
            onDayChange={onDayChange}
            {...otherProps}
        />
    );
};

export default React.forwardRef(DateInput);
