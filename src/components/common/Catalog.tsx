import classNames from 'classnames';
import * as Input from 'components/ui/input';
import React, {useCallback, useMemo} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

import {ContentBlock} from '../layout/ContentBlock';
import {InputChangeHandler} from '../ui/input/Input';
import {OptionShape} from '../ui/input/Select';
import List, {ListItemRenderer, ListItemRenderProps, ListProps} from './List';

export type CatalogContextState = FilterParams & {
  options?: OptionShape<number>[];
  items: any[];
  totalItems: number;
};

export const CatalogContext = React.createContext<CatalogContextState>(
  undefined as any,
);
CatalogContext.displayName = 'CatalogContext';

export type FilterParams = {
  subject: number | null;
  online: boolean;
  search: string;
};

export function useFilterParams(): FilterParams {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const subject = parseInt(params.get('subject') || '') || null;
  const online = params.get('online') === 'true';
  const search = params.get('search') || '';

  return useMemo(() => ({subject, online, search}), [subject, online, search]);
}

export function useFilterCallback(): InputChangeHandler<any> {
  const location = useLocation();
  const history = useHistory();

  return useCallback(
    (value: any, name: string) => {
      const params = new URLSearchParams(location.search);

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // setSubject(option);
      history.push({
        pathname: location.pathname,
        search: `?${params}`,
      });
    },
    [location, history],
  );
}

export type FilterProps = {
  filterBy?: {
    subject: boolean;
    online: boolean;
    search: boolean;
  };
  children?: React.ReactNode;
  transparent?: boolean;
};
const Filter: React.FC<FilterProps> = (props) => {
  const {
    filterBy: {
      subject: filterBySubject = true,
      online: filterByOnline = true,
      search = false,
    } = {},
    transparent,
    children,
  } = props;
  const {options, subject, online, search: searchKey} = React.useContext(
    CatalogContext,
  );
  const onChange = useFilterCallback();

  return (
    <ContentBlock className="catalog__filters" transparent={transparent}>
      <div className="container p-0">
        <div className="row align-items-center">
          {filterBySubject && options && (
            <div className="catalog__filter-container subject-select-container col-auto align-items-center">
              <Input.Select
                withContainer={false}
                name="subject"
                options={options}
                value={subject}
                placeholder="Предмет"
                callback={onChange}
              />
            </div>
          )}
          {filterByOnline && (
            <div className="catalog__filter-container online-checkbox-container col-auto align-items-center">
              <Input.CheckBox
                name="online"
                value={online}
                label="Онлайн"
                onChange={onChange}
              />
            </div>
          )}
          {search && (
            <div className="catalog__filter-container search-input-container col-auto align-items-center">
              <div className="search-input">
                <Input.Input
                  withContainer={false}
                  name="search"
                  placeholder="Поиск"
                  autoComplete="off"
                  value={searchKey}
                  onChange={onChange}
                />
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </ContentBlock>
  );
};

type CatalogOwnRenderProps = {
  link: string;
};
export type CatalogItemRenderProps<P extends object = {}> = ListItemRenderProps<
  P & CatalogOwnRenderProps
>;

export type CatalogItemRenderer<T, P extends object = {}> = ListItemRenderer<
  T,
  P & CatalogOwnRenderProps
>;

export type CatalogProps<T extends object = any, P extends object = {}> = Omit<
  React.Defaultize<
    ListProps<T, P & CatalogOwnRenderProps>,
    typeof List.defaultProps
  >,
  'renderProps' | 'children'
> & {
  emptyPlaceholder: React.ReactNode;
  noMatchPlaceholder: React.ReactNode;
  renderProps?: P;
  title?: React.ReactNode;
  titleInside?: boolean;
  context?: React.Context<{items: T[]; totalItems: number}>;
  children?: T[];
  filter?: React.ReactNode;
};
const Catalog = <T extends object = any, P extends object = {}>(
  props: CatalogProps<T, P>,
): React.ReactElement => {
  const {
    renderItem: renderFunc,
    emptyPlaceholder,
    noMatchPlaceholder,
    renderProps,
    title,
    titleInside,
    context,
    children,
    filter,
    ...listProps
  } = props;
  const contextState = React.useContext(
    context ||
      ((CatalogContext as unknown) as React.Context<{
        items: T[];
        totalItems: number;
      }>),
  );

  let items, totalItems;

  if (children) {
    items = children;
    totalItems = children.length;
  } else {
    ({items, totalItems} = contextState);
  }
  const renderItem = React.useCallback(
    (item, renderProps, index) => {
      return renderFunc(item, {link: `${item.id}/`, ...renderProps}, index);
    },
    [renderFunc],
  );

  const isEmpty = items.length === 0;

  return (
    <ContentBlock
      title={title}
      outerContent={filter}
      titleInside={titleInside}
      className={classNames('catalog__catalog', {
        'catalog__catalog--empty': isEmpty,
      })}
    >
      {!isEmpty ? (
        <List {...listProps} renderProps={renderProps} renderItem={renderItem}>
          {items}
        </List>
      ) : totalItems === 0 ? (
        <div className="catalog__empty-catalog-fallback-message text-center font-size-sm">
          {emptyPlaceholder}
        </div>
      ) : (
        <div className="catalog__empty-catalog-fallback-message text-center font-size-sm">
          {noMatchPlaceholder}
        </div>
      )}
    </ContentBlock>
  );
};

export type FilterFunc<T> = (item: T, filterParams: FilterParams) => boolean;

export type CatalogBodyProps<T extends object = any> = {
  options?: OptionShape<number>[];
  items: T[];
  children?: React.ReactNode;
  filter: FilterFunc<T>;
};
const Body = <T extends object = any>(
  props: CatalogBodyProps<T>,
): React.ReactElement => {
  const {options, filter, items, children} = props;
  const filterParams = useFilterParams();
  const matchingItems = useMemo(
    () => items.filter((item) => filter(item, filterParams)),
    [items, filter, filterParams],
  );
  const totalItems = items.length;
  const {subject, online, search} = filterParams;

  return (
    <CatalogContext.Provider
      value={{
        options,
        subject,
        online,
        search,
        items: matchingItems,
        totalItems,
      }}
    >
      <div className="catalog">{children}</div>
    </CatalogContext.Provider>
  );
};

export default {
  Filter,
  Catalog,
  Body,
  // Page: CatalogPage
};
