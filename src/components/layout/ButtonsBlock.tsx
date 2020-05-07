import classNames from 'classnames';
import ScrollContainer from 'components/common/ScrollContainer';
import React from 'react';

import {ContentBlock, ContentBlockProps} from './ContentBlock';

export interface ButtonsBlockProps extends ContentBlockProps {
  innerClassName?: string;
}

export const ButtonsBlock: React.FC<ButtonsBlockProps> = (props) => {
  const {children, className, innerClassName, ...rest} = props;

  return (
    <ContentBlock className={classNames('btn-container', className)} {...rest}>
      <ScrollContainer>
        <div className={classNames('btn-container__inner', innerClassName)}>
          {children}
        </div>
      </ScrollContainer>
    </ContentBlock>
  );
};
