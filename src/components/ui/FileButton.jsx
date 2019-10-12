import React from 'react';
import Button from "./Button";

const FileButton = ({file: {name, url}, active=true, deletable, loading=null, onDelete, className, ...props}) => {
    const downloadCallback = React.useCallback(() => {
        let link = document.createElement('a');
        link.download = '';
        link.href = url;
        let event = new MouseEvent('click');
        link.dispatchEvent(event);
    }, [url]);
    return (
        <Button
            className={`file btn btn-neutral ${loading != null ? 'loading' : ''}`}
            after={deletable
                ? <i
                    className="icon-close file__action-btn file__delete-btn animated__action-button"
                    onClick={onDelete}/>
                : <i
                    className="icon-download file__action-btn file__download-btn animated__action-button"
                    onClick={downloadCallback}/>}
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
    );
};

export default FileButton;

