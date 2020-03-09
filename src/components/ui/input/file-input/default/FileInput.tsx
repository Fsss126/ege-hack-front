import React from "react";
import GenericFileInput, {FileInputProps} from "../GenericFileInput";
import SubmitButton from "./SubmitButton";
import Layout from "./Layout";
import InputButton from "./InputButton";
import Preview from "./Preview";

type defaultProps = typeof GenericFileInput.defaultProps;
const FileInput: React.FC<React.Defaultize<FileInputProps, defaultProps>> = (props) => {
    return (
        <GenericFileInput
            SubmitButtonComponent={SubmitButton}
            LayoutComponent={Layout}
            InputComponent={InputButton}
            PreviewComponent={Preview}
            {...props}/>);
};

export default FileInput;
