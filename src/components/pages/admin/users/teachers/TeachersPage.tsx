import {Account} from 'components/common/Account';
import AccountCatalog from 'components/common/AccountCatalog';
import {CatalogItemRenderer} from 'components/common/Catalog';
import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from 'components/common/DropdownMenu';
import {useCheckPermissions} from 'components/ConditionalRender';
import Page, {PageContent, PageParentSection} from 'components/layout/Page';
import Button from 'components/ui/Button';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {Link} from 'react-router-dom';
import {AccountInfo} from 'types/entities';
import {Permission} from 'types/enums';

type ModeratorsPageProps = RouteComponentProps & {
  parentSection?: PageParentSection;
  accounts?: AccountInfo[];
  isLoaded: boolean;
  children: React.ReactNode;
};
const TeachersPage: React.FC<ModeratorsPageProps> = (props) => {
  const {
    match,
    location,
    accounts,
    isLoaded,
    children: header,
    parentSection,
  } = props;

  const canEdit = useCheckPermissions(Permission.ACCOUNT_MANAGEMENT);

  const renderAccount: CatalogItemRenderer<AccountInfo> = useCallback(
    (account, {link, ...renderProps}) => {
      const action = canEdit ? (
        <DropdownMenu
          content={<DropdownIconButton className="icon-ellipsis" />}
        >
          <DropdownMenuOption>
            <i className="icon-close" />
            Удалить
          </DropdownMenuOption>
        </DropdownMenu>
      ) : undefined;

      return (
        <Account
          key={account.id}
          account={account}
          selectable
          noOnClickOnAction
          action={action}
          {...renderProps}
        />
      );
    },
    [canEdit],
  );
  const title = `Преподаватели`;

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.ACCOUNT_MANAGEMENT}
      className="admin-page admin-page--teachers"
      title={title}
      location={location}
    >
      {isLoaded && accounts && (
        <AccountCatalog.Body accounts={accounts}>
          <PageContent parentSection={parentSection}>
            {header}
            {canEdit && (
              <div className="layout__content-block layout__content-block--stacked d-flex">
                <Button
                  neutral
                  component={Link}
                  to={`${match.url}edit/`}
                  after={<i className="icon-add" />}
                >
                  Добавить преподавателей
                </Button>
              </div>
            )}
            <AccountCatalog.Filter />
            <AccountCatalog.Catalog
              className="users-list"
              emptyPlaceholder="Нет преподавателей"
              noMatchPlaceholder="Нет совпадающих преподавателей"
              plain
              renderAccount={renderAccount}
            />
          </PageContent>
        </AccountCatalog.Body>
      )}
    </Page>
  );
};

export default TeachersPage;
