import React from 'react';

import GenericFileInput, {FileInputProps} from '../GenericFileInput';
import InputButton from './InputButton';
import Layout from './Layout';
import Preview from './Preview';
import SubmitButton from './SubmitButton';

type defaultProps = typeof GenericFileInput.defaultProps;
const FileInput: React.FC<React.Defaultize<FileInputProps, defaultProps>> = (
  props,
) => {
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

export default FileInput;
