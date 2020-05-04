import React from 'react';
import {BasicAccountInfo} from 'types/entities';

import CoverImage from './CoverImage';
import ListItem, {ListItemProps} from './ListItem';

export type AccountProps<P = undefined> = {
  account: BasicAccountInfo;
} & Omit<
  React.Defaultize<
    ListItemProps<BasicAccountInfo, P>,
    typeof ListItem.defaultProps
  >,
  'item' | 'preview' | 'title'
>;

export const Account = <P extends any = undefined>(
  props: AccountProps<P>,
): React.ReactElement => {
  const {account, truncate, description, ...restProps} = props;
  const {
    id,
    vk_info: {first_name, last_name, photo},
    contacts: {vk},
  } = account;

  return (
    <ListItem<BasicAccountInfo, P>
      key={id}
      item={account}
      className="user"
      title={`${last_name} ${first_name}`}
      preview={<CoverImage src={photo} round />}
      link={vk}
      truncate={truncate ? undefined : truncate}
      description={description}
      {...restProps}
    />
  );
};
