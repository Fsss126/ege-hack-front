import React from 'react';
import Contacts from "./common/Contacts";
import {ADMIN_ROLES, TEACHER_ROLES} from "definitions/constants";
import {NavLink} from "./ui/Link";
import ConditionalRenderer from "./ConditionalRender";

export default class SideBar extends React.Component{
    onClick = (event) => {
        if (event.target === event.currentTarget
            || event.target.closest('.layout__sidebar-menu-link:not(.disabled)')
            || event.target.closest('.sidebar__close-btn'))
            this.props.onMenuClose();
    };

    render() {
        const {accountRoles} = this.props;
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
                                            <NavLink className="layout__sidebar-menu-link" to="/courses/">Мои курсы</NavLink>
                                            <NavLink className="layout__sidebar-menu-link" to="/homework/" disabled>
                                                <span>Домашняя работа</span>
                                                {' '}
                                                <span className="badge accent">Скоро</span>
                                            </NavLink>
                                        </div>
                                        <div className="layout__sidebar-menu-section">
                                            <NavLink className="layout__sidebar-menu-link" to="/shop/">Магазин курсов</NavLink>
                                            <NavLink className="layout__sidebar-menu-link" to="/teachers/">Преподаватели</NavLink>
                                        </div>
                                    </React.Fragment>
                                {/*)}*/}
                                <ConditionalRenderer
                                    requiredRoles={TEACHER_ROLES}
                                    fullMatch={false}>
                                    <div className="layout__sidebar-menu-section">
                                        <NavLink className="layout__sidebar-menu-link" to="/teaching/">
                                            <span>Проверка работ</span>
                                        </NavLink>
                                        <NavLink className="layout__sidebar-menu-link" to="/student-performance/" disabled>
                                            <span>Журнал успеваемости</span>
                                            {' '}
                                            <span className="badge accent">Скоро</span>
                                        </NavLink>
                                    </div>
                                </ConditionalRenderer>
                                <ConditionalRenderer
                                    requiredRoles={ADMIN_ROLES}
                                    fullMatch={false}>
                                    <div className="layout__sidebar-menu-section">
                                        <NavLink className="layout__sidebar-menu-link" to="/admin/">
                                            Управление контентом
                                        </NavLink>
                                        <NavLink className="layout__sidebar-menu-link" to="/admin/users/" disabled>
                                            Пользователи
                                        </NavLink>
                                    </div>
                                </ConditionalRenderer>
                            </div>
                            <div className="layout__sidebar-footer">
                                <Contacts contacts={{vk: 'https://vk.com/egehack', ig: 'https://www.instagram.com/ege_hack_math/'}}/>
                                <div className="layout__sidebar-copyright font-size-sm font-light-grey">
                                    Все права защищены<br/>
                                    "ЕГЭHACK"
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
