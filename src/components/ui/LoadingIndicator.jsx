import React from 'react';
import {useUpdateEffect} from "hooks/common";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import Tooltip from "./Tooltip";

export const LOADING_STATE = {
    PENDING: 'pending',
    LOADING: 'loading',
    LOADED: 'loaded',
    SUCCESS: 'success',
    DONE: 'done',
    REJECTED: 'rejected',
    ERROR: 'error'
};

export function useLoadingState(loading, done, rejected, error) {
    const [state, setState] = React.useState(loading === null || done
        ? LOADING_STATE.DONE
        : (rejected
            ? LOADING_STATE.REJECTED
            : LOADING_STATE.LOADING));
    useUpdateEffect(() => {
        if (loading === false) {
            setState(LOADING_STATE.LOADED);
        } else if (loading === true) {
            setState(LOADING_STATE.LOADING);
        }
    }, [loading]);
    useUpdateEffect(() => {
        if (state === LOADING_STATE.LOADED && done) {
            setState(LOADING_STATE.SUCCESS);
        }
        else if (state === LOADING_STATE.SUCCESS) {
            const timeout = setTimeout(() => {
                setState(LOADING_STATE.DONE);
            }, 1000);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [state, done]);
    useUpdateEffect(() => {
        if (error)
            setState(LOADING_STATE.ERROR);
    }, [error]);
    useUpdateEffect(() => {
        if (rejected)
            setState(LOADING_STATE.REJECTED);
    }, [rejected]);
    return state;
}

export const LoadingIndicator = ({state, onClick, errorMessage}) => {
    const icon = (state === LOADING_STATE.LOADED && "spinner-border")
        || (state === LOADING_STATE.SUCCESS && "icon-check")
        || (state === LOADING_STATE.ERROR && "icon-reload")
        || (state === LOADING_STATE.REJECTED && "icon-alert")
        || "spinner-border";
    return (
        <SwitchTransition>
            {state !== LOADING_STATE.DONE ? (
                <CSSTransition
                    key={icon}
                    appear={true}
                    classNames="animation-scale"
                    timeout={300}>
                    <div
                        className="file__state-indicator"
                        onClick={onClick}>
                        <Tooltip content={errorMessage}>
                            <i
                                className={icon}/>
                        </Tooltip>
                    </div>
                </CSSTransition>
            ) : null}
        </SwitchTransition>
    );
};
