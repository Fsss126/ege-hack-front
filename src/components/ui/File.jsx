import React from 'react';
import Button from "./Button";
import {downloadFile} from "../../definitions/helpers";
import {LoadingIndicator, useLoadingState} from "./LoadingIndicator";

const File = ({
                  file: {name, downloadName, url},
                  error=null,
                  rejected=null,
                  loading=null,
                  done=true,
                  deletable=false,
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
    const isUpload = loading !== null;
    const state = useLoadingState(loading !== null ? loading < 100 : null, done, rejected, error);
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
            {isUpload && (
                <LoadingIndicator
                    onClick={onIndicatorClick}
                    state={state}
                    errorMessage={errorMessage}/>
            )}
        </div>
    );
};

export default File;

