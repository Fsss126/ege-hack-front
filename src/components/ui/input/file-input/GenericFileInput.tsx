import 'react-dropzone-uploader/dist/styles.css';

import {API_ROOT} from 'api';
import {useFormState} from 'components/ui/Form';
import Auth from 'definitions/auth';
import _ from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Dropzone, {
  IDropzoneProps,
  IFileWithMeta,
  IInputProps,
  IMeta,
} from 'react-dropzone-uploader';
import {FileInfo} from 'types/dtos';
import {SimpleCallback} from 'types/utility/common';

import {FileProps} from './File';

enum FILE_STATUS {
  rejected_file_type = 'rejected_file_type',
  rejected_max_files = 'rejected_max_files',
  preparing = 'preparing',
  error_file_size = 'error_file_size',
  error_validation = 'error_validation',
  ready = 'ready',
  started = 'started',
  getting_upload_params = 'getting_upload_params',
  error_upload_params = 'error_upload_params',
  uploading = 'uploading',
  exception_upload = 'exception_upload',
  aborted = 'aborted',
  restarted = 'restarted',
  removed = 'removed',
  error_upload = 'error_upload',
  headers_received = 'headers_received',
  done = 'done',
}

export type FileInputContextState = {
  preloadedFiles: FileInfo[];
  deletePreloadedFile: (file: FileInfo) => void;
  hasChanged: boolean;
  filesName: React.ReactNode;
  disabled: boolean;
  submitting: boolean | null;
  name: string;
  required: boolean;
};

export const FileInputContext = React.createContext<FileInputContextState>(
  undefined as any,
);
FileInputContext.displayName = 'FileInputContext';

const isFileReady = (f: IFileWithMeta): boolean => f.meta.status === 'done';
const getUploadParams: IDropzoneProps['getUploadParams'] = () => {
  // return { url: 'https://httpbin.org/post' };
  return {
    url: `${API_ROOT}/files/`,
    headers: {
      Authorization: Auth.getAccessToken(),
    },
  };
};
export const allFilesReady = (files: IFileWithMeta[]): boolean =>
  files.every((f) => isFileReady(f));

export function useInputCallback(
  getFilesFromEvent: IInputProps['getFilesFromEvent'],
  onFiles: IInputProps['onFiles'],
): React.ChangeEventHandler<HTMLInputElement> {
  return useCallback(
    async (e) => {
      const target = e.target;
      const chosenFiles = await getFilesFromEvent(e);
      onFiles(chosenFiles);
      target.value = '';
    },
    [getFilesFromEvent, onFiles],
  );
}

export type PreviewState = {
  file: FileProps['file'];
  loading: FileProps['loading'];
  isDone: boolean;
  isRejected: boolean;
  hasError: boolean;
  deleteCallback: Required<FileProps>['onDelete'];
  action?: SimpleCallback;
  errorMessage: FileProps['errorMessage'];
};

export function usePreviewState(
  fileWithMeta: IFileWithMeta,
  meta: IMeta,
  isUpload: boolean,
): PreviewState {
  const {cancel, remove, restart, xhr} = fileWithMeta;
  const {
    name: file_name = '',
    percent = 0,
    status,
    previewUrl: file_link,
  } = meta;

  const responseRef = useRef<FileInfo>();

  if (!responseRef.current && xhr && xhr.responseText) {
    try {
      const {file_name, file_link, file_id} = JSON.parse(xhr.responseText);

      if (!(file_name && file_link && file_id)) {
        throw new Error('Incorrect response');
      }
      responseRef.current = {file_name, file_link, file_id};
    } catch (e) {
      console.error(e);
    }
  }
  const deleteCallback = React.useCallback(() => {
    if (isUpload && !(status === 'done' || status === 'headers_received')) {
      cancel();
    }
    remove();
  }, [cancel, remove, isUpload, status]);
  const hasError =
    _.startsWith(status, 'error') || _.startsWith(status, 'exception');
  const isRejected = hasError && status === FILE_STATUS.error_file_size;
  const loading = isUpload
    ? status === 'done' || status === 'headers_received'
      ? 100
      : percent
    : null;
  const isDone = status === 'done';
  const file = {file_name, file_link};
  const errorMessage =
    hasError && isRejected
      ? 'Файл превышает максимальный допустимый размер'
      : undefined;
  const action = hasError && !isRejected ? restart : undefined;

  return {
    file,
    loading,
    isDone,
    isRejected,
    hasError,
    errorMessage,
    deleteCallback,
    action,
  };
}

const getCallbackFiles = (
  files: IFileWithMeta[],
  preloadedFiles: FileInfo[],
): FileInfo[] | undefined => {
  if (!allFilesReady(files)) {
    return undefined;
  } else {
    return _.concat<FileInfo>(
      preloadedFiles,
      files.map<FileInfo>(({xhr}) => JSON.parse(xhr!.responseText)),
    );
  }
};

