import React from 'react';
import Button from "../../Button";
import {downloadFile} from "definitions/helpers";
import {LoadingIndicator, useLoadingState} from "../../LoadingIndicator";
import CoverImage from "../../../common/CoverImage";

const DefaultFileProps = {
    error: null,
    rejected: null,
    loading: null,
    done: true,
    deletable: false,
};

export const File = ({
                         file: {name, downloadName, url},
                         error,
                         rejected,
                         loading,
                         done,
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
                <i className="file__icon far fa-file"/>
                <span
                    className="file__name"
                    title={name}>
                {name}
            </span>
            </Button>
            {loading !== null && (
                <LoadingIndicator
                    onClick={onIndicatorClick}
                    state={state}
                    errorMessage={errorMessage}/>
            )}
        </div>
    );
};

File.defaultProps = DefaultFileProps;

export const ImageFile = ({
                              file: {name, downloadName, url},
                              error,
                              rejected,
                              loading,
                              done,
                              deletable,
                              onDelete,
                              onIndicatorClick,
                              className,
                              errorMessage
                          }) => {
    const downloadCallback = React.useCallback((event) => {
        if (event.target.closest('.file__state-indicator, .file__action-btn'))
            return;
        if (url)
            downloadFile(url, downloadName || name);
    }, [url, name, downloadName]);
    const state = useLoadingState(loading !== null ? loading < 100 : null, done, rejected, error);
    return (
        <div className={`image-file file file-${state} ${className || ''}`}>
            <CoverImage
                src={url}
                className="poster-cover"
                onClick={downloadCallback}>
                <div className="image-file__overlay">
                    {loading !== null && <div className="file__loading-progress" style={{width: `${100 - loading}%`}}/>}
                    {deletable && (
                        <div className="file__action-btn file__delete-btn">
                            <i
                                onClick={onDelete}
                                className="icon-close"/>
                        </div>
                    )}
                </div>
            </CoverImage>
            {loading !== null && (
                <LoadingIndicator
                    onClick={onIndicatorClick}
                    state={state}
                    errorMessage={errorMessage}/>
            )}
        </div>
    );
};

ImageFile.defaultProps = DefaultFileProps;

