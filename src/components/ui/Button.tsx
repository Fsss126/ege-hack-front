import classnames from 'classnames';
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
  icon?: React.ReactNode;
  iconAction?: SimpleCallback;
  onClick?: SimpleCallback;
  tag: T;
  className?: string;
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
    icon,
    iconAction,
    tag: Tag,
    onClick,
    ...rest
  } = props;
  const joinedClassname = classnames(
    'btn',
    {
      'btn-loading': loading,
      'btn-inactive': !active,
      'btn-neutral': neutral,
    },
    className,
  );

  return (
    <Tag className={joinedClassname} {...rest}>
      <span className="btn__content">
        {icon && (
          <div
            className="btn__after"
            onClick={iconAction ? iconAction : onClick}
          >
            {icon}
          </div>
        )}
        <span className="btn__name" onClick={active ? onClick : undefined}>
          {children}
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
    </Tag>
  );
};
Button.defaultProps = {
  active: true,
  neutral: false,
  loading: false,
  tag: 'div',
};

export default Button;
