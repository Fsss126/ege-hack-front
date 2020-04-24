import StableCSSTransition from 'components/common/StableCSSTransition';
import React from 'react';
import {ILayoutProps, IPreviewProps} from 'react-dropzone-uploader';
import {TransitionGroup} from 'react-transition-group';

import {File} from '../File';
import {FileInputContext} from '../GenericFileInput';

const Layout: React.FC<ILayoutProps> = (props) => {
  const {input, previews, submitButton, dropzoneProps} = props;
  const {
    preloadedFiles,
    deletePreloadedFile,
    disabled,
    filesName,
  } = React.useContext(FileInputContext);
  const {ref} = dropzoneProps;

  return (
    <div ref={ref} className="file-input">
      {filesName && <h4 className="file-input__files-title">{filesName}</h4>}
      <TransitionGroup className="file-container">
        {preloadedFiles &&
          preloadedFiles.map((file) => {
            const {file_id} = file;
            const deleteCallback = () => {
              deletePreloadedFile(file);
            };

            return (
              <StableCSSTransition
                classNames="animation-fade"
                timeout={300}
                key={file_id}
              >
                <File
                  file={file}
                  done={true}
                  deletable={!disabled}
                  onDelete={deleteCallback}
                />
              </StableCSSTransition>
            );
          })}
        {(previews as React.ReactElement<IPreviewProps>[] | null)?.map(
          (preview: React.ReactElement<IPreviewProps>) => (
            <StableCSSTransition
              classNames="animation-fade"
              timeout={300}
              key={preview.props.meta.id}
            >
              {preview}
            </StableCSSTransition>
          ),
        )}
      </TransitionGroup>
      <div className="file-input__controls">
        {input}
        {submitButton}
      </div>
    </div>
  );
};

export default Layout;
