import React from "react";
import classnames from 'classnames';
import {NavLink} from "../ui/Link";
import ButtonContainer from "./ButtonContainer";

export const TabNavLink = ({className, ...props}) => {
    return <NavLink className={classnames('tab-nav__nav-link', className)} {...props}/>
};

// window.scroll({
//     top: 2500,
//     left: 0,
//     behavior: 'smooth'
// })

//TODO: scroll to active element
const TabNav = ({children}) => {
    return (
        <ButtonContainer className="tab-nav">
            {children}
        </ButtonContainer>
    );
};

export default TabNav;
