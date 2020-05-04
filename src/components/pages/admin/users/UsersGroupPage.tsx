import {Account} from 'components/common/Account';
import AccountCatalog from 'components/common/AccountCatalog';
import {CatalogItemRenderer} from 'components/common/Catalog';
import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from 'components/common/DropdownMenu';
import {useCheckPermissions} from 'components/ConditionalRender';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import Button from 'components/ui/Button';
import {useDeleteAccount} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {Link} from 'react-router-dom';
import {AccountInfo} from 'types/entities';
import {AccountRole, Permission} from 'types/enums';

type UsersGroupPageProps = RouteComponentProps & {
  role: AccountRole;
  accounts?: AccountInfo[];
  isLoaded: boolean;
  children: React.ReactNode;
  addButtonText: string;
  emptyPlaceholder: string;
  noMatchPlaceholder: string;
};
const UsersGroupPage: React.FC<UsersGroupPageProps> = (props) => {
  const {
    match,
    location,
    accounts,
    isLoaded,
    children: header,
    addButtonText,
    emptyPlaceholder,
    noMatchPlaceholder,
    role,
  } = props;

  const canEdit = useCheckPermissions(Permission.ACCOUNT_MANAGEMENT);

  const onDelete = useDeleteAccount(role);

  const renderAccount: CatalogItemRenderer<AccountInfo> = useCallback(
    (account, {link, ...renderProps}) => {
      const {id} = account;

      const deleteCallback = (): void => {
        onDelete(id);
      };

      const action = canEdit ? (
        <DropdownMenu
          content={<DropdownIconButton className="icon-ellipsis" />}
        >
          <DropdownMenuOption onClick={deleteCallback}>
            <i className="icon-close" />
            Удалить
          </DropdownMenuOption>
        </DropdownMenu>
      ) : undefined;

      return (
        <Account
          key={id}
          account={account}
          selectable
          noOnClickOnAction
          action={action}
          {...renderProps}
        />
      );
    },
    [canEdit, onDelete],
  );
  const title = `Администраторы`;

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.ACCOUNT_MANAGEMENT}
      className="admin-page admin-page--admins"
      title={title}
      location={location}
    >
      {isLoaded && accounts && (
        <AccountCatalog.Body accounts={accounts}>
          <PageContent>
            {header}
            {canEdit && (
              <ContentBlock stacked className="d-flex">
                <Button
                  neutral
                  component={Link}
                  to={`${match.url}edit/`}
                  after={<i className="icon-add" />}
                >
                  {addButtonText}
                </Button>
              </ContentBlock>
            )}
            <AccountCatalog.Filter />
            <AccountCatalog.Catalog
              className="users-list"
              emptyPlaceholder={emptyPlaceholder}
              noMatchPlaceholder={noMatchPlaceholder}
              plain
              renderAccount={renderAccount}
            />
          </PageContent>
        </AccountCatalog.Body>
      )}
    </Page>
  );
};

export default UsersGroupPage;
