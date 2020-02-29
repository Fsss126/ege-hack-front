import React from "react";
import Button from "components/ui/Button";
import {FileInputContext, useInputCallback} from "../GenericFileInput";
import { IInputProps } from "react-dropzone-uploader";

const InputButton: React.FC<IInputProps> = (props) => {
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
    const {name, required} = React.useContext(FileInputContext);
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
                name={name}
                required={required}
                accept={accept}
                multiple={multiple}
                disabled={!isActive}
                onChange={isActive ? onChange : undefined}/>
        </Button>
    );
};

export default InputButton;
