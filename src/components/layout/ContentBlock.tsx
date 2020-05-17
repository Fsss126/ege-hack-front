import classNames from 'classnames';
import React from 'react';

export interface ContentBlockProps {
  className?: string;
  title?: React.ReactNode;
  outerContent?: React.ReactNode;
  titleInside?: boolean;
  titleBig?: boolean;
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
    titleBig,
  } = props;

  const titleElement =
    title &&
    (titleBig ? (
      <h2 className="content-block__title">{title}</h2>
    ) : (
      <h3 className="content-block__title">{title}</h3>
    ));

  return (
    <>
      {title && !titleInside && (
        <div className="layout__content-block-title">{titleElement}</div>
      )}
      {outerContent}
      <div
        className={classNames('layout__content-block', className, {
          'layout__content-block--stacked': stacked,
          'layout__content-block--transparent': transparent,
        })}
      >
        {title && titleInside && titleElement}
        {children}
      </div>
    </>
  );
};
