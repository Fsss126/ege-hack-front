import classnames from 'classnames';
import React from 'react';

import {NavLink, NavLinkProps} from '../ui/Link';
import ButtonContainer, {ButtonContainerProps} from './ButtonContainer';

export const TabNavLink: React.FC<NavLinkProps> = (props) => {
  const {className, ...rest} = props;

  return (
    <NavLink className={classnames('tab-nav__nav-link', className)} {...rest} />
  );
};

// window.scroll({
//     top: 2500,
//     left: 0,
//     behavior: 'smooth'
// })

//TODO: scroll to active element
const TabNav: React.FC<ButtonContainerProps> = (props) => {
  const {className, ...rest} = props;

  return (
    <ButtonContainer className={classnames('tab-nav', className)} {...rest} />
  );
};

export default TabNav;
