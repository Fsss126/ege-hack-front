import classNames from 'classnames';
import React from 'react';

import {ContentBlock, ContentBlockProps} from '../layout/ContentBlock';
import {NavLink, NavLinkProps} from '../ui/Link';
import ScrollContainer, {ScrollContainerProps} from './ScrollContainer';

export const TabNavLink: React.FC<NavLinkProps> = (props) => {
  const {className, ...rest} = props;

  return (
    <NavLink className={classNames('tab-nav__nav-link', className)} {...rest} />
  );
};

// window.scroll({
//     top: 2500,
//     left: 0,
//     behavior: 'smooth'
// })

// TODO: scroll to active element
const TabNav: React.FC<ScrollContainerProps> = (props) => {
  const {className, ...rest} = props;

  return (
    <ScrollContainer className={classNames('tab-nav', className)} {...rest} />
  );
};

export const TabNavBlock: React.FC<ContentBlockProps> = (props) => {
  const {className} = props;

  return (
    <ContentBlock
      {...props}
      titleInside
      titleBig
      className={classNames('tab-nav-container', className)}
    />
  );
};

export default TabNav;
