import React from 'react';
import Dropzone from "react-dropzone-uploader";
import Button from "./Button";
import {TransitionGroup} from "react-transition-group";
import File from "./File";
import _ from 'lodash';
import {useForceUpdate, useRefValue, useUpdateEffect} from "../../definitions/hooks";

import 'react-dropzone-uploader/dist/styles.css';
import {API_ROOT} from "../../definitions/requests";
import {getAuthHeader} from "../../definitions/helpers";
import {TEST_HASH, TEST_ID} from "../../data/test_data";
import StableCSSTransition from "./StableCSSTransition";

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
    return { url: 'https://httpbin.org/post' };
    // return {
    //     url: `${API_ROOT}/files`,
    //     headers: getAuthHeader(TEST_ID, TEST_HASH)
    // };
};
const getFileProp = ({original_file_name, file_link, id_file_name}) => ({
    name: original_file_name,
    downloadName: trimExtension(original_file_name) + trimExtension(id_file_name),
    url: `${API_ROOT}${file_link}`
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
        meta: { name = '', percent = 0, size = 0, previewUrl, status, duration, validationError },
        isUpload,
        canCancel,
        canRemove,
        canRestart,
        className
    } = props;
    const response = React.useRef(null);
    if (!response.current && xhr && xhr.responseText) {
        try {
            const {original_file_name, file_link, id_file_name} = JSON.parse(xhr.responseText);
            if (!(original_file_name && file_link && id_file_name))
                throw new Error('Incorrect response');
            response.current = {
                original_file_name,
                file_link,
                id_file_name
            };
        }
        catch (e) {
            console.log(e);
        }
    }
    const responseInfo = response.current;
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
            file={responseInfo ? getFileProp(responseInfo) : ({name})}
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
    const { disabled, onSubmit, files } = props;
    const isDisabled = !allFilesReady(files) || disabled;

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

const Layout = ({input, previews=[], submitButton, dropzoneProps, files, extra: { maxFiles } }) => {
    const context = React.useContext(FileInputContext);
    const {preloadedFiles=[], deletePreloadedFile, disabled, hasChanged} = context || ({});
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
                {submitButton && (
                    <StableCSSTransition
                        in={hasChanged}
                        mountOnEnter
                        unmountOnExit
                        classNames="animation-fade"
                        timeout={300}>
                        {submitButton}
                    </StableCSSTransition>
                )}
            </div>
        </div>
    );
};

const getChangedCallbackFiles = (files, preloadedFiles) => {
    if (!allFilesReady(files))
        return null;
    else
        return _.concat(preloadedFiles, files.map(({xhr}) => JSON.parse(xhr.responseText)));
};

//TODO: check disabled on capturing phase of click
const FileInput = (props, ref) => {
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
    const [getInputFiles, setInputFiles] = useRefValue([]);

    const deletePreloadedFile = React.useCallback((file) => {
        const newPreloadedFiles = preloadedFiles.filter(item => item !== file);
        setChanged(true);
        setPreloadedFiles(newPreloadedFiles);
        onChange && onChange(getChangedCallbackFiles(getInputFiles(), newPreloadedFiles));
    }, [preloadedFiles, onChange, getInputFiles]);

    const handleChangeStatus = React.useCallback(({meta, ...file}, status, files) => {
        console.log(status, meta, _.cloneDeep(files));
        setChanged(true);
        setInputFiles(files);
        onChange && onChange(getChangedCallbackFiles(files, preloadedFiles));
    }, [onChange, preloadedFiles, setInputFiles]);

    const handleSubmit = React.useCallback((files) => {
        console.log(files.map(f => f.meta));
        onSubmit && onSubmit(getChangedCallbackFiles(files, preloadedFiles));
    }, [onSubmit, preloadedFiles]);

    maxFiles = preloadedFiles ? maxFiles - preloadedFiles.length : maxFiles;
    const disabled = typeof isDisabled === 'function' ? isDisabled() : isDisabled;
    return (
        <FileInputContext.Provider
            value={{
                preloadedFiles,
                deletePreloadedFile,
                hasChanged,
                disabled
            }}>
            <Dropzone
                {...otherProps}
                inputContent={inputContent}
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

export default React.forwardRef(FileInput);


