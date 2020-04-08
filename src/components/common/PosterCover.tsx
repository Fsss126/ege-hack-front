import classnames from 'classnames';
import React from 'react';

import CoverImage, {CoverImageProps} from './CoverImage';

export type PosterCoverProps = {
  online: boolean;
  showOnline: boolean;
  cover?: string;
  className?: string;
} & Omit<CoverImageProps, 'src'>;
const PosterCover: React.withDefaultProps<React.FC<PosterCoverProps>> = ({
  online,
  showOnline,
  cover,
  className,
  ...rest
}) => (
  <div className="poster-cover-container">
    {online && (
      <div
        className={classnames('poster-cover__online-badge', 'font-size-xs', {
          'poster-cover__online-text': showOnline,
        })}
      >
        <span>Онлайн</span>
      </div>
    )}
    <CoverImage
      {...rest}
      src={cover}
      className={classnames('poster-cover', className)}
    />
  </div>
);
PosterCover.defaultProps = {
  online: false,
  showOnline: true,
};

export default PosterCover;
