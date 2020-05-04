import TabNav, {TabNavLink} from 'components/common/TabNav';
import {useCheckPermissions} from 'components/ConditionalRender';
import {
  useAdmins,
  useAssistants,
  useModerators,
  useTeachers,
} from 'hooks/selectors';
import React from 'react';
import {Redirect, Route, RouteComponentProps, Switch} from 'react-router-dom';
import {Permission} from 'types/enums';

import AdminsPage from './admins/AdminsPage';
import AssistantsPage from './assistants/AssistantsPage';
import ModeratorsPage from './moderators/ModeratorsPage';
import TeachersPage from './teachers/TeachersPage';

const Users: React.FC<RouteComponentProps> = (props) => {
  const {match} = props;
  const {
    teachers,
    error: errorLoadingTeachers,
    reload: reloadTeachers,
  } = useTeachers();
  const {
    assistants,
    error: errorLoadingAssistants,
    reload: reloadAssistants,
  } = useAssistants();
  const {admins, error: errorLoadingAdmins, reload: reloadAdmins} = useAdmins();
  const {
    moderators,
    error: errorLoadingModerators,
    reload: reloadModerators,
  } = useModerators();

  const isLoaded = !!(teachers && assistants && admins && moderators);

  const canEdit = useCheckPermissions(Permission.PARTICIPANT_MANAGEMENT);

  const header = !!(teachers && assistants && admins && moderators) && (
    <div className="layout__content-block tab-nav-container">
      <div className="title-with-menu">
        <h2>Пользователи</h2>
      </div>
      <TabNav>
        <TabNavLink to={`${match.url}/teachers/`}>
          Учителя <span className="badge">{teachers.length}</span>
        </TabNavLink>
        <TabNavLink to={`${match.url}/assistants/`}>
          Ассистенты <span className="badge">{assistants.length}</span>
        </TabNavLink>
        <TabNavLink to={`${match.url}/admins/`}>
          Администраторы <span className="badge">{admins.length}</span>
        </TabNavLink>
        <TabNavLink to={`${match.url}/moderators/`}>
          Модераторы <span className="badge">{moderators.length}</span>
        </TabNavLink>
      </TabNav>
    </div>
  );

  return (
    <Switch>
      <Route
        path={`${match.path}/admins`}
        render={(props) => (
          <AdminsPage
            accounts={admins ? admins : undefined}
            isLoaded={isLoaded}
            {...props}
          >
            {header}
          </AdminsPage>
        )}
      />
      <Route
        path={`${match.path}/moderators`}
        render={(props) => (
          <ModeratorsPage
            accounts={moderators ? moderators : undefined}
            isLoaded={isLoaded}
            {...props}
          >
            {header}
          </ModeratorsPage>
        )}
      />
      <Route
        path={`${match.path}/teachers`}
        render={(props) => (
          <TeachersPage
            accounts={teachers ? teachers : undefined}
            isLoaded={isLoaded}
            {...props}
          >
            {header}
          </TeachersPage>
        )}
      />
      <Route
        path={`${match.path}/assistants`}
        render={(props) => (
          <AssistantsPage
            accounts={assistants ? assistants : undefined}
            isLoaded={isLoaded}
            {...props}
          >
            {header}
          </AssistantsPage>
        )}
      />
      <Route render={() => <Redirect to={`${match.url}/teachers/`} />} />
    </Switch>
  );
};

export default Users;