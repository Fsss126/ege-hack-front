import React, {useCallback, useMemo} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import List from "./List";
import * as Input from "components/ui/input";

export const CatalogContext = React.createContext({});
CatalogContext.displayName = 'CatalogContext';

export function useFilterParams() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const subject = parseInt(params.get('subject')) || null;
    const online = params.get('online') === 'true';
    const search = params.get('search') || '';
    return useMemo(() => ({subject, online, search}), [subject, online, search]);
}

export function useFilterCallback() {
    const location = useLocation();
    const history = useHistory();
    return  React.useCallback((value, name) => {
        const params = new URLSearchParams(location.search);
        if (value)
            params.set(name, value);
        else
            params.delete(name);
        // setSubject(option);
        history.push({
            pathname: location.pathname,
            search: `?${params}`
        });
    }, [location, history]);
}

//TODO: add search input
const Filter = ({filterBy: {subject:filterBySubject = true, online:filterByOnline = true, search = false}={}, children}) => {
    const {options, subject, online, search: searchKey} = React.useContext(CatalogContext);
    const onChange = useFilterCallback();
    return (
        <div className="layout__content-block catalog__filters">
            <div className="container p-0">
                <div className="row align-items-center">
                    {filterBySubject && (
                        <div className="catalog__filter-container subject-select-container col-auto align-items-center">
                            <Input.Select
                                name="subject"
                                options={options}
                                value={subject}
                                placeholder='Предмет'
                                callback={onChange}/>
                        </div>
                    )}
                    {filterByOnline && (
                        <div className="catalog__filter-container online-checkbox-container col-auto align-items-center">
                            <Input.CheckBox
                                name="online"
                                value={online}
                                label="Онлайн"
                                onChange={onChange}/>
                        </div>
                    )}
                    {search && (
                        <div className="catalog__filter-container search-input-container col-auto align-items-center">
                            <div className="search-input">
                                <Input.Input
                                    name="search"
                                    placeholder="Поиск"
                                    autoComplete="off"
                                    value={searchKey}
                                    onChange={onChange}/>
                            </div>
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
};

const Catalog = ({renderItem: renderFunc, emptyPlaceholder, noMatchPlaceholder, baseUrl, ...listProps}) => {
    const {items, renderProps, totalItems} = React.useContext(CatalogContext);
    const renderItem = React.useCallback((item, renderProps) => {
        return renderFunc(item, {link: `${item.id}/`, ...renderProps});
    }, [renderFunc]);
    return (
        <div className="layout__content-block catalog__catalog">
            {items.length > 0 ? (
                <List
                    {...listProps}
                    renderProps={renderProps}
                    renderItem={renderItem}>
                    {items}
                </List>
            ) : (
                totalItems === 0 ? (
                    <div className="catalog__empty-catalog-fallback-message text-center font-size-sm">
                        {emptyPlaceholder}
                    </div>
                    ) : (
                    <div className="catalog__empty-catalog-fallback-message text-center font-size-sm">
                        {noMatchPlaceholder}
                    </div>
                    )
            )}
        </div>
    );
};

const Body = ({options, filter, items, children, renderProps={}}) => {
    const filterParams = useFilterParams();
    const matchingItems = useMemo(() =>
        items.filter(item => filter(item, filterParams)), [items, filter, filterParams]);
    const totalItems = items.length;
    const {subject, online, search} = filterParams;
    return (
        <CatalogContext.Provider
            value={{
                options, subject, online, search, items: matchingItems, totalItems, renderProps
            }}>
            <div className="catalog">
                {children}
            </div>
        </CatalogContext.Provider>
    );
};

export default {
    Filter,
    Catalog,
    Body,
    // Page: CatalogPage
};
