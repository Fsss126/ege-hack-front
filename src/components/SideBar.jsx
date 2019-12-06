import React from 'react';
import _ from 'lodash';
import { NavLink } from "react-router-dom";
import Contacts from "./common/Contacts";
import {ACCOUNT_ROLES} from "definitions/constants";

function Link({disabled, className, ...props}) {
    const onClick = React.useCallback((event) => {
        if (disabled) {
            event.preventDefault();
        }
    });
    return (
        <NavLink
            className={`layout__sidebar-menu-link ${disabled ? 'disabled' : ''} ${className || ''}`}
            activeClassName="active"
            onClick={onClick}
            {...props}/>
    );
}

export default class SideBar extends React.Component{
    onClick = (event) => {
        if (event.target === event.currentTarget
            || event.target.closest('.layout__sidebar-menu-link:not(.disabled)')
            || event.target.closest('.sidebar__close-btn'))
            this.props.onMenuClose();
    };

    render() {
        const {accountRoles} = this.props;
        let isAdmin, isModerator, isTeacher, isAssistent, isPupil;
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
            isAssistent = _.includes(accountRoles, ACCOUNT_ROLES.HELPER);
            isPupil = _.includes(accountRoles, ACCOUNT_ROLES.PUPIL);
        }
        if (accountRoles === null)
            return null;
        return (
            <div className="layout__sidebar" onClick={this.onClick}>
                <div className="layout__sidebar-bar">
                    <div className="container sidebar__nav-btn-container d-lg-none">
                        <div className="nav-btn sidebar__close-btn"><i className="icon-close"/></div>
                    </div>
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
                                {/*{isPupil && (*/}
                                    <React.Fragment>
                                        <div className="layout__sidebar-menu-section">
                                            <Link to="/courses/">Мои курсы</Link>
                                            <Link to="/homework/" disabled>
                                                <span>Домашняя работа</span>
                                                <span className="badge-soon"><span className="badge accent">Скоро</span></span>
                                            </Link>
                                        </div>
                                        <div className="layout__sidebar-menu-section">
                                            <Link to="/shop/">Магазин курсов</Link>
                                            <Link to="/teachers/">Преподаватели</Link>
                                        </div>
                                    </React.Fragment>
                                {/*)}*/}
                                {(isTeacher || isAssistent) && (
                                    <React.Fragment>
                                        <div className="layout__sidebar-menu-section">
                                            <Link to="/homework-assessment/" disabled>
                                                <span>Проверка работ</span>
                                                <span className="badge-soon"><span className="badge accent">Скоро</span></span>
                                            </Link>
                                            <Link to="/student-performance/" disabled>
                                                <span>Журнал успеваемости</span>
                                                <span className="badge-soon"><span className="badge accent">Скоро</span></span>
                                            </Link>
                                        </div>
                                    </React.Fragment>
                                )}
                                {(isAdmin || isModerator) && (
                                    <React.Fragment>
                                        <div className="layout__sidebar-menu-section">
                                            <Link to="/admin/subjects/" disabled>
                                                Предметы
                                            </Link>
                                            <Link to="/admin/courses" disabled>
                                                Курсы
                                            </Link>
                                            <Link to="/admin/users/" disabled>
                                                Пользователи
                                            </Link>
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                            <Contacts contacts={{vk: 'https://vk.com/egehack', ig: 'https://www.instagram.com/ege_hack_math/'}}/>
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
