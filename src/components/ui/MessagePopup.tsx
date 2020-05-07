import classNames from 'classnames';
import _ from 'lodash';
import React from 'react';
import {Link, LinkProps} from 'react-router-dom';
import {SimpleCallback} from 'types/utility/common';

import Button from './Button';
import Popup, {PopupAnimation} from './Popup';

export type MessageAction = {
  text: string;
} & (
  | {
      action?: SimpleCallback;
    }
  | {
      url: LinkProps['to'];
    }
);

export type Message = {
  message: string;
  modal?: boolean;
  error?: boolean;
  success?: boolean;
  actions?: MessageAction[];
  action?: MessageAction;
};

export type ActionButtonProps = {
  callback: SimpleCallback;
  accent?: boolean;
} & MessageAction;
class ActionButton extends React.Component<ActionButtonProps> {
  onClick = (): void => {
    if ('action' in this.props && this.props.action) {
      this.props.action();
    }
    this.props.callback();
  };

  render(): React.ReactElement {
    const {text, accent} = this.props;

    if ('url' in this.props) {
      return (
        <Button<typeof Link>
          component={Link}
          to={this.props.url as any}
          className={accent ? 'action accent' : 'action'}
          onClick={this.onClick}
        >
          {text}
        </Button>
      );
    } else {
      return (
        <Button
          className={accent ? 'action accent' : 'action'}
          onClick={this.onClick}
        >
          {text}
        </Button>
      );
    }
  }
}

export type MessagePopupProps = {
  message?: Message;
  opened: boolean;
};
class MessagePopup extends React.Component<{}, MessagePopupProps> {
  constructor(props: {}) {
    super(props);
    this.state = {
      opened: false,
    };
  }

  showMessage = (message: Message): void => {
    this.setState({opened: true, message});
  };

  close = (): void => {
    this.setState({opened: false});
  };

  render(): React.ReactElement {
    const {opened, message} = this.state;

    return (
      <Popup
        className={classNames('message-popup', {
          'error-popup': message && message.error,
          large: message && message.message.length > 60,
        })}
        opened={opened}
        closeOnBackgroundClick={false}
        appearAnimation={PopupAnimation.SCALE}
      >
        <div className="overlay-window container">
          <div className="row justify-content-end">
            <div className="col-auto">
              {message && (
                <i
                  className={classNames('close-button', 'icon-close', {
                    invisible: message.modal,
                  })}
                  onClick={this.close}
                />
              )}
            </div>
          </div>
          <div className="row">
            <div className="col d-flex align-items-center justify-content-center">
              {message &&
                (message.error ? (
                  <i className="alert-icon error-icon icon-alert" />
                ) : message.success ? (
                  <i className="alert-icon success-icon icon-check" />
                ) : null)}
              <div className="message-text">
                {message ? message.message : null}
              </div>
            </div>
          </div>
          {message && message.action ? (
            <div className="row action-wrap justify-content-center">
              <div className="col btn-container">
                <div className="btn-container__inner justify-content-center">
                  <ActionButton
                    {...message.action}
                    callback={this.close}
                    accent={true}
                  />
                </div>
              </div>
            </div>
          ) : null}
          {message && message.actions ? (
            <div className="row action-wrap justify-content-center">
              <div className="col btn-container">
                <div className="btn-container__inner justify-content-center">
                  {_.insertAfterEach(
                    message.actions.map((action, i) => (
                      <ActionButton {...action} callback={this.close} key={i} />
                    )),
                    ' ',
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Popup>
    );
  }
}

export default MessagePopup;
