import React from "react";
import GenericFileInput, {FileInputProps} from "../GenericFileInput";
import Layout from "./Layout";
import Preview from "./Preview";
import InputPlaceholder from "./InputPlaceholder";

type defaultProps = typeof GenericFileInput.defaultProps;
const ImageInput: React.FC<React.Defaultize<FileInputProps, defaultProps>> = (props) => {
    return (
        <GenericFileInput
            {...props}
            inputContent="Загрузить фото"
            LayoutComponent={Layout}
            InputComponent={InputPlaceholder}
            PreviewComponent={Preview}/>);
};

export default ImageInput;
