import React from "react";
import GenericFileInput, {FileInputProps} from "../GenericFileInput";
import SubmitButton from "./SubmitButton";
import Layout from "./Layout";
import InputButton from "./InputButton";
import Preview from "./Preview";

const FileInput: React.FC<FileInputProps> = (props) => {
    return (
        <GenericFileInput
            SubmitButtonComponent={SubmitButton}
            LayoutComponent={Layout}
            InputComponent={InputButton}
            PreviewComponent={Preview}
            {...props}/>);
};

export default FileInput;
