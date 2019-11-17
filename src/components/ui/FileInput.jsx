import React from 'react';
import _ from 'lodash';
import Dropzone from "react-dropzone-uploader";
import {TransitionGroup} from "react-transition-group";
import {useRefValue} from "hooks/common";
import Auth from 'definitions/auth';
import {API_ROOT} from "definitions/api";
import {getAuthHeader} from "definitions/helpers";
import StableCSSTransition from "components/common/StableCSSTransition";
import {LOADING_STATE, LoadingIndicator, useLoadingState} from "./LoadingIndicator";
import File from "./File";
import Button from "./Button";

import 'react-dropzone-uploader/dist/styles.css';

const trimExtension = (filename) => filename.replace(/\.[^/.]+$/, "");

const FILE_STATUS = {
    rejected_file_type: 'rejected_file_type',
    rejected_max_files: 'rejected_max_files',
    preparing: 'preparing',
    error_file_size: 'error_file_size',
    error_validation: 'error_validation',
    ready: 'ready',
    started: 'started',
    getting_upload_params: 'getting_upload_params',
    error_upload_params: 'error_upload_params',
    uploading: 'uploading',
    exception_upload: 'exception_upload',
    aborted: 'aborted',
    restarted: 'restarted',
    removed: 'removed',
    error_upload: 'error_upload',
    headers_received: 'headers_received',
    done: 'done',
};
const FileInputContext = React.createContext(null);
const isFileReady = f => f.meta.status === 'done';
const allFilesReady = files => files.every(f => isFileReady(f));
const getUploadParams = () => {
    // return { url: 'https://httpbin.org/post' };
    if (Auth.user) {
        return {
            url: `${API_ROOT}/files/`,
            headers: getAuthHeader(Auth.user.uid, Auth.user.hash)
        };
    }
    else
        throw new Error('User not logged in');
};
const getFileProp = ({original_file_name, id_file_name}) => ({
    name: original_file_name,
    downloadName: `${trimExtension(original_file_name)}_${id_file_name}`,
    url: `${API_ROOT}/files/attachments/${id_file_name}?disp=attachment`
});

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
        content,
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
            icon={<i className="icon-add"/>}>
            {content}
            <input
                className={className}
                style={style}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={!isActive}
                onChange={isActive ? onChange : null}
            />
        </Button>
    );
};

