import React from 'react';
import classnames from 'classnames';
import ListItem from "./ListItem";

export default function List(props) {
    const {children, renderItem, renderProps = {}, flex, className, alignment, plain} = props;
    const content = children.map((item, index) => renderItem(item, {...renderProps, plain}, index));
    return flex
        ? (
            <div className={classnames('list', className)}>
                <div className="container p-0 overflow-hidden">
                    <div className={classnames('row', alignment)}>
                        {content}
                    </div>
                </div>
            </div>
        )
        : (
        <div className={classnames('list', className)}>
            {content}
        </div>
    );
}

List.defaultProps = {
    renderItem: (item, props, index) => <ListItem {...item} {...props} key={index}/>,
    plain: false
};
