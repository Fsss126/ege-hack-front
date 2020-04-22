import classNames from 'classnames';
import {useToggle} from 'hooks/common';
import React, {useCallback} from 'react';

import Popup from '../ui/Popup';

export interface ImageViewerProps {
  className?: string;
  image: string;
}

interface ImageWrapperProps
  extends ImageViewerProps,
    React.ImgHTMLAttributes<HTMLImageElement> {
  expanded: boolean;
  onIconClick?: React.MouseEventHandler<HTMLDivElement>;
}

const ImageWrapper: React.FC<ImageWrapperProps> = (props) => {
  const {image, expanded, className, onIconClick, ...rest} = props;

  return (
    <div
      className={classNames(className, 'image-viewer__image-wrapper', {
        'image-viewer__expanded': expanded,
        'image-viewer__collapsed': !expanded,
      })}
    >
      <img className="image-viewer__image" src={image} {...rest} />
      <div
        className={classNames('image-viewer__expand-button', {
          'icon-collapse': expanded,
          'icon-expand': !expanded,
        })}
        onClick={onIconClick}
      />
    </div>
  );
};

export const ImageViewer: React.FC<ImageViewerProps> = (props) => {
  const {image, className} = props;
  const [isExpanded, toggleIsExpanded, setIsExpanded] = useToggle(false);
  const [isFullSize, toggleIsFullSize, setIsFullSize] = useToggle(false);

  const close = useCallback(() => {
    setIsExpanded(false);
    setIsFullSize(false);
  }, [setIsFullSize, setIsExpanded]);

  const handleToggleFullSize: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (event.currentTarget === event.target) {
        toggleIsFullSize();
      }
    },
    [toggleIsFullSize],
  );

  return (
    <>
      <ImageWrapper
        onClick={toggleIsExpanded}
        onIconClick={toggleIsExpanded}
        expanded={false}
        image={image}
        className={classNames(className, {
          invisible: isExpanded,
        })}
      />
      <Popup className="image-viewer-popup" opened={isExpanded} close={close}>
        <ImageWrapper
          onClick={handleToggleFullSize}
          onIconClick={close}
          className={classNames({
            'image-viewer__full-size': isFullSize,
          })}
          expanded={true}
          image={image}
        />
      </Popup>
    </>
  );
};