type defaultDropzoneProps = typeof Dropzone.defaultProps;
type DropzoneProps = React.Defaultize<IDropzoneProps, defaultDropzoneProps>;

// TODO: check disabled on capturing phase of click
export type InputChangeCallback = (
  files: FileInfo[] | undefined,
  name: string,
  changed: boolean,
) => void;

export type InputSubmitCallback = (
  files: FileInfo[] | undefined,
) => Promise<any> | any;

export type FileInputProps = {
  initialFiles: FileInfo[];
  inputContent: React.ReactNode;
  filesName?: React.ReactNode;
  onChange?: InputChangeCallback;
  onSubmit?: InputSubmitCallback;
  name: string;
  value?: FileInfo[];
  required: boolean;
  disabled: boolean | (() => boolean);
  InputComponent?: DropzoneProps['InputComponent'] | null;
  SubmitButtonComponent?: DropzoneProps['SubmitButtonComponent'] | null;
} & Omit<
  DropzoneProps,
  | 'getUploadParams'
  | 'onChangeStatus'
  | 'onSubmit'
  | 'canCancel'
  | 'classNames'
  | 'disabled'
  | 'initialFiles'
  | 'InputComponent'
  | 'SubmitComponent'
>;
const GenericFileInput = (props: FileInputProps): React.ReactElement => {
  const {
    initialFiles,
    inputContent,
    filesName,
    onChange: changeCallback,
    onSubmit,
    disabled,
    name,
    required,
    value,
    InputComponent,
    SubmitButtonComponent,
    ...otherProps
  } = props;
  let {maxFiles} = props;

  const [preloadedFiles, setPreloadedFiles] = useState<FileInfo[]>(
    initialFiles,
  );

  const inputFilesRef = useRef<IFileWithMeta[]>([]);

  const onSubmitClick = useCallback(
    (files: IFileWithMeta[]): Promise<any> | any => {
      if (onSubmit) {
        const filesToSubmit = getCallbackFiles(files, preloadedFiles);
        const returnValue = onSubmit(filesToSubmit);

        if (returnValue instanceof Promise) {
          (async () => {
            await returnValue;
            if (changeCallback) {
              changeCallback(filesToSubmit, name, false);
            }
          })();
        }
        return returnValue;
      }
    },
    [changeCallback, onSubmit, preloadedFiles, name],
  );

  const {submitting, handleSubmit, hasChanged, onChange} = useFormState<
    [IFileWithMeta[]],
    any
  >(onSubmitClick);

  const deletePreloadedFile = useCallback(
    (file: FileInfo) => {
      const newPreloadedFiles = preloadedFiles.filter((item) => item !== file);
      onChange();
      setPreloadedFiles(newPreloadedFiles);
      if (changeCallback) {
        changeCallback(
          getCallbackFiles(inputFilesRef.current, newPreloadedFiles),
          name,
          true,
        );
      }
    },
    [preloadedFiles, changeCallback, name, onChange],
  );

  const handleChangeStatus: Required<
    IDropzoneProps
  >['onChangeStatus'] = useCallback(
    (file, status, files) => {
      onChange();
      inputFilesRef.current = files;
      if (changeCallback) {
        changeCallback(getCallbackFiles(files, preloadedFiles), name, true);
      }
    },
    [changeCallback, preloadedFiles, name, onChange],
  );

  maxFiles = maxFiles
    ? preloadedFiles
      ? maxFiles - preloadedFiles.length
      : maxFiles
    : undefined;
  const isDisabled = typeof disabled === 'function' ? disabled() : disabled;

  // reset on null
  useEffect(() => {
    if (value === undefined) {
      for (const file of inputFilesRef.current) {
        file.remove();
      }
      setPreloadedFiles([]);
    }
  }, [value]);

  return (
    <FileInputContext.Provider
      value={{
        preloadedFiles,
        deletePreloadedFile,
        hasChanged,
        filesName,
        disabled: isDisabled,
        submitting,
        name,
        required,
      }}
    >
      <Dropzone
        inputContent={inputContent}
        submitButtonContent={'Сохранить'}
        InputComponent={InputComponent as any}
        SubmitButtonComponent={SubmitButtonComponent as any}
        {...otherProps}
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={onSubmit && handleSubmit}
        canCancel={false}
        maxFiles={maxFiles}
        classNames={{preview: ''}}
        disabled={disabled}
      />
    </FileInputContext.Provider>
  );
};
GenericFileInput.defaultProps = {
  initialFiles: [],
  inputContent: 'Загрузить файл',
  maxSizeBytes: 1024 * 1024 * 4,
  required: false,
  disabled: false,
  maxFiles: 5,
} as Pick<
  FileInputProps,
  | 'initialFiles'
  | 'inputContent'
  | 'maxSizeBytes'
  | 'required'
  | 'disabled'
  | 'maxFiles'
>;

export default GenericFileInput;
