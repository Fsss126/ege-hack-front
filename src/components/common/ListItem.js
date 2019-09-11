import React from 'react';
import Truncate from 'react-truncate';

export default function ListItem(props) {
    const {preview, title, subtitle, description, item, children: actions, className, onClick: clickCallback} = props;
    const descriptionRef = React.useRef(null);
    const [isDOMLoaded, setDOMLoadedStatus] = React.useState(document.readyState === "complete");
    React.useEffect(() => {
        if (!description)
            return;
        function handleResize() {
            if (descriptionRef.current) {
                descriptionRef.current.onResize();
            }
        }
        window.addEventListener('resize', handleResize);
        if (isDOMLoaded)
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        if (document.readyState === "complete") {
            setDOMLoadedStatus(true);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
        else {
            function handleLoading() {
                setDOMLoadedStatus(true);
            }
            window.addEventListener('load', handleLoading);
            return () => {
                window.removeEventListener('load', handleLoading);
            };
        }
    }, [isDOMLoaded, description]);
    const onClick = React.useCallback((event) => {
        if (clickCallback && event.target.closest('.list__item'))
            clickCallback(item);
    }, [item, clickCallback]);
    return (
        <div className={`list__item container ${className || ''}`} onClick={onClick}>
            <div className="row">
                <div className="list__item-preview col-12 col-md-auto">
                    {preview}
                </div>
                <div className="list__item-description col">
                    <div className="list__item-description-inner">
                        <div className="title font-size-lg">{title}</div>
                        {subtitle && <div className="subtitle">{subtitle}</div>}
                        {description && (
                            <div className="description-text-container font-size-xs">
                                <div className="description-text">
                                    {isDOMLoaded ? (
                                        <Truncate lines={2} ref={descriptionRef}>
                                            {description}
                                        </Truncate>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {actions && (
                    <div className="list__item-actions col-auto d-flex align-items-center justify-content-center flex-column">
                        {actions}
                    </div>
                )}
                {/*<div className="col d-flex">*/}
                {/*    <div className="row flex-fill">*/}
                {/*        */}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}
