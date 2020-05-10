import classNames from 'classnames';
import React, {forwardRef, useCallback} from 'react';
import {IdentityFunction} from 'types/utility/helpers';

import {InputContainer} from './InputContainer';

export interface InputChangeHandler<T, E = HTMLInputElement> {
  <T, E = HTMLInputElement>(
    value: T,
    name: string,
    event: React.ChangeEvent<E>,
  ): void;
  <T>(value: T, name: string): void;
}

type InputValue = React.InputHTMLAttributes<HTMLInputElement>['value'];
function useChangeHandler(
  callback: InputChangeHandler<boolean>,
  inputProp: 'checked',
  parse?: IdentityFunction<boolean>,
): React.ChangeEventHandler<HTMLInputElement>;
function useChangeHandler<
  E extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement
>(
  callback: InputChangeHandler<InputValue, E>,
  inputProp: 'value',
  parse?: IdentityFunction<InputValue>,
): React.ChangeEventHandler<E>;
function useChangeHandler(
  callback: InputChangeHandler<any>,
  inputProp: 'value' | 'checked' = 'value',
  parse?: IdentityFunction<any>,
): React.ChangeEventHandler<HTMLInputElement> {
  return useCallback(
    (event) => {
      const value = event.currentTarget[inputProp];
      const name = event.currentTarget.name;
      callback(parse ? parse(value) : value, name, event);
    },
    [callback, inputProp, parse],
  );
}

export type CheckBoxProps = {
  value: boolean;
  onChange: InputChangeHandler<boolean>;
  label: React.ReactNode;
  parse?: IdentityFunction<boolean>;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>;

export const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(
  (props, ref) => {
    const {value, onChange: callback, name, label, parse, ...rest} = props;
    const onChange = useChangeHandler(callback, 'checked', parse);

    return (
      <label className={`input input-checkbox`}>
        <input
          ref={ref}
          type="checkbox"
          name={name}
          checked={value}
          onChange={onChange}
          {...rest}
        />
        <span className="input__box" />
        <span className="input__label">{label}</span>
      </label>
    );
  },
);
CheckBox.displayName = 'CheckBox';

function onNumberKeyPress(event: React.KeyboardEvent<HTMLInputElement>): void {
  const enteredChar = event.key;

  if (!(enteredChar >= '0' && enteredChar <= '9')) {
    event.preventDefault();
  }
}

function formatPrice(
  value: null | undefined | number | string,
): undefined | string {
  if (value === null || value === undefined) {
    return undefined;
  }
  const str = value.toString();

  return str.length > 0 ? `${value}₽` : str;
}

function parsePrice(price: string): string {
  return price.replace(/[^\d]+/g, '');
}

export const getPlaceholder = (
  placeholder?: string,
  required?: boolean,
): string | undefined =>
  placeholder ? (required ? `${placeholder}*` : placeholder) : undefined;

export type InputProps = {
  format?: IdentityFunction<InputValue>;
  parse?: IdentityFunction<InputValue>;
  onChange?: InputChangeHandler<InputValue>;
  withContainer?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    value,
    className,
    onChange: callback,
    type = 'text',
    format,
    parse,
    placeholder,
    required,
    withContainer,
    ...rest
  } = props;
  // if (type === "price") {
  //     format || (format = formatPrice);
  //     parse || (parse = parsePrice);
  // }
  const onChange = callback
    ? useChangeHandler(callback, 'value', parse)
    : undefined;

  const input = (
    <input
      ref={ref}
      className={classNames('input', className)}
      required={required}
      value={format ? format(value) : value}
      onChange={onChange}
      type={type === 'number' || type === 'price' ? 'text' : type}
      onKeyPress={
        type === 'number' || type === 'price' ? onNumberKeyPress : undefined
      }
      placeholder={
        placeholder && !withContainer
          ? getPlaceholder(placeholder, required)
          : undefined
      }
      {...rest}
    />
  );

  return withContainer ? (
    <InputContainer placeholder={placeholder} required={required}>
      {input}
    </InputContainer>
  ) : (
    input
  );
});
Input.displayName = 'Input';
Input.defaultProps = {
  maxLength: 50,
  withContainer: true,
};

export type TextAreaProps = {
  onChange: InputChangeHandler<InputValue, HTMLTextAreaElement>;
  withContainer?: boolean;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    const {
      className,
      onChange: callback,
      placeholder,
      required,
      withContainer,
      ...rest
    } = props;
    const onChange = useChangeHandler<HTMLTextAreaElement>(callback, 'value');

    const textarea = (
      <textarea
        ref={ref}
        className={classNames('input', className)}
        onChange={onChange}
        required={required}
        {...rest}
      />
    );

    return withContainer ? (
      <InputContainer placeholder={placeholder} required={required}>
        {textarea}
      </InputContainer>
    ) : (
      textarea
    );
  },
);
TextArea.displayName = 'TextArea';
TextArea.defaultProps = {
  withContainer: true,
};
