import React from "react";
import {LOADING_STATE, LoadingIndicator, useLoadingState} from "components/ui/LoadingIndicator";
import StableCSSTransition from "components/common/StableCSSTransition";
import Button from "components/ui/Button";

import {allFilesReady, FileInputContext} from "../GenericFileInput";
import { ISubmitButtonProps } from "react-dropzone-uploader";

const SubmitButton: React.FC<ISubmitButtonProps> = (props) => {
    const {submitting, hasChanged} = React.useContext(FileInputContext) || ({});
    const {disabled, onSubmit, files, content} = props;
    const isDisabled = !allFilesReady(files) || disabled;

    const submitCallback = React.useCallback(() => {
        onSubmit(files);
    }, [onSubmit, files]);

    const state = useLoadingState(submitting, submitting === false);

    return (
        <StableCSSTransition
            in={onSubmit != null && (hasChanged || state !== LOADING_STATE.DONE)}
            appear
            mountOnEnter
            unmountOnExit
            classNames="animation-fade"
            timeout={300}>
            <React.Fragment>
                <Button
                    active={!isDisabled}
                    icon={
                        hasChanged
                            ? (<i className="icon-upload"/>)
                            : (<LoadingIndicator state={state}/>)
                    }
                    onClick={submitCallback}>
                    {hasChanged ? content : 'Сохранено'}
                </Button>
            </React.Fragment>
        </StableCSSTransition>
    );
};

export default SubmitButton;