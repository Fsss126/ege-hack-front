import React from "react";
import GenericFileInput from "../GenericFileInput";
import SubmitButton from "./SubmitButton";
import Layout from "./Layout";
import InputButton from "./InputButton";
import Preview from "./Preview";

const FileInput = (props) => {
    return (
        <GenericFileInput
            {...props}
            SubmitButtonComponent={SubmitButton}
            LayoutComponent={Layout}
            InputComponent={InputButton}
            PreviewComponent={Preview}/>);
};

export default FileInput;
