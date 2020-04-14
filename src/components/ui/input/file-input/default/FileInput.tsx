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
  extends React.Defaultize<GenericFileInputProps, defaultProps> {}

const FileInput: React.FC<FileInputProps> = (props) => {
  return (
    <GenericFileInput
      SubmitButtonComponent={SubmitButton}
      LayoutComponent={Layout}
      InputComponent={InputButton}
      PreviewComponent={Preview}
      {...props}
    />
  );
};
FileInput.defaultProps = {
  filesName: 'Загруженные файлы',
};

export default FileInput;
