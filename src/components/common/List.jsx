import React from 'react';
import ListItem from "./ListItem";

export default function List(props) {
    const {children, renderItem, renderProps, flex, className, alignment, adaptive} = props;
    return flex
        ? (
            <div className={`${className || ''} list`}>
                <div className="container p-0 overflow-hidden">
                    <div className={`row ${alignment || ''}`}>
                        {children.map((item, index) => renderItem(item, {...renderProps, adaptive}, index))}
                    </div>
                </div>
            </div>
        )
        : (
        <div className={`${className || ''} list`}>
            {children.map((item, index) => renderItem(item, renderProps, index))}
        </div>
    );
}

List.defaultProps = {
    renderItem: (item, props, index) => <ListItem {...item} {...props} key={index}/>
};
