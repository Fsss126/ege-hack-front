import React from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import List from "./List";
import Input from "../ui/Input";
import Page from "../Page";

export const CatalogContext = React.createContext({});

const Filter = ({filterBy: {subject:filterBySubject = true, online:filterByOnline = true}={}}) => {
    const {options, subject, online, onChange} = React.useContext(CatalogContext);
    return (
        <div className="layout__content-block catalog__filters">
            <div className="container p-0">
                <div className="row">
                    {filterBySubject && (
                        <div className="col-auto d-flex align-items-center">
                            <Input.Select
                                name="subject"
                                options={options}
                                value={subject}
                                selectProps={selectProps}
                                callback={onChange}/>
                        </div>
                    )}
                    {filterByOnline && (
                        <div className="col-auto d-flex align-items-center">
                            <Input.CheckBox
                                name="online"
                                value={online}
                                label="Онлайн"
                                onChange={onChange}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Catalog = ({renderFunc, placeholder, baseUrl, ...listProps}) => {
    const {items} = React.useContext(CatalogContext);
    const renderItem = React.useCallback((item) => {
        return renderFunc(item, {link: `${item.id}/`});
    }, [renderFunc]);
    return (
        <div className="layout__content-block catalog__catalog">
            {items.length > 0 ? (
                <List {...listProps}
                    renderItem={renderItem}>
                    {items}
                </List>
            ) : (
                <div className="catalog__empty-catalog-fallback-message text-center font-size-sm">
                    {placeholder}
                </div>
            )}
        </div>
    );
};

const selectProps = {isClearable: true, placeholder: 'Предмет'};

const Body = (props) => {
    const {options, filterItems, children} = props;
    const history = useHistory();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const subject = params.get('subject') || null;
    const online = params.get('online') === 'true';
    const onFilterChange = React.useCallback((value, name) => {
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
    const matchingItems = filterItems(subject, online);

    return (
        <CatalogContext.Provider
            value={{
                options, subject, online, onChange: onFilterChange, items: matchingItems
            }}>
            <div className="catalog">
                {children}
            </div>
        </CatalogContext.Provider>
    );
};

const CatalogPage = ({title, className, BodyComponent = Body, ...props}) => {
    return (
        <Page title={title} className={className}>
            <BodyComponent {...props}/>
        </Page>
    )
};

export default {
    Filter,
    Catalog,
    Body,
    Page: CatalogPage
};
