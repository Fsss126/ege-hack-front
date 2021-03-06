import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

export type LoaderProps = {
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
};
const Loader: React.FC<LoaderProps> = ({children, isLoading, className}) => {
  return (
    <div
      className={classNames('loader', className, {
        loading: isLoading,
      })}
    >
      <div className="loader__loading-content">{children}</div>
    </div>
  );
};

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default Loader;
