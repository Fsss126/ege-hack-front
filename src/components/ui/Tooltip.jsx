import React, { Component, Fragment } from 'react';

class Tooltip extends Component {
    componentDidMount() {
    }

    render() {
        let child = React.Children.only(this.props.children);
        let position = 'pos-' + this.props.position;
        return React.cloneElement(child, {
            className: (child.props.className ? child.props.className + ' tooltip ' : 'tooltip ') + position,
            children: (
                <Fragment>
                    {child.props.children}
                    <div className="tooltip-arrow"/>
                    <div className="tooltip-block">
                        {
                            this.props.content
                        }
                    </div>
                </Fragment>
            )
        });
    }
}

export default Tooltip;
