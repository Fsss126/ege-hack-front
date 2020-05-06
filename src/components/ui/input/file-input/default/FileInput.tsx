import React from 'react';

import GenericFileInput, {
  FileInputProps as GenericFileInputProps,
} from '../GenericFileInput';
import InputButton from './InputButton';
import Layout from './Layout';
import Preview from './Preview';
import SubmitButton from './SubmitButton';

type defaultProps = typeof GenericFileInput.defaultProps;

interface FileInputProps
  extends React.Defaultize<GenericFileInputProps, defaultProps> {
  showUploadButtonWhenDisabled: boolean;
}

const FileInput = (props: FileInputProps) => {
  const {showUploadButtonWhenDisabled, disabled, ...rest} = props;
  const isDisabled =
    disabled && typeof disabled === 'function' ? disabled() : disabled;

  return (
    <GenericFileInput
      SubmitButtonComponent={SubmitButton}
      LayoutComponent={Layout}
      InputComponent={
        showUploadButtonWhenDisabled || !isDisabled ? InputButton : null
      }
      PreviewComponent={Preview}
      {...rest}
    />
  );
};
FileInput.defaultProps = {
  filesName: 'Загруженные файлы',
  showUploadButtonWhenDisabled: false,
} as Pick<FileInputProps, 'filesName' | 'showUploadButtonWhenDisabled'>;

export default FileInput;
