import {File} from "../File";
import React from "react";
import {usePreviewState} from "../GenericFileInput";
import { IPreviewProps } from "react-dropzone-uploader";

const Preview: React.FC<IPreviewProps> = (props) => {
    const {
        fileWithMeta,
        meta,
        isUpload,
        canRemove,
        className
    } = props;
    const {
        file,
        loading,
        isDone,
        isRejected,
        hasError,
        errorMessage,
        deleteCallback,
        action
    } = usePreviewState(fileWithMeta, meta, isUpload);
    return (
        <File
            file={file}
            loading={loading}
            className={className}
            done={isDone}
            rejected={isRejected}
            error={hasError}
            errorMessage={errorMessage}
            deletable={canRemove}
            onDelete={deleteCallback}
            onIndicatorClick={action}/>
    );
};

export default Preview;
