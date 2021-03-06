import classNames from 'classnames';
import React from 'react';

export type ListItemRenderProps<P extends object = {}> = P & {
  plain: boolean;
};

export type ListItemRenderer<T, P extends object = {}> = (
  item: T,
  renderProps: ListItemRenderProps<P>,
  index: number,
) => React.ReactElement;

export type ListProps<T, P extends object = {}> = {
  children: T[];
  renderItem: ListItemRenderer<T, P>;
  renderProps: P;
  flex?: boolean;
  className?: string;
  alignment?: string;
  plain: boolean;
  renderContent?: (
    children: React.ReactNode,
    items: React.ReactElement[],
  ) => React.ReactNode;
};
const List = <T, P extends object = {}>(
  props: ListProps<T, P>,
): React.ReactElement => {
  const {
    children,
    renderItem,
    renderProps,
    flex,
    className,
    alignment,
    plain,
    renderContent,
  } = props;
  const items = children.map((item, index) =>
    renderItem(item, {...renderProps, plain}, index),
  );
  const content = renderContent ? renderContent(children, items) : items;

  return flex ? (
    <div className={classNames('list', className)}>
      <div className="list__container container p-0 overflow-hidden">
        <div className={classNames('row', alignment)}>{content}</div>
      </div>
    </div>
  ) : (
    <div className={classNames('list', className)}>{content}</div>
  );
};

List.defaultProps = {
  // renderItem: (item: any, props: ListItemRenderProps, index: number): React.ReactElement => <ListItem {...item} {...props} key={index}/>,
  renderProps: {},
  plain: false,
};

export default List;
