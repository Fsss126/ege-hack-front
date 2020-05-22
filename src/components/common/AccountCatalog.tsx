import React from 'react';
import {BasicAccountInfo} from 'types/entities';

import Catalog, {
  CatalogBodyProps,
  CatalogProps,
  FilterFunc,
  FilterProps,
} from './Catalog';

const filterBy = {
  search: true,
  subject: false,
  online: false,
};

const Filter = (props: FilterProps): React.ReactElement => {
  return <Catalog.Filter filterBy={filterBy} {...props} />;
};

export type AccountCatalogProps<
  T extends BasicAccountInfo = BasicAccountInfo,
  P extends object = {}
> = Omit<CatalogProps<T, P>, 'renderItem'> & {
  renderAccount: CatalogProps<T, P>['renderItem'];
};
const AccountCatalog = <
  T extends BasicAccountInfo = BasicAccountInfo,
  P extends object = {}
>(
  props: AccountCatalogProps<T, P>,
): React.ReactElement => {
  const {renderAccount, ...otherProps} = props;

  return <Catalog.Catalog renderItem={renderAccount} {...otherProps} />;
};

const filter: FilterFunc<BasicAccountInfo> = (
  {vk_info: {full_name}},
  {search},
) => {
  const userName = full_name.toLowerCase().replace(/\s/g, '');
  const searchKey = search.toLowerCase().replace(/\s/g, '');

  return search ? userName.includes(searchKey) : true;
};

export type CourseBodyProps<
  T extends BasicAccountInfo = BasicAccountInfo
> = Optionalize<Omit<CatalogBodyProps<T>, 'items'>, 'options' | 'filter'> & {
  accounts: BasicAccountInfo[];
};
const Body = (props: CourseBodyProps): React.ReactElement => {
  const {accounts, ...otherProps} = props;

  return <Catalog.Body items={accounts} filter={filter} {...otherProps} />;
};

export default {
  Filter,
  Catalog: AccountCatalog,
  Body,
};
