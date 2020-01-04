import React from 'react';
import _ from 'lodash';
import Dropzone from "react-dropzone-uploader";
import {useRefValue} from "hooks/common";
import Auth from 'definitions/auth';
import {API_ROOT} from "api";
import {getAuthHeader} from "definitions/helpers";

import 'react-dropzone-uploader/dist/styles.css';

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

export const FileInputContext = React.createContext(null);

const isFileReady = f => f.meta.status === 'done';
const getUploadParams = () => {
    // return { url: 'https://httpbin.org/post' };
    return {
        url: `${API_ROOT}/files/`,
        headers: getAuthHeader(Auth.getUserId(), Auth.getUserPassword())
    };
};
export const allFilesReady = files => files.every(f => isFileReady(f));

export const getFileProp = ({file_name, file_link}) => ({
    name: file_name,
    url: `${API_ROOT}${file_link}`
});

export function useInputCallback(getFilesFromEvent, onFiles) {
    return React.useCallback(async e => {
        const target = e.target;
        const chosenFiles = await getFilesFromEvent(e);
        onFiles(chosenFiles);
        target.value = null
    }, [getFilesFromEvent, onFiles]);
}

export function usePreviewState(fileWithMeta, meta, isUpload) {
    const { cancel, remove, restart, xhr } = fileWithMeta;
    const { name = '', percent = 0, status, previewUrl: url} = meta;

    const [getResponse, setResponse] = useRefValue(null);
    if (!getResponse() && xhr && xhr.responseText) {
        try {
            const {file_name, file_link, file_id} = JSON.parse(xhr.responseText);
            if (!(file_name && file_link && file_id))
                throw new Error('Incorrect response');
            setResponse({file_name, file_link, file_id});
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
    const isRejected = hasError && status === FILE_STATUS.error_file_size ? true : undefined;
    const loading = isUpload ? status === 'done' || status === 'headers_received' ? 100 : percent : null;
    const isDone = status === 'done';
    const file = {name, url};
    const errorMessage = hasError && isRejected ? 'Файл превышает максимальный допустимый размер' : undefined;
    const action = hasError && !isRejected ? restart : undefined;
    return {
        file,
        loading,
        isDone,
        isRejected,
        hasError,
        errorMessage,
        deleteCallback,
        action
    };
}

const getCallbackFiles = (files, preloadedFiles) => {
    if (!allFilesReady(files))
        return null;
    else
        return _.concat(preloadedFiles, files.map(({xhr}) => JSON.parse(xhr.responseText)));
};

//TODO: check disabled on capturing phase of click
const GenericFileInput = (props) => {
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
    }, [onChange, onSubmit, preloadedFiles]);

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
                maxFiles={maxFiles}
                maxSizeBytes={maxSizeBytes}
                accept={accept}
                classNames={{preview: ''}}
                disabled={isDisabled}
            />
        </FileInputContext.Provider>
    )
};

export default GenericFileInput;


