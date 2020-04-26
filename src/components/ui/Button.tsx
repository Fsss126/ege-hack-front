import classNames from 'classnames';
import React, {ReactElement} from 'react';
import {CSSTransition} from 'react-transition-group';
import {SimpleCallback} from 'types/utility/common';

export type ButtonProps<
  T extends React.ElementType = React.ElementType<JSX.IntrinsicElements['div']>
> = {
  children?: React.ReactNode;
  active: boolean;
  neutral: boolean;
  loading: boolean;
  after?: React.ReactNode;
  afterAction?: SimpleCallback;
  before?: React.ReactNode;
  beforeAction?: SimpleCallback;
  component: T;
  className?: string;
  dataAttribute?: boolean;
} & React.ComponentProps<T>;

const Button = <T extends React.ElementType>(
  props: ButtonProps<T>,
): ReactElement => {
  // const clickCallback = React.useCallback((e) => {
  //     console.log(e.target, e.currentTarget, e.target === e.currentTarget);
  //     if (e.target === e.currentTarget)
  //         onClick(e);
  // }, [onClick]);
  const {
    className,
    children,
    active,
    neutral,
    loading,
    after,
    afterAction,
    before,
    beforeAction,
    component: Component,
    onClick,
    dataAttribute,
    ...rest
  } = props;
  const joinedClassname = classNames(
    'btn',
    {
      'btn-loading': loading,
      'btn-inactive': !active,
      'btn-neutral': neutral,
    },
    className,
  );

  return (
    <Component className={joinedClassname} {...rest}>
      <span className="btn__content">
        {before && (
          <div
            className="btn__before"
            onClick={beforeAction ? beforeAction : onClick}
          >
            {before}
          </div>
        )}
        {after && (
          <div
            className="btn__after"
            onClick={afterAction ? afterAction : onClick}
          >
            {after}
          </div>
        )}
        <span
          className="btn__name"
          onClick={active ? onClick : undefined}
          data-content={dataAttribute ? children : undefined}
        >
          {!dataAttribute && children}
        </span>
      </span>
      <CSSTransition
        in={loading}
        appear
        mountOnEnter
        unmountOnExit
        classNames="animation-fade"
        timeout={300}
      >
        <div className="btn-overlay">
          <div className="spinner-border" />
        </div>
      </CSSTransition>
    </Component>
  );
};
Button.defaultProps = {
  active: true,
  neutral: false,
  loading: false,
  component: 'div',
};

export default Button;
