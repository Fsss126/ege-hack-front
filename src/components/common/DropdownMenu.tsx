import classNames from 'classnames';
import React from 'react';

export type DropdownMenuOptionProps<
  T extends React.ElementType = React.ElementType<JSX.IntrinsicElements['div']>
> = {
  children?: React.ReactNode;
  tag: T;
  className?: string;
} & React.ComponentProps<T>;

export const DropdownMenuOption = <T extends React.ElementType>(
  props: DropdownMenuOptionProps<T>,
): React.ReactElement => {
  const {tag: Tag = 'div', children, className, ...rest} = props;

  return (
    <Tag className={classNames('dropdown__menu-option', className)} {...rest}>
      {children}
    </Tag>
  );
};
DropdownMenuOption.defaultProps = {
  tag: 'div',
};

export type DropdownIconButtonProps = {
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

export const DropdownIconButton: React.FC<DropdownIconButtonProps> = (
  props,
) => {
  const {className, ...rest} = props;

  return (
    <i className={classNames('dropdown__icon-btn', className)} {...rest} />
  );
};

export type DropdownMenuProps = {
  content: React.ReactElement;
  className?: string;
  children: React.ReactNode;
};
const DropdownMenu: React.FC<DropdownMenuProps> = (props) => {
  const {content, className, children: options} = props;

  return (
    <div className={classNames('dropdown', className)}>
      {content}
      <div className="dropdown__menu-container">
        <div className="dropdown__menu overlay-window">{options}</div>
      </div>
    </div>
  );
};

export default DropdownMenu;
