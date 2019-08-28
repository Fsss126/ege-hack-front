import React from 'react';
import logo from '../img/logo.svg';

export default class Header extends React.Component {
    render() {
        return (
            <header>
                <div className="container-fluid header__container">
                    <div className="row">
                        <div className="col-auto d-lg-none">
                            <div className="nav-button" onClick={this.props.onMenuButtonClick}>
                                <i className="icon-bars"/>
                            </div>
                        </div>
                        <div className="col d-flex justify-content-center justify-content-lg-start p-0">
                            <div className="logo-container container d-flex align-items-center justify-content-center m-0">
                                <img src={logo} className="logo" alt="Logo"/>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="user-nav">
                                <div className="user-nav__user-name">Вася Пупкин</div>
                                <div className="nav-button">
                                    <i className="icon-profile"/>
                                </div>
                                <div className="nav-button d-none d-lg-block">
                                    <i className="icon-logout"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}
