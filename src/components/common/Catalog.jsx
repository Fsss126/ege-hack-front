import React from 'react';
import CatalogItem from "./CatalogItem";

export default class Catalog extends React.Component {
    static defaultProps = {
      renderItem: (item, index) => <CatalogItem {...item} key={index}/>
    };

    render() {
        const {children, renderItem} = this.props;
        return (
            <div className="catalog">
                {children.map((item, index) => renderItem(item, index))}
            </div>
        )
    }
}
