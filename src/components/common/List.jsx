import React from 'react';
import ListItem from "./ListItem";

export default class List extends React.Component {
    static defaultProps = {
      renderItem: (item, index) => <ListItem {...item} key={index}/>
    };

    render() {
        const {children, renderItem, className} = this.props;
        return (
            <div className={`${className || ''} list`}>
                {children.map((item, index) => renderItem(item, index))}
            </div>
        )
    }
}
