import React from 'react';
import { NavLink } from "react-router-dom";

function Link(props) {
    return <NavLink className="layout__sidebar-menu-link" activeClassName="active" {...props}/>;
}

export default class SideBar extends React.Component{
    onClick = (event) => {
        if (event.target === event.currentTarget || event.target.classList.contains('layout__sidebar-menu-link'))
            this.props.onMenuClose();
    };

    render() {
        return (
            <div className="layout__sidebar" onClick={this.onClick}>
                <div className="layout__sidebar-bar">
                    <div className="layout__sidebar-menu">
                        <div className="layout__sidebar-menu-section">
                            <Link to="/courses">Мои курсы</Link>
                            <Link to="/homework">Домашняя работа</Link>
                        </div>
                        <div className="layout__sidebar-menu-section">
                            <Link to="/shop">Магазин курсов</Link>
                            <Link to="/teachers">Преподаватели</Link>
                            <Link to="/about">О нас</Link>
                        </div>
                    </div>
                    <div className="layout__sidebar-contacts font-light-grey">
                        <i className="fab fa-vk vk"/>
                        <i className="fab fa-facebook-f fb"/>
                        <i className="fab fa-instagram ig"/>
                    </div>
                    <div className="layout__sidebar-copyright font-size-sm font-light-grey">
                        Все права защищены<br/>
                        "ЕГЭHACK"
                    </div>
                </div>
            </div>
        );
    }
}
