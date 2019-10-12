import React from 'react';
import Dropzone from "react-dropzone-uploader";
import Button from "./Button";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import FileButton from "./FileButton";
import _ from 'lodash';
import {useForceUpdate, useUpdateEffect} from "../../definitions/hooks";

import 'react-dropzone-uploader/dist/styles.css';

const isFileReady = f => f.meta.status === 'done';

const Input = (props) => {
    const {
        className,
        style,
        getFilesFromEvent,
        accept,
        multiple,
        disabled,
        onFiles,
        files,
        extra: { maxFiles }
    } = props;
    const onChange = React.useCallback(async e => {
        const target = e.target;
        const chosenFiles = await getFilesFromEvent(e);
        onFiles(chosenFiles);
        target.value = null
    }, [getFilesFromEvent, onFiles]);
    const isActive = files.length < maxFiles && !disabled;
    return (
        <Button
            tag="label"
            active={isActive}
            after={<i className="icon-add"/>}>
            Отправить решение
            <input
                className={className}
                style={style}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={!isActive}
                onChange={isActive && onChange}
            />
        </Button>
    );
};

const Preview = (props) => {
    const {
        fileWithMeta: { cancel, remove, restart },
        meta: { name = '', percent = 0, size = 0, previewUrl: url, status, duration, validationError },
        isUpload,
        canCancel,
        canRemove,
        canRestart
    } = props;
    useUpdateEffect(() => {
        console.log('status change', status);
    }, [status]);
    const deleteCallback = React.useCallback(() => {
        if (isUpload && !(status === 'done' || status === 'headers_received')) {
            cancel();
        }
        remove();
    }, [cancel, remove, isUpload, status]);
    return (
        <FileButton
            file={{name, url}}
            loading={isUpload && status !== 'done'
                ? (status === 'done' || status === 'headers_received' ? 100 : percent)
                : null}
            deletable={canRemove}
            onDelete={deleteCallback}/>
    );
};

const SubmitButton = (props) => {
    const { disabled, onSubmit, files } = props;
    const isDisabled = !files.every(f => isFileReady(f)) || disabled;

    const submitCallback = React.useCallback(() => {
        onSubmit(files);
    }, [onSubmit, files]);

    return onSubmit && (
        <Button
            active={!isDisabled}
            onClick={submitCallback}>
            Сохранить
        </Button>
    );
};

const Layout = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }) => {
    const { ref } = dropzoneProps;
    return (
        <div
            ref={ref}
            className="file-input">
            {input}
            {/*{submitButton}*/}
            <CSSTransition
                in={previews && previews.length > 0}
                mountOnEnter
                unmountOnExit
                classNames="animation-fade"
                timeout={300}>
                <h4 className="file-input__files-title">Загруженные файлы</h4>
            </CSSTransition>
            <TransitionGroup className="file-container">
                {previews.map((preview, i) => (
                    <CSSTransition
                        classNames="animation-fade"
                        timeout={300}
                        key={i}>
                        {preview}
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
    );
};

//TODO: check disabled on capturing phase of click
const FileInput = (props, ref) => {
    const forceUpdate = useForceUpdate();
    const {initialFiles, onChange} = props;

    const dropzoneRef = React.useRef(null);
    // React.useImperativeHandle(ref, () => ({
    //     getFiles: () => {
    //         if (!dropzoneRef.current)
    //             return null;
    //         return dropzoneRef.current.files.filter(f => isFileReady(f)).map(f => f.xhr.response);
    //     },
    //     areFilesReady: () => {
    //         if (!dropzoneRef.current)
    //             return;
    //         const files = dropzoneRef.current.files;
    //         return files.every(f => isFileReady(f));
    //     }
    // }));

    const getUploadParams = () => {
        return { url: 'https://httpbin.org/post' };
    };

    const handleChangeStatus = ({meta, ...file}, status, files) => {
        // console.log(status, meta, _.cloneDeep(files), files === 0 || files.every(f => isFileReady(f)));
        if (onChange && (status === 'removed' || status === 'done'))
            onChange(files.filter(f => isFileReady(f)).map(f => f.xhr.response));
    };

    const handleSubmit = (files, allFiles) => {
        console.log(files.map(f => f.meta));
        allFiles.forEach(f => f.remove())
    };

    const {
        maxFiles=1,
        maxSizeBytes=1024 * 1024 * 4,
        accept,
        isDisabled=false
    } = props;
    // const disabled = typeof isDisabled === 'function' ? isDisabled() : isDisabled;
    return (
        <Dropzone
            getUploadParams={getUploadParams}
            onChangeStatus={handleChangeStatus}
            onSubmit={handleSubmit}
            canCancel={false}
            // SubmitButtonComponent={SubmitButton}
            SubmitButtonComponent={null}
            LayoutComponent={Layout}
            InputComponent={Input}
            PreviewComponent={Preview}
            styles={{ dropzone: { minHeight: 200, maxHeight: 250 } }}
            maxFiles={maxFiles}
            // maxSizeBytes={maxSizeBytes}
            accept={accept}
            disabled={isDisabled}
            ref={dropzoneRef}
        />
    )
};

export default React.forwardRef(FileInput);


