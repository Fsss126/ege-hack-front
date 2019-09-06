import React from 'react';
import Truncate from 'react-truncate';

export default function CatalogItem(props) {
    const descriptionRef = React.useRef(null);
    const [isDOMLoaded, setDOMLoadedStatus] = React.useState(document.readyState === "complete");
    React.useEffect(() => {
        function handleResize() {
            if (descriptionRef.current) {
                console.log('resize', descriptionRef.current);
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
    }, []);
    const {preview, title, subtitle, description, children: actions, className} = props;
    return (
        <div className={`catalog__item container ${className || ''}`}>
            <div className="row">
                <div className="catalog__item-preview col-12 col-md-auto">
                    {preview}
                </div>
                <div className="catalog__item-description col">
                    <div className="catalog__item-description-inner">
                        <div className="title font-size-lg">{title}</div>
                        {subtitle && <div className="subtitle">{subtitle}</div>}
                        <div className="description-text-container font-size-xs">
                            <div className="description-text">
                                {isDOMLoaded ? (
                                    <Truncate lines={2} ref={descriptionRef}>
                                        {description}
                                    </Truncate>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
                {actions && <div className="catalog__item-actions col-auto">{actions}</div>}
            </div>
        </div>
    );
}
