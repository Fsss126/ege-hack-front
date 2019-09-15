import React from 'react';
import ListItem from "./ListItem";

export default function List(props) {
    const {children, renderItem, renderProps, className} = props;
    return (
        <div className={`${className || ''} list`}>
            {children.map((item, index) => renderItem(item, renderProps, index))}
        </div>
    );
}

List.defaultProps = {
    renderItem: (item, props, index) => <ListItem {...item} {...props} key={index}/>
};
