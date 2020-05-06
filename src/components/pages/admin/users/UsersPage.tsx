import TabNav, {TabNavBlock, TabNavLink} from 'components/common/TabNav';
import {useAccounts} from 'hooks/selectors';
import React from 'react';
import {Redirect, Route, RouteComponentProps, Switch} from 'react-router-dom';
import {AccountRole} from 'types/enums';

import AdminsPage from './admins/AdminsPage';
import AssistantsPage from './assistants/AssistantsPage';
import ModeratorsPage from './moderators/ModeratorsPage';
import TeachersPage from './teachers/TeachersPage';

const UsersPage: React.FC<RouteComponentProps> = (props) => {
  const {match} = props;
  const {
    accounts: teachers,
    error: errorLoadingTeachers,
    reload: reloadTeachers,
  } = useAccounts(AccountRole.TEACHER);
  const {
    accounts: assistants,
    error: errorLoadingAssistants,
    reload: reloadAssistants,
  } = useAccounts(AccountRole.HELPER);
  const {
    accounts: admins,
    error: errorLoadingAdmins,
    reload: reloadAdmins,
  } = useAccounts(AccountRole.ADMIN);
  const {
    accounts: moderators,
    error: errorLoadingModerators,
    reload: reloadModerators,
  } = useAccounts(AccountRole.MODERATOR);

  const isLoaded = !!(teachers && assistants && admins && moderators);

  const errors = [
    errorLoadingAdmins,
    errorLoadingModerators,
    errorLoadingTeachers,
    errorLoadingAssistants,
  ];

  const reloadCallbacks = [
    reloadAdmins,
    reloadModerators,
    reloadTeachers,
    reloadAssistants,
  ];

  const header = !!(teachers && assistants && admins && moderators) && (
    <TabNavBlock title="Пользователи">
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
    </TabNavBlock>
  );

  return (
    <Switch>
      <Route
        path={`${match.path}/admins`}
        render={(props) => (
          <AdminsPage
            accounts={admins ? admins : undefined}
            isLoaded={isLoaded}
            errors={errors}
            reloadCallbacks={reloadCallbacks}
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
            errors={errors}
            reloadCallbacks={reloadCallbacks}
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
            errors={errors}
            reloadCallbacks={reloadCallbacks}
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
            errors={errors}
            reloadCallbacks={reloadCallbacks}
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

export default UsersPage;
