import React from 'react';
import _ from 'lodash';
import { NavLink } from "react-router-dom";
import Contacts from "./common/Contacts";
import {ACCOUNT_ROLES} from "definitions/constants";

function Link(props) {
    return <NavLink className="layout__sidebar-menu-link" activeClassName="active" {...props}/>;
}

export default class SideBar extends React.Component{
    onClick = (event) => {
        if (event.target === event.currentTarget || event.target.classList.contains('layout__sidebar-menu-link'))
            this.props.onMenuClose();
    };

    render() {
        const {accountRoles} = this.props;
        let isAdmin, isModerator, isTeacher, isPupil;
        if (accountRoles === undefined) {
            isAdmin = undefined; isModerator = undefined; isTeacher = undefined; isPupil = undefined;
        }
        else if (accountRoles === null) {
            isAdmin = null; isModerator = null; isTeacher = null; isPupil = null;
        }
        if (accountRoles) {
            isAdmin = _.includes(accountRoles, ACCOUNT_ROLES.ADMIN);
            isModerator = _.includes(accountRoles, ACCOUNT_ROLES.MODERATOR);
            isTeacher = _.includes(accountRoles, ACCOUNT_ROLES.TEACHER);
            isPupil = _.includes(accountRoles, ACCOUNT_ROLES.PUPIL);
        }
        if (accountRoles === null)
            return null;
        return (
            <div className="layout__sidebar" onClick={this.onClick}>
                <div className="layout__sidebar-bar">
                    {accountRoles === undefined ? (
                        <div className="layout__sidebar-content">
                            <div className="layout__sidebar-menu ph-item">
                                <div className="layout__sidebar-menu-section">
                                    <div className="layout__sidebar-menu-link"><div className="ph-text"/></div>
                                    <div className="layout__sidebar-menu-link"><div className="ph-text"/></div>
                                    <div className="layout__sidebar-menu-link"><div className="ph-text"/></div>
                                    <div className="layout__sidebar-menu-link"><div className="ph-text"/></div>
                                    <div className="layout__sidebar-menu-link"><div className="ph-text"/></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="layout__sidebar-content">
                            <div className="layout__sidebar-menu">
                                {isPupil && (
                                    <div className="layout__sidebar-menu-section">
                                        <Link to="/courses/">Мои курсы</Link>
                                        {/*<Link to="/homework/">Домашняя работа</Link>*/}
                                    </div>
                                )}
                                <div className="layout__sidebar-menu-section">
                                    <Link to="/shop/">Магазин курсов</Link>
                                    <Link to="/teachers/">Преподаватели</Link>
                                    <Link to="/about/">О нас</Link>
                                </div>
                                {(isAdmin || isModerator) && (
                                    <React.Fragment>
                                        <div className="layout__sidebar-menu-section">
                                            <Link to="/courses/">Мои курсы</Link>
                                            <Link to="/homework/">Домашняя работа</Link>
                                        </div>
                                        <div className="layout__sidebar-menu-section">
                                            <Link to="/shop/">Магазин курсов</Link>
                                            <Link to="/teachers/">Преподаватели</Link>
                                            <Link to="/about/">О нас</Link>
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                            <Contacts contacts={{vk: '/', fb: '/', ig: '/'}}/>
                            <div className="layout__sidebar-copyright font-size-sm font-light-grey">
                                Все права защищены<br/>
                                "ЕГЭHACK"
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
