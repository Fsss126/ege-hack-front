import React from "react";
import {TransitionGroup} from "react-transition-group";
import StableCSSTransition from "components/common/StableCSSTransition";
import {File} from "../File";
import {FileInputContext, getFileProp} from "../GenericFileInput";

const Layout = ({input, previews=[], submitButton, dropzoneProps, files, extra: { maxFiles } }) => {
    const context = React.useContext(FileInputContext);
    const {preloadedFiles=[], deletePreloadedFile, disabled} = context || ({});
    const {ref} = dropzoneProps;
    return (
        <div
            ref={ref}
            className="file-input">
            <h4 className="file-input__files-title">Загруженные файлы</h4>
            <TransitionGroup className="file-container">
                {
                    preloadedFiles && (
                        preloadedFiles.map((file) => {
                                const {file_id} = file;
                                const deleteCallback = () => {deletePreloadedFile(file);};
                                return (
                                    <StableCSSTransition
                                        classNames="animation-fade"
                                        timeout={300}
                                        key={file_id}>
                                        <File
                                            file={getFileProp(file)}
                                            done={true}
                                            deletable={!disabled}
                                            onDelete={deleteCallback}/>
                                    </StableCSSTransition>
                                );
                            }
                        ))
                }
                {previews.map((preview) => (
                    <StableCSSTransition
                        classNames="animation-fade"
                        timeout={300}
                        key={preview.props.meta.id}>
                        {preview}
                    </StableCSSTransition>
                ))}
            </TransitionGroup>
            <div className="file-input__controls">
                {input}
                {submitButton}
            </div>
        </div>
    );
};

export default Layout;
