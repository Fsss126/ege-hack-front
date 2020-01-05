import React from 'react';
import logo from 'img/logo.svg';
import Auth from 'definitions/auth';
import {Link} from 'react-router-dom';
import CoverImage from "./common/CoverImage";

const Header = (props) => {
    const {onMenuButtonClick, user, userInfo, sidebar, showUserNav} = props;
    return (
        <header>
            <div className="container-fluid header__container">
                <div className="row">
                    {sidebar && (
                        <div className="col-auto d-lg-none">
                            <div className="nav-btn" onClick={onMenuButtonClick}>
                                <i className="icon-bars"/>
                            </div>
                        </div>
                    )}
                    <div className="col d-flex justify-content-center justify-content-lg-start p-0">
                        <div className="logo-container container d-flex align-items-center justify-content-center m-0">
                            <img src={logo} className="logo" alt="Logo"/>
                        </div>
                    </div>
                    <div className="col-auto d-flex">
                        <div className="user-nav">
                            {showUserNav && (
                                user !== null ? (
                                    <React.Fragment>
                                        <div className={`user-nav__info d-flex align-items-center ${user ? '' : 'ph-item'}`}>
                                            {user ? (
                                                <div className="user-nav__user-name">{user.user.first_name} {user.user.last_name}</div>
                                            ) : (
                                                <div className="user-nav__user-name ph-text"/>
                                            )}
                                            {userInfo ? (
                                                <div className="nav-btn">
                                                    {userInfo.vk_info.photo_max ?
                                                        <CoverImage src={userInfo.vk_info.photo_max} round square/>
                                                        : <i className="icon-profile"/>}
                                                </div>
                                            ) : (
                                                <div className="nav-btn">
                                                    <CoverImage placeholder round square/>
                                                </div>
                                            )}
                                        </div>
                                        <div className="user-nav__menu-container">
                                            <div className="user-nav__menu">
                                                <div className="user-nav__menu-options">
                                                    <Link to="/account/" className="menu-option">
                                                        <i className="icon-profile"/>Аккаунт
                                                    </Link>
                                                    <Link to="/account/settings/" className="menu-option">
                                                        <i className="icon-settings"/>Настройки
                                                    </Link>
                                                    <div
                                                        className="menu-option"
                                                        tabIndex={2}
                                                        onClick={Auth.logout}>
                                                        <i className="icon-logout"/>Выход
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <div className="nav-btn">
                                            <i className="icon-profile"/>
                                        </div>
                                        <div className="user-nav__menu-container">
                                            <div className="user-nav__menu">
                                                <div className="user-nav__menu-options">
                                                    <Link to="/login/" className="menu-option">
                                                        <i className="icon-login"/>Войти
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
