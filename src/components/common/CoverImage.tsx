import React from 'react';
import classnames from "classnames";

export type CoverImageProps = {
    src?: string;
    placeholder: boolean;
    className?: string;
    children?: React.ReactNode;
    square: boolean;
    round: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'placeholder'>;
const CoverImage: React.withDefaultProps<React.FC<CoverImageProps>> = (props: CoverImageProps): React.ReactElement => {
    const {src, placeholder, className, children, square, round, ...rest} = props;
    return (
        <div
            className={classnames('cover', className, {
                'square-cover': square,
                'round-cover': round
            })}
            {...rest}>
            {src || !placeholder
                ? <div
                    className="cover-img"
                    style={src ? ({backgroundImage: `url(${src})`}) : undefined}/>
                : <div className="cover-img cover-img--placeholder ph-item"/>}
            {children}
        </div>
    );
};
CoverImage.defaultProps = {
    placeholder: false,
    square: false,
    round: false
};

export default CoverImage;