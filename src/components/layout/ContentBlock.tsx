import classNames from 'classnames';
import React from 'react';

interface ContentBlockProps {
  className?: string;
  title?: React.ReactNode;
  outerContent?: React.ReactNode;
  titleInside?: boolean;
  stacked?: boolean;
  transparent?: boolean;
}

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const {
    className,
    title,
    outerContent,
    stacked,
    transparent,
    children,
    titleInside,
  } = props;

  return (
    <>
      {title && !titleInside && (
        <div className="layout__content-block-title">
          <h3 className="content-block__title">{title}</h3>
        </div>
      )}
      {outerContent}
      {children && (
        <div
          className={classNames('layout__content-block', className, {
            'layout__content-block--stacked': stacked,
            'layout__content-block--transparent': transparent,
          })}
        >
          {title && titleInside && (
            <h3 className="content-block__title">{title}</h3>
          )}
          {children}
        </div>
      )}
    </>
  );
};
