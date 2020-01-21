import React, { Component } from 'react';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

export const APPEAR_ANIMATION = {
    SCALE: 'scale',
    BOTTOM: 'bottom-up',
    FADE: 'fade',
    NONE: null
};

class Popup extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        className: PropTypes.string,
        opened: PropTypes.bool,
        close: PropTypes.func,
        preventClose: PropTypes.bool,
        closeOnBackgroundClick: PropTypes.bool,
        appearAnimation: PropTypes.string,
        onClose: PropTypes.func,
        detectClose: PropTypes.func
    };

    static defaultProps = {
        closeOnBackgroundClick: true,
        preventClose: false,
        appearAnimation: APPEAR_ANIMATION.FADE
    };

    constructor(props) {
        super(props);
        this.state = {
            opened: false
        };
    }

    open = () => {
        this.setState({opened: true});
    };

    isOpened = () => this.state.opened;

    close = (event) => {
        let close = this.props.detectClose
            ? this.props.detectClose(event)
            : !(event && !event.target.matches('.popup') && !event.target.matches('.close-button'));
        if (this.props.preventClose || !close)
            return;
        this.props.close ? this.props.close(event) : this.setState({opened: false});
        if (this.props.onClose) this.props.onClose();
    };

    render() {
        const opened = this.props.opened ? this.props.opened : this.state.opened;
        const {appearAnimation, className, closeOnBackgroundClick, children} = this.props;
        const markup = (
            <CSSTransition
                in={opened}
                classNames={{
                    enter: '',
                    enterActive: 'is-visible',
                    enterDone: 'is-visible',
                    appear: '',
                    appearActive: 'is-visible',
                    appearDone: 'is-visible',
                    exit: '',
                }}
                appear
                timeout={300}
                unmountOnExit mountOnEnter>
                <div
                    className={classnames('popup', {
                        'animation': appearAnimation
                    }, appearAnimation, className)}
                    onClick={closeOnBackgroundClick ? this.close : null}>
                    <div className="popup__container">
                        {children}
                    </div>
                </div>
            </CSSTransition>
        );
        return ReactDOM.createPortal(
            markup,
            document.getElementById('modalRoot')
        );
    }
}

export default Popup;
