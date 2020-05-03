import {ADMIN_ROLES, TEACHER_ROLES} from 'definitions/constants';
import React, {useCallback} from 'react';
import {AccountRole} from 'types/enums';
import {SimpleCallback} from 'types/utility/common';

import Contacts from '../common/Contacts';
import ConditionalRenderer from '../ConditionalRender';
import {NavLink} from '../ui/Link';

export type SideBarProps = {
  accountRoles?: AccountRole[] | null;
  onMenuClose: SimpleCallback;
};
const SideBar: React.FC<SideBarProps> = (props) => {
  const {accountRoles, onMenuClose} = props;
  const onClick = useCallback(
    (event) => {
      if (
        event.target === event.currentTarget ||
        event.target.closest('.layout__sidebar-menu-link:not(.disabled)') ||
        event.target.closest('.sidebar__close-btn')
      ) {
        onMenuClose();
      }
    },
    [onMenuClose],
  );

  return (
    <div className="layout__sidebar" onClick={onClick}>
      <div className="layout__sidebar-bar">
        <div className="container sidebar__nav-btn-container d-lg-none">
          <div className="nav-btn sidebar__close-btn">
            <i className="icon-close" />
          </div>
        </div>
        {accountRoles === undefined ? (
          <div className="layout__sidebar-content">
            <div className="layout__sidebar-menu ph-item">
              <div className="layout__sidebar-menu-section">
                <div className="layout__sidebar-menu-col">
                  <div className="layout__sidebar-menu-link">
                    <div className="ph-text" />
                  </div>
                  <div className="layout__sidebar-menu-link">
                    <div className="ph-text" />
                  </div>
                  <div className="layout__sidebar-menu-link">
                    <div className="ph-text" />
                  </div>
                  <div className="layout__sidebar-menu-link">
                    <div className="ph-text" />
                  </div>
                  <div className="layout__sidebar-menu-link">
                    <div className="ph-text" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="layout__sidebar-content">
            <div className="layout__sidebar-menu">
              {/*{isPupil && (*/}
              <React.Fragment>
                <div className="layout__sidebar-menu-section d-flex">
                  <div className="layout__sidebar-menu-col">
                    <i className="prefix-icon m-lg icon-academic" />
                  </div>
                  <div className="layout__sidebar-menu-col">
                    <NavLink
                      className="layout__sidebar-menu-link"
                      to="/courses/"
                    >
                      Мои курсы
                    </NavLink>
                    <NavLink
                      className="layout__sidebar-menu-link"
                      to="/homework/"
                      disabled
                    >
                      <span>Домашняя работа</span>{' '}
                      <span className="badge accent">Скоро</span>
                    </NavLink>
                    <NavLink className="layout__sidebar-menu-link" to="/shop/">
                      Магазин курсов
                    </NavLink>
                    <NavLink
                      className="layout__sidebar-menu-link"
                      to="/teachers/"
                    >
                      Преподаватели
                    </NavLink>
                  </div>
                </div>
              </React.Fragment>
              {/*)}*/}
              <ConditionalRenderer
                requiredRoles={TEACHER_ROLES}
                fullMatch={false}
              >
                <div className="layout__sidebar-menu-section">
                  <div className="layout__sidebar-menu-col">
                    <i className="prefix-icon m-lg icon-book-open" />
                  </div>
                  <div className="layout__sidebar-menu-col">
                    <NavLink
                      className="layout__sidebar-menu-link"
                      to="/teaching/"
                    >
                      <span>Проверка работ</span>
                    </NavLink>
                    <NavLink
                      className="layout__sidebar-menu-link"
                      to="/student-performance/"
                      disabled
                    >
                      <span>Журнал успеваемости</span>{' '}
                      <span className="badge accent">Скоро</span>
                    </NavLink>
                  </div>
                </div>
              </ConditionalRenderer>
              <ConditionalRenderer
                requiredRoles={ADMIN_ROLES}
                fullMatch={false}
              >
                <div className="layout__sidebar-menu-section">
                  <div className="layout__sidebar-menu-col">
                    <i className="prefix-icon m-lg icon-edit" />
                  </div>
                  <div className="layout__sidebar-menu-col">
                    <NavLink
                      className="layout__sidebar-menu-link"
                      to="/admin/courses/"
                    >
                      Курсы
                    </NavLink>
                    <NavLink
                      className="layout__sidebar-menu-link"
                      to="/admin/subjects/"
                    >
                      Предметы
                    </NavLink>
                    <NavLink
                      className="layout__sidebar-menu-link"
                      to="/admin/knowledge/"
                    >
                      База знаний
                    </NavLink>
                    <NavLink
                      className="layout__sidebar-menu-link"
                      to="/admin/users/"
                      disabled
                    >
                      Пользователи
                    </NavLink>
                  </div>
                </div>
              </ConditionalRenderer>
            </div>
            <div className="layout__sidebar-footer">
              <Contacts
                contacts={{
                  vk: 'https://vk.com/egehack',
                  ig: 'https://www.instagram.com/ege_hack_math/',
                }}
              />
              <div className="layout__sidebar-copyright font-size-sm font-light-grey">
                Все права защищены
                <br />
                &quot;ЕГЭHACK&quot;
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
