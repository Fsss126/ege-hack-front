import React from "react";
import CoverImage from "components/common/CoverImage";
import {FileInputContext, useInputCallback} from "../GenericFileInput";
import {IInputProps} from "react-dropzone-uploader/dist/Dropzone";

const InputPlaceholder: React.FC<IInputProps> = (props) => {
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
    const {name, required} = React.useContext(FileInputContext);
    const onChange = useInputCallback(getFilesFromEvent, onFiles);
    return (
        <label className="image-input">
            <CoverImage className="poster-cover"/>
            <div className="image-input__controls">
                <i className="image-input__icon-camera fas fa-camera"/><i className="image-input__icon-add icon-add"/>
            </div>
            <input
                className={className}
                style={style}
                name={name}
                required={required}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={false}
                onChange={onChange}/>
        </label>
    )
};

export default InputPlaceholder;
