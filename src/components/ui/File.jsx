import React from 'react';
import Button from "./Button";
import {useUpdateEffect} from "../../definitions/hooks";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import Tooltip from "./Tooltip";
import {downloadFile} from "../../definitions/helpers";

const STATE = {
    PENDING: 'pending',
    LOADING: 'loading',
    LOADED: 'loaded',
    SUCCESS: 'success',
    DONE: 'done',
    REJECTED: 'rejected',
    ERROR: 'error'
};

const File = ({
                  file: {name, downloadName, url},
                  error=null,
                  rejected=null,
                  loading=null,
                  done=true,
                  deletable,
                  onDelete,
                  onIndicatorClick,
                  className,
                  errorMessage,
                  ...props
              }) => {
    const downloadCallback = React.useCallback(() => {
        if (url)
            downloadFile(url, downloadName || name);
    }, [url, name, downloadName]);
    // console.log(rejected, loading, error);
    const isUpload = loading !== null;
    const [state, setState] = React.useState(loading === null || done
        ? STATE.DONE
        : (rejected
        ? STATE.REJECTED
        : STATE.LOADING));
    const icon = (state === STATE.LOADED && "spinner-border")
        || (state === STATE.SUCCESS && "icon-check")
        || (state === STATE.ERROR && "icon-reload")
        || (state === STATE.REJECTED && "icon-alert")
        || "spinner-border";
    useUpdateEffect(() => {
        if (loading === 100) {
            setState(STATE.LOADED);
        }
    }, [loading]);
    useUpdateEffect(() => {
        if (state === STATE.LOADED && done) {
            setState(STATE.SUCCESS);
        }
        else if (state === STATE.SUCCESS) {
            const timeout = setTimeout(() => {
                setState(STATE.DONE);
            }, 1000);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [state, done]);
    useUpdateEffect(() => {
        if (error)
            setState(STATE.ERROR);
    }, [error]);
    useUpdateEffect(() => {
        if (rejected)
            setState(STATE.REJECTED);
    }, [rejected]);

    return (
        <div className={`file file-${state} ${className || ''}`}>
            <Button
                neutral
                className="file__btn"
                icon={deletable
                    ? <i className="icon-close file__action-btn file__delete-btn animated__action-button"/>
                    : <i className="icon-download file__action-btn file__download-btn animated__action-button"/>}
                iconAction={deletable ? onDelete : undefined}
                onClick={downloadCallback}
                {...props}>
                {loading !== null && <div className="file__loading-progress" style={{width: `${loading}%`}}/>}
                <i className="file__icon far fa-file-alt"/>
                <span
                    className="file__name"
                    title={name}>
                {name}
            </span>
            </Button>
            <SwitchTransition>
                {isUpload && state !== STATE.DONE ? (
                    <CSSTransition
                        key={icon}
                        appear={true}
                        classNames="animation-scale"
                        timeout={300}>
                        <div
                            className="file__state-indicator"
                            onClick={onIndicatorClick}>
                            <Tooltip content={errorMessage}>
                                <i
                                    className={icon}
                                    onClick={onDelete}/>
                            </Tooltip>
                        </div>
                    </CSSTransition>
                ) : null}
            </SwitchTransition>
        </div>
    );
};

export default File;

