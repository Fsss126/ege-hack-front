import React from 'react';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import {SimpleCallback} from "types/utility/common";

export enum PopupAnimation {
    SCALE = 'scale',
    BOTTOM = 'bottom-up',
    FADE = 'fade',
    NONE = 'none'
}

export type PopupProps = {
    children: React.ReactNode;
    className?: string;
    preventClose?: boolean;
    closeOnBackgroundClick: boolean;
    appearAnimation: PopupAnimation;
    detectClose?: (event: React.MouseEvent<HTMLDivElement>) => boolean;
} & ({
    opened: boolean;
    close?: (event: React.MouseEvent<HTMLDivElement>) => void;
} | {
    onClose: SimpleCallback;
});

type PopupState = {
    opened: boolean;
}

class Popup extends React.Component<PopupProps, PopupState> {
    static defaultProps = {
        closeOnBackgroundClick: true,
        preventClose: false,
        appearAnimation: PopupAnimation.FADE
    };

    constructor(props: PopupProps) {
        super(props);
        this.state = {
            opened: false
        };
    }

    open = (): void => {
        this.setState({opened: true});
    };

    isOpened = (): boolean => this.state.opened;

    close = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (!(event.target instanceof Element))
            return;
        const close = this.props.detectClose
            ? this.props.detectClose(event)
            : !(event && !event.target.matches('.popup') && !event.target.matches('.close-button'));
        if (this.props.preventClose || !close)
            return;
        if ('opened' in this.props) {
            this.props.close ? this.props.close(event) : this.setState({opened: false});
        } else {
            if (this.props.onClose) this.props.onClose();
        }
    };

    render(): React.ReactPortal {
        const opened = 'opened' in this.props && this.props.opened ? this.props.opened : this.state.opened;
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
                    onClick={closeOnBackgroundClick ? this.close : undefined}>
                    <div className="popup__container">
                        {children}
                    </div>
                </div>
            </CSSTransition>
        );
        return ReactDOM.createPortal(
            markup,
            document.getElementById('modalRoot') as HTMLElement
        );
    }
}

export default Popup;
