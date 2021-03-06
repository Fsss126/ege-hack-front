import Auth from 'definitions/auth';
import logo from 'img/logo.svg';
import React from 'react';
import {Link} from 'react-router-dom';
import {AccountInfo, Credentials} from 'types/entities';
import {AccountRole} from 'types/enums';
import {SimpleCallback} from 'types/utility/common';

import CoverImage from '../common/CoverImage';
import DropdownMenu, {DropdownMenuOption} from '../common/DropdownMenu';
import ConditionalRenderer from '../ConditionalRender';

export type HeaderProps = {
  onMenuButtonClick: SimpleCallback;
  user: Credentials | null;
  userInfo?: AccountInfo;
  sidebar: boolean;
  showUserNav: boolean;
};
const Header: React.FC<HeaderProps> = (props) => {
  const {onMenuButtonClick, user, userInfo, sidebar, showUserNav} = props;

  return (
    <header>
      <div className="container-fluid header__container">
        <div className="row">
          {sidebar && (
            <div className="col-auto d-lg-none">
              <div className="nav-btn" onClick={onMenuButtonClick}>
                <i className="icon-bars" />
              </div>
            </div>
          )}
          <div className="col d-flex justify-content-center justify-content-lg-start p-0">
            <div className="logo-container container d-flex align-items-center justify-content-center m-0">
              <img src={logo} className="logo" alt="Logo" />
            </div>
          </div>
          <div className="col-auto d-flex">
            {showUserNav && (
              <DropdownMenu
                className="user-nav"
                content={
                  user !== null ? (
                    <div
                      className={`user-nav__info d-flex align-items-center ${
                        userInfo ? '' : 'ph-item'
                      }`}
                    >
                      {userInfo ? (
                        <div className="user-nav__user-name">
                          {userInfo.vk_info.first_name}{' '}
                          {userInfo.vk_info.last_name}
                        </div>
                      ) : (
                        <div className="user-nav__user-name ph-text" />
                      )}
                      {userInfo ? (
                        <div className="nav-btn">
                          {userInfo.vk_info.photo ? (
                            <CoverImage
                              src={userInfo.vk_info.photo}
                              round
                              square
                            />
                          ) : (
                            <i className="icon-profile" />
                          )}
                        </div>
                      ) : (
                        <div className="nav-btn">
                          <CoverImage placeholder round square />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="nav-btn">
                      <i className="icon-profile" />
                    </div>
                  )
                }
              >
                {user !== null ? (
                  <div className="user-nav__menu-options">
                    <DropdownMenuOption<typeof Link>
                      component={Link}
                      to="/account/"
                    >
                      <i className="icon-profile" />
                      Аккаунт
                    </DropdownMenuOption>
                    <ConditionalRenderer
                      requiredRoles={[AccountRole.PUPIL, AccountRole.TEACHER]}
                    >
                      <DropdownMenuOption<typeof Link>
                        component={Link}
                        to="/account/settings/"
                      >
                        <i className="icon-settings" />
                        Настройки
                      </DropdownMenuOption>
                    </ConditionalRenderer>
                    <DropdownMenuOption tabIndex={2} onClick={Auth.logout}>
                      <i className="icon-logout" />
                      Выход
                    </DropdownMenuOption>
                  </div>
                ) : (
                  <div className="user-nav__menu-options">
                    <DropdownMenuOption<typeof Link>
                      component={Link}
                      to="/login/"
                    >
                      <i className="icon-login" />
                      Войти
                    </DropdownMenuOption>
                  </div>
                )}
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
