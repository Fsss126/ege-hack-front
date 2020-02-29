import React from "react";
import GenericFileInput, {FileInputProps} from "../GenericFileInput";
import Layout from "./Layout";
import Preview from "./Preview";
import InputPlaceholder from "./InputPlaceholder";

const ImageInput: React.FC<FileInputProps> = (props) => {
    return (
        <GenericFileInput
            {...props}
            inputContent="Загрузить фото"
            LayoutComponent={Layout}
            InputComponent={InputPlaceholder}
            PreviewComponent={Preview}/>);
};

export default ImageInput;
