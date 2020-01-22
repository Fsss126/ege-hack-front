import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import Popup, { APPEAR_ANIMATION } from './Popup';
import PropTypes from 'prop-types';
import Button from "./Button";
import {Link} from "react-router-dom";

class ActionButton extends Component {
    onClick = () => {
        this.props.action && this.props.action();
        this.props.callback();
    };

    render() {
        let {text, accent, url} = this.props;
        return (
            <Button
                tag={url ? Link : undefined}
                to={url}
                className={accent ? 'action accent' : 'action'}
                onClick={this.onClick}>
                {text}
            </Button>
        );
    }

    static propTypes = {
        action: PropTypes.func,
        text: PropTypes.string.isRequired,
        callback: PropTypes.func,
        accent: PropTypes.bool
    };
}

class MessagePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            message: null
        };
    }

    showMessage = (message) => {
        this.setState({opened: true, message});
    };

    close = () => {
        this.setState({opened: false});
    };

    render() {
        const {opened, message} = this.state;
        return (
            <Popup
                className={classnames('message-popup', {
                    'error-popup': message && message.error,
                    'large': message && message.message.length > 60
                })}
                opened={opened}
                closeOnBackgroundClick={false}
                appearAnimation={APPEAR_ANIMATION.SCALE}>
                <div className="overlay-window container">
                    <div className="row justify-content-end">
                        <div className="col-auto">
                            {message && (
                                <i
                                    className={classnames('close-button', 'icon-close', {
                                        'invisible': message.modal
                                    })}
                                    onClick={this.close}/>
                            )}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col d-flex align-items-center justify-content-center">
                            {message && (
                                message.error
                                ? <i className="alert-icon error-icon icon-alert"/>
                                : (message.success
                                    ? <i className="alert-icon success-icon icon-check"/>
                                    : null)
                            )}
                            <div className="message-text">{message ? message.message : null}</div>
                        </div>
                    </div>
                    {message && message.action
                        ? <div className="row action-wrap justify-content-center">
                            <div className="col btn-container">
                                <ActionButton {...message.action} callback={this.close} accent={true}/>
                            </div>
                        </div> : null
                    }
                    {message && message.actions
                        ? <div className="row action-wrap justify-content-center">
                            <div className="col btn-container">
                                {
                                    _.insertAfterEach(message.actions.map((action, i) => (
                                        <ActionButton {...action} callback={this.close} key={i}/>
                                    )), ' ')
                                }
                            </div>
                        </div> : null
                    }
                </div>
            </Popup>
        );
    }
}

export default MessagePopup;