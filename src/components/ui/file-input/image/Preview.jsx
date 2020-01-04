import {ImageFile} from "../File";
import React from "react";
import {usePreviewState} from "../GenericFileInput";

const Preview = (props) => {
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
        <ImageFile
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
