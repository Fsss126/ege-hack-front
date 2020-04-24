import React from 'react';

import GenericFileInput, {FileInputProps} from '../GenericFileInput';
import InputPlaceholder from './InputPlaceholder';
import Layout from './Layout';
import Preview from './Preview';

type defaultProps = typeof GenericFileInput.defaultProps;
const ImageInput: React.FC<React.Defaultize<FileInputProps, defaultProps>> = (
  props,
) => {
  return (
    <GenericFileInput
      {...props}
      inputContent="Загрузить фото"
      LayoutComponent={Layout}
      InputComponent={InputPlaceholder}
      PreviewComponent={Preview}
    />
  );
};

export default ImageInput;
