import CoverImage from 'components/common/CoverImage';
import {downloadFile} from 'definitions/helpers';
import React from 'react';
import {FileInfo} from 'types/dtos';
import {SimpleCallback} from 'types/utility/common';

import Button, {ButtonProps} from '../../Button';
import {LoadingIndicator, useLoadingState} from '../../LoadingIndicator';

type CommonFileProps = {
  file: Pick<FileInfo, 'file_name'> & Partial<FileInfo>;
  error: boolean;
  rejected: boolean;
  loading: number | null;
  done: boolean;
  deletable: boolean;
  onDelete?: SimpleCallback;
  onIndicatorClick?: SimpleCallback;
  className?: string;
  errorMessage?: string;
};

export type FileProps = CommonFileProps & Omit<ButtonProps, 'loading'>;

const DefaultFileProps: Partial<FileProps> = {
  rejected: false,
  done: true,
  deletable: false,
  loading: null,
};

export const File: React.withDefaultProps<React.FC<FileProps>> = (props) => {
  const {
    file: {file_name: name, file_link: url},
    error,
    rejected,
    loading,
    done,
    deletable,
    onDelete,
    onIndicatorClick,
    className,
    errorMessage,
    ...buttonProps
  } = props;
  const downloadCallback = React.useCallback(() => {
    if (url) {
      downloadFile(url, name);
    }
  }, [url, name]);
  const state = useLoadingState(
    loading !== null ? loading < 100 : null,
    done,
    rejected,
    !!error,
  );

  return (
    <div className={`file file-${state} ${className || ''}`}>
      <Button
        neutral
        className="file__btn"
        icon={
          deletable ? (
            <i className="icon-close file__action-btn file__delete-btn animated__action-button" />
          ) : (
            <i className="icon-download file__action-btn file__download-btn animated__action-button" />
          )
        }
        iconAction={deletable ? onDelete : undefined}
        onClick={downloadCallback}
        {...buttonProps}
      >
        {loading !== null && (
          <div
            className="file__loading-progress"
            style={{width: `${loading}%`}}
          />
        )}
        <i className="file__icon far fa-file" />
        <span className="file__name" title={name}>
          {name}
        </span>
      </Button>
      {loading !== null && (
        <LoadingIndicator
          onClick={onIndicatorClick}
          state={state}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
File.defaultProps = DefaultFileProps;

export type ImageFileProps = CommonFileProps;

export const ImageFile: React.withDefaultProps<React.FC<FileProps>> = (
  props,
) => {
  const {
    file: {file_name: name, file_link: url},
    error,
    rejected,
    loading,
    done,
    deletable,
    onDelete,
    onIndicatorClick,
    className,
    errorMessage,
  } = props;
  const downloadCallback = React.useCallback(
    (event) => {
      if (event.target.closest('.file__state-indicator, .file__action-btn')) {
        return;
      }
      if (url) {
        downloadFile(url, name);
      }
    },
    [url, name],
  );
  const state = useLoadingState(
    loading !== null ? loading < 100 : null,
    done,
    rejected,
    !!error,
  );

  return (
    <div className={`image-file file file-${state} ${className || ''}`}>
      <CoverImage src={url} className="poster-cover" onClick={downloadCallback}>
        <div className="image-file__overlay">
          {loading !== null && (
            <div
              className="file__loading-progress"
              style={{width: `${100 - loading}%`}}
            />
          )}
          {deletable && (
            <div className="file__action-btn file__delete-btn">
              <i onClick={onDelete} className="icon-close" />
            </div>
          )}
        </div>
      </CoverImage>
      {loading !== null && (
        <LoadingIndicator
          onClick={onIndicatorClick}
          state={state}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
ImageFile.defaultProps = DefaultFileProps;
