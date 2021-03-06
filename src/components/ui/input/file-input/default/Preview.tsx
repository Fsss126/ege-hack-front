import React from 'react';
import {IPreviewProps} from 'react-dropzone-uploader';

import {File} from '../File';
import {usePreviewState} from '../GenericFileInput';

const Preview: React.FC<IPreviewProps> = (props) => {
  const {fileWithMeta, meta, isUpload, canRemove, className} = props;
  const {
    file,
    loading,
    isDone,
    isRejected,
    hasError,
    errorMessage,
    deleteCallback,
    action,
  } = usePreviewState(fileWithMeta, meta, isUpload);

  return (
    <File
      file={file}
      loading={loading}
      className={className}
      done={isDone}
      rejected={isRejected}
      error={hasError}
      errorMessage={errorMessage}
      deletable={canRemove}
      onDelete={deleteCallback}
      onIndicatorClick={action}
    />
  );
};

export default Preview;
