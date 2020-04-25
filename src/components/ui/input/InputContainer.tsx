import classNames from 'classnames';
import React from 'react';

import {getPlaceholder} from './Input';

interface InputContainerProps {
  placeholder?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const InputContainer = (
  props: InputContainerProps,
): React.ReactElement => {
  const {placeholder, required, className, children} = props;

  return (
    <div className={classNames('input-container', className)}>
      {placeholder && (
        <div className="input-container__title">
          {getPlaceholder(placeholder, required)}
        </div>
      )}
      {children}
    </div>
  );
};
