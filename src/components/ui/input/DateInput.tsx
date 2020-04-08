import 'moment/locale/ru';
import 'react-day-picker/lib/style.css';

import React, {forwardRef, useCallback, useEffect, useRef} from 'react';
import {DayPickerInputProps, DayPickerProps} from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils from 'react-day-picker/moment';

import {assignRef} from '../../../definitions/helpers';
import {Input, InputChangeHandler} from './Input';

const localeProps = {
  localeUtils: MomentLocaleUtils,
  locale: 'ru',
};

const classNames = {
  container: 'DayPickerInput',
  overlayWrapper: 'DayPickerInput-OverlayWrapper',
  overlay: 'DayPickerInput-Overlay overlay-window',
};

export type DateInputProps = {
  value?: Date;
  name: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  dayPickerProps: DayPickerProps;
  required?: boolean;
  onChange?: InputChangeHandler<Date>;
} & Omit<DayPickerInputProps, 'onChange'>;
const DateInput = forwardRef<DayPickerInput, DateInputProps>(
  (props, forwardedRef) => {
    const {
      dayPickerProps = {},
      name,
      inputProps,
      onChange,
      required = false,
      value,
      ...otherProps
    } = props;

    const ownRef = useRef<DayPickerInput>();
    const setRef = useCallback(
      (ref: DayPickerInput) => {
        assignRef(forwardedRef, ref);
        ownRef.current = ref;
      },
      [forwardedRef],
    );

    const onDayChange: DayPickerInputProps['onDayChange'] = useCallback(
      (day: Date) => {
        const newDate = new Date(day.getTime());

        if (value) {
          newDate.setHours(value.getHours());
          newDate.setMinutes(value.getMinutes());
        }
        onChange && onChange(newDate, name);
      },
      [onChange, value, name],
    );

    useEffect(() => {
      const dayPicker = ownRef.current;

      if (!value && dayPicker) {
        dayPicker.getInput().value = '';
      }
    }, [value]);

    return (
      <DayPickerInput
        ref={setRef}
        value={value}
        formatDate={MomentLocaleUtils.formatDate}
        parseDate={MomentLocaleUtils.parseDate}
        classNames={classNames}
        dayPickerProps={{
          showOutsideDays: true,
          ...localeProps,
          ...dayPickerProps,
        }}
        component={Input}
        inputProps={{
          name,
          type: 'text',
          required,
          ...inputProps,
        }}
        onDayChange={onDayChange}
        {...otherProps}
      />
    );
  },
);
DateInput.displayName = 'DateInput';

export default DateInput;
