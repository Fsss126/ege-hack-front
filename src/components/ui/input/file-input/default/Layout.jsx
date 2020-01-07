import React from "react";
import {TransitionGroup} from "react-transition-group";
import StableCSSTransition from "components/common/StableCSSTransition";
import {File} from "../File";
import {FileInputContext} from "../GenericFileInput";

const Layout = ({input, previews=[], submitButton, dropzoneProps, files, extra: { maxFiles } }) => {
    const {preloadedFiles=[], deletePreloadedFile, disabled, filesName = "Загруженные файлы"} = React.useContext(FileInputContext);
    const {ref} = dropzoneProps;
    return (
        <div
            ref={ref}
            className="file-input">
            {filesName && <h4 className="file-input__files-title">{filesName}</h4>}
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
                                            file={file}
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
