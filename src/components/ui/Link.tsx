import classnames from 'classnames';
import React, {useCallback} from 'react';
import {
  Link as RouterLink,
  LinkProps,
  NavLink as RouterNavLink,
} from 'react-router-dom';

export type NavLinkProps = {
  disabled?: boolean;
  className?: string;
} & React.ComponentProps<typeof RouterNavLink>;

export const NavLink: React.FC<NavLinkProps> = ({
  disabled,
  className,
  ...props
}) => {
  const onClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (event) => {
      if (disabled) {
        event.preventDefault();
      }
    },
    [disabled],
  );

  return (
    <RouterNavLink
      className={classnames('nav-link', className, {
        disabled,
      })}
      activeClassName="active"
      onClick={onClick}
      {...props}
    />
  );
};

const Link: React.FC<LinkProps> = ({to: link, ...props}) => {
  const isExternal = React.useMemo(() => {
    if (typeof link !== 'string') {
      return false;
    }
    try {
      new URL(link);
      return true;
    } catch (e) {
      return false;
    }
  }, [link]);

  if (typeof link === 'string' && isExternal) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" {...props} />
    );
  } else {
    return <RouterLink to={link} {...props} />;
  }
};

export default Link;
