import classNames from 'classnames';
import Button from 'components/ui/Button';
import {useToggle} from 'hooks/common';
import React from 'react';

interface ExpandableContainerProps {
  initiallyExpanded: boolean;
  children: React.ReactNode;
  toggleText: string;
  className?: string;
}

export const ExpandableContainer = (
  props: ExpandableContainerProps,
): React.ReactElement => {
  const {initiallyExpanded, className, toggleText, children} = props;

  const [isExpanded, toggleIsExpanded] = useToggle(initiallyExpanded);

  return (
    <div
      className={classNames(className, 'expandable-container', {
        'expandable-container--expanded': isExpanded,
      })}
    >
      <Button
        neutral
        className="expandable-container__toggle d-inline-block"
        onClick={toggleIsExpanded}
        after={<i className="icon-angle-down" />}
      >
        {toggleText}
      </Button>
      <div className="expandable-container__body">
        <div className="expandable-container__body-inner">{children}</div>
      </div>
    </div>
  );
};
ExpandableContainer.defaultProps = {
  initiallyExpanded: false,
};
