import classNames from 'classnames';
import Link from 'components/ui/Link';
import {useTruncate} from 'hooks/common';
import React, {useCallback} from 'react';
import {LinkProps} from 'react-router-dom';
import Truncate from 'react-truncate';

export type ListItemClickHandler<T = any, P = {}> = (
  item: T,
  callbackProps: P,
) => void;

export type ListItemProps<T = any, P = undefined> = {
  preview: React.ReactChild;
  title: string;
  subtitle?: string;
  item: T;
  selectable: boolean;
  plain: boolean;
  className?: string;
  action?: React.ReactChild;
  link?: LinkProps['to'];
  onClick?: ListItemClickHandler<T, P>;
  onActionClick?: ListItemClickHandler<T, P>;
  noOnClickOnAction: boolean;
  callbackProps: P;
  children?: React.ReactNode;
} & (
  | {truncate: true; description?: string}
  | {truncate: false; description?: React.ReactNode}
);
const ListItem = <T extends {} = any, P = undefined>(
  props: ListItemProps<T, P>,
): React.ReactElement => {
  const {
    preview,
    title,
    subtitle,
    description,
    item,
    selectable,
    plain,
    className,
    action,
    link,
    truncate,
    onClick: clickCallback,
    onActionClick: actionCallback,
    noOnClickOnAction,
    callbackProps,
    children,
  } = props;
  const [descriptionRef, isFontLoaded] = useTruncate(
    typeof description === 'string' ? description : undefined,
  );
  const onClick = useCallback<React.MouseEventHandler<HTMLElement>>(
    (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }
      const clicked =
        selectable &&
        !(
          (actionCallback || noOnClickOnAction) &&
          event.target.closest('.list__item-action')
        );

      if (clicked && clickCallback) {
        clickCallback(item, callbackProps);
      } else if (!clicked && link) {
        event.preventDefault();
      }
    },
    [
      item,
      clickCallback,
      selectable,
      callbackProps,
      link,
      actionCallback,
      noOnClickOnAction,
    ],
  );
  const onActionClick = useCallback<
    React.MouseEventHandler<HTMLDivElement>
  >(() => {
    if (selectable && actionCallback) {
      actionCallback(item, callbackProps);
    }
  }, [item, actionCallback, selectable, callbackProps]);
  const content = (
    <div className="row align-items-center">
      <div
        className={classNames(
          'preview-container',
          plain ? 'col-auto' : 'adaptive col-12 col-md-auto',
          {
            miniature: plain,
          },
        )}
      >
        {preview}
      </div>
      <div className="list__item-description col align-self-stretch d-flex">
        <div className="list__item-description-inner">
          <div className="title">{title}</div>
          {subtitle && <div className="subtitle">{subtitle}</div>}
          {description && (
            <div className="description-container font-size-xs">
              <div className="description-block">
                {truncate ? (
                  isFontLoaded ? (
                    <Truncate lines={2} ref={descriptionRef}>
                      {description}
                    </Truncate>
                  ) : null
                ) : (
                  description
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {action && (
        <div
          className="list__item-action col-auto d-flex align-items-center flex-column"
          onClick={onActionClick}
        >
          {action}
        </div>
      )}
    </div>
  );
  const joinedClassname = classNames(
    'list__item',
    {
      'list__item-selectable': selectable,
      'list__item-plain': plain,
    },
    'container',
    className,
  );

  if (link) {
    return (
      <Link className={joinedClassname} to={link} onClick={onClick}>
        {content}
        {children}
      </Link>
    );
  } else {
    return (
      <div className={joinedClassname} onClick={onClick}>
        {content}
        {children}
      </div>
    );
  }
};
ListItem.defaultProps = {
  selectable: false,
  plain: false,
  truncate: true,
  noOnClickOnAction: false,
  callbackProps: undefined,
};

export default ListItem;
