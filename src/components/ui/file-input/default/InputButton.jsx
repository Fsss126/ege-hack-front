import React from "react";
import Button from "components/ui/Button";
import {useInputCallback} from "../GenericFileInput";

const InputButton = (props) => {
    const {
        className,
        style,
        getFilesFromEvent,
        accept,
        multiple,
        disabled,
        onFiles,
        files,
        content,
        extra: { maxFiles }
    } = props;
    const onChange = useInputCallback(getFilesFromEvent, onFiles);
    const isActive = files.length < maxFiles && !disabled;
    return (
        <Button
            tag="label"
            active={isActive}
            icon={<i className="icon-add"/>}>
            {content}
            <input
                className={className}
                style={style}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={!isActive}
                onChange={isActive ? onChange : null}/>
        </Button>
    );
};

export default InputButton;