const Preview = (props) => {
    const {
        fileWithMeta: { cancel, remove, restart, xhr },
        meta: { name = '', percent = 0, status},
        isUpload,
        canRemove,
        className
    } = props;
    const [getResponse, setResponse] = useRefValue(null);
    if (!getResponse() && xhr && xhr.responseText) {
        try {
            const {original_file_name, file_link, id_file_name} = JSON.parse(xhr.responseText);
            if (!(original_file_name && file_link && id_file_name))
                throw new Error('Incorrect response');
            setResponse({
                original_file_name,
                file_link,
                id_file_name
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    const response = getResponse();
    const deleteCallback = React.useCallback(() => {
        if (isUpload && !(status === 'done' || status === 'headers_received')) {
            cancel();
        }
        remove();
    }, [cancel, remove, isUpload, status]);
    const hasError = _.startsWith(status, 'error') || _.startsWith(status, 'exception');
    const isRejected = status === FILE_STATUS.error_file_size ? true : undefined;
    const loading = isUpload ? status === 'done' || status === 'headers_received' ? 100 : percent : null;
    const isDone = status === 'done';
    return (
        <File
            file={response ? getFileProp(response) : ({name})}
            loading={loading}
            className={className}
            done={isDone}
            rejected={hasError && isRejected ? true : undefined}
            error={hasError}
            errorMessage={hasError && isRejected ? 'Файл превышает максимальный допустимый размер' : undefined}
            deletable={canRemove}
            onDelete={deleteCallback}
            onIndicatorClick={hasError && !isRejected ? restart : undefined}/>
    );
};

const SubmitButton = (props) => {
    const {submitting, hasChanged} = React.useContext(FileInputContext) || ({});
    const { disabled, onSubmit, files, content } = props;
    const isDisabled = !allFilesReady(files) || disabled;

    const submitCallback = React.useCallback(() => {
        onSubmit(files);
    }, [onSubmit, files]);

    const state = useLoadingState(submitting, submitting === false);
    console.log(state);
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

const Layout = ({input, previews=[], submitButton, dropzoneProps, files, extra: { maxFiles } }) => {
    const context = React.useContext(FileInputContext);
    const {preloadedFiles=[], deletePreloadedFile, disabled} = context || ({});
    const { ref } = dropzoneProps;
    return (
        <div
            ref={ref}
            className="file-input">
            {/*<StableCSSTransition*/}
            {/*    in={previews.length > 0 || preloadedFiles.length > 0}*/}
            {/*    mountOnEnter*/}
            {/*    unmountOnExit*/}
            {/*    classNames="animation-fade"*/}
            {/*    timeout={300}>*/}
            <h4 className="file-input__files-title">Загруженные файлы</h4>
            {/*</StableCSSTransition>*/}
            <TransitionGroup className="file-container">
                {
                    preloadedFiles && (
                        preloadedFiles.map((file) => {
                            const {id_file_name} = file;
                            const deleteCallback = () => {deletePreloadedFile(file);};
                            return (
                                <StableCSSTransition
                                    classNames="animation-fade"
                                    timeout={300}
                                    key={id_file_name}>
                                    <File
                                        file={getFileProp(file)}
                                        done={true}
                                        deletable={!disabled}
                                        onDelete={deleteCallback}/>
                                </StableCSSTransition>
                            );
                        }
                    ))
                }
                {previews.map((preview, i) => (
                    <StableCSSTransition
                        classNames="animation-fade"
                        timeout={300}
                        key={preview.props.meta.id}>
                        {preview}
                    </StableCSSTransition>
                ))}
            </TransitionGroup>
            <div className="file-input__controls">
                {input}
                {submitButton}
            </div>
        </div>
    );
};

const getCallbackFiles = (files, preloadedFiles) => {
    if (!allFilesReady(files))
        return null;
    else
        return _.concat(preloadedFiles, files.map(({xhr}) => JSON.parse(xhr.responseText)));
};

//TODO: check disabled on capturing phase of click
const FileInput = (props) => {
    let {
        initialFiles=[],
        inputContent="Загрузить файл",
        onChange,
        onSubmit,
        maxFiles=5,
        maxSizeBytes=1024 * 1024 * 4,
        accept,
        isDisabled=false,
        ...otherProps
    } = props;

    const [preloadedFiles, setPreloadedFiles] = React.useState(initialFiles);
    const [hasChanged, setChanged] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(null);
    const [getInputFiles, setInputFiles] = useRefValue([]);

    const deletePreloadedFile = React.useCallback((file) => {
        const newPreloadedFiles = preloadedFiles.filter(item => item !== file);
        setChanged(true);
        setPreloadedFiles(newPreloadedFiles);
        onChange && onChange(getCallbackFiles(getInputFiles(), newPreloadedFiles));
    }, [preloadedFiles, onChange, getInputFiles]);

    const handleChangeStatus = React.useCallback(({meta, ...file}, status, files) => {
        console.log(status, meta, _.cloneDeep(files));
        setChanged(true);
        setInputFiles(files);
        onChange && onChange(true, getCallbackFiles(files, preloadedFiles));
    }, [onChange, preloadedFiles, setInputFiles]);

    const handleSubmit = React.useCallback(async (files) => {
        console.log(files.map(f => f.meta));
        if (onSubmit) {
            const filesToSubmit = getCallbackFiles(files, preloadedFiles);
            const returnValue = onSubmit(filesToSubmit);
            if (returnValue instanceof Promise) {
                setSubmitting(true);
                try {
                    await returnValue;
                    setChanged(false);
                    onChange && onChange(false, filesToSubmit);
                }
                finally {
                    setSubmitting(false);
                }
            }
        }
    }, [onSubmit, preloadedFiles]);

    maxFiles = preloadedFiles ? maxFiles - preloadedFiles.length : maxFiles;
    const disabled = typeof isDisabled === 'function' ? isDisabled() : isDisabled;
    return (
        <FileInputContext.Provider
            value={{
                preloadedFiles,
                deletePreloadedFile,
                hasChanged,
                disabled,
                submitting
            }}>
            <Dropzone
                inputContent={inputContent}
                submitButtonContent={'Сохранить'}
                {...otherProps}
                getUploadParams={getUploadParams}
                onChangeStatus={handleChangeStatus}
                onSubmit={onSubmit && handleSubmit}
                canCancel={false}
                SubmitButtonComponent={SubmitButton}
                LayoutComponent={Layout}
                InputComponent={Input}
                PreviewComponent={Preview}
                maxFiles={maxFiles}
                maxSizeBytes={maxSizeBytes}
                accept={accept}
                classNames={{preview: ''}}
                disabled={isDisabled}
            />
        </FileInputContext.Provider>
    )
};

export default FileInput;


