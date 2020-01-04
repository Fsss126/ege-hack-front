import React from "react";
import CoverImage from "components/common/CoverImage";
import {useInputCallback} from "../GenericFileInput";
import Button from "../../Button";

const InputPlaceholder = (props) => {
    const {
        className,
        style,
        getFilesFromEvent,
        accept,
        multiple,
        disabled,
        onFiles,
        files,
        content
    } = props;
    const onChange = useInputCallback(getFilesFromEvent, onFiles);
    return (
        <label className="image-input">
            <CoverImage className="poster-cover"/>
            <div className="image-input__controls">
                <Button
                    active={false}
                    icon={<i className="icon-add"/>}>
                    {content}
                </Button>
            </div>
            <input
                className={className}
                style={style}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={false}
                onChange={onChange}/>
        </label>
    )
};

export default InputPlaceholder;
