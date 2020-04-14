import classnames from 'classnames';
import React from 'react';

export type FieldsContainer = {
  children: React.ReactNode;
  className?: string;
};

const FieldsContainer: React.FC<FieldsContainer> = (props) => {
  const {children, className} = props;

  return (
    <div className={classnames('form__fields', className)}>{children}</div>
  );
};

export default FieldsContainer;
