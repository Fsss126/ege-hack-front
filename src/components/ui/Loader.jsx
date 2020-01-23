import React from "react";
import classnames from 'classnames';
import PropTypes from "prop-types";

const Loader = ({children, isLoading, className}) => {
    return (
        <div className={classnames('loader', className, {
            'loading': isLoading
        })}>
            <div className="loader__loading-content">
                {children}
            </div>
        </div>
    )
};

Loader.propTypes = {
    isLoading: PropTypes.bool.isRequired
};

export default Loader;
