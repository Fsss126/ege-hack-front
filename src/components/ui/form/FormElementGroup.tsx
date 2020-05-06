import classNames from 'classnames';
import _ from 'lodash';
import React, {useCallback} from 'react';

import Button from '../Button';
import {InputChangeHandler} from '../input/Input';

export type FormElementProps = {
  index: number;
  name: string;
  className?: string;
  onChange: InputChangeHandler<any>;
  deletable: boolean;
  children: React.ReactNode;
};

export const FormElement: React.withDefaultProps<React.FC<FormElementProps>> = (
  props,
) => {
  const {index, name, className, onChange, deletable, children} = props;
  const onDelete = useCallback(() => {
    if (onChange) {
      onChange(null, `${name}[${index}]`);
    }
  }, [name, index, onChange]);

  return (
    <div className={classNames('form-entity', className)}>
      {deletable && (
        <div className="form-entity__delete-btn-container">
          <i className="icon-close" onClick={onDelete} />
        </div>
      )}
      {children}
    </div>
  );
};
FormElement.defaultProps = {
  deletable: true,
};

export type FormElementGroupProps<E> = {
  name: string;
  onChange: InputChangeHandler<E>;
  elements: E[];
  renderElement: (element: E, i: number) => React.ReactElement;
  maxElements?: number;
  initialElementData: E;
  addBtnText: string;
};

export const FormElementGroup = <E extends {}>(
  props: FormElementGroupProps<E>,
): React.ReactElement => {
  const {
    name,
    onChange,
    elements,
    renderElement,
    maxElements,
    initialElementData,
    addBtnText,
  } = props;
  const elementsCount = elements.length;
  const onAdd = useCallback(() => {
    if (onChange) {
      onChange(_.cloneDeep(initialElementData), `${name}[${elementsCount}]`);
    }
  }, [name, elementsCount, initialElementData, onChange]);

  return (
    <div className="form-entities-group">
      {elements.map((element, i) => renderElement(element, i))}
      <div className="form-entities-group__add-btn-container">
        <Button
          neutral
          active={maxElements ? elementsCount < maxElements : true}
          after={<i className="icon-add" />}
          onClick={onAdd}
        >
          {addBtnText}
        </Button>
      </div>
    </div>
  );
};
FormElementGroup.defaultProps = {
  addBtnText: 'Добавить элемент',
};
