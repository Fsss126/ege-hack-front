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

export type FormElementRenderProps<E, P extends object = {}> = P & {
  index: number;
  elements: E[];
  onChange: InputChangeHandler<E>;
};

export type ElementComponentProps<E, P extends object = {}> = E &
  FormElementRenderProps<E, P>;

export type FormElementGroupProps<E, P extends object = {}> = {
  name: string;
  onChange: InputChangeHandler<E>;
  elements: E[];
  maxElements?: number;
  renderProps: P;
  initialElementData: E;
  addBtnText: string;
} & (
  | {
      renderElement: (
        element: E,
        props: FormElementRenderProps<E, P>,
      ) => React.ReactElement;
    }
  | {
      elementComponent: React.ComponentType<ElementComponentProps<E, P>>;
    }
);

export const FormElementGroup = <E extends {}, P extends object = {}>(
  props: FormElementGroupProps<E, P>,
): React.ReactElement => {
  const {
    name,
    onChange,
    elements,
    maxElements,
    initialElementData,
    addBtnText,
    renderProps,
  } = props;
  const elementsCount = elements.length;
  const onAdd = useCallback(() => {
    if (onChange) {
      onChange(_.cloneDeep(initialElementData), `${name}[${elementsCount}]`);
    }
  }, [name, elementsCount, initialElementData, onChange]);

  let renderedElements;

  if ('renderElement' in props) {
    const {renderElement} = props;

    renderedElements = elements.map((element, index) =>
      renderElement(element, {...renderProps, index, elements, onChange}),
    );
  } else {
    const {elementComponent: Element} = props;

    renderedElements = elements.map((element, index) => (
      <Element
        {...element}
        {...renderProps}
        index={index}
        elements={elements}
        onChange={onChange}
        key={index}
      />
    ));
  }

  return (
    <div className="form-entities-group">
      {renderedElements}
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
  renderProps: {},
};
