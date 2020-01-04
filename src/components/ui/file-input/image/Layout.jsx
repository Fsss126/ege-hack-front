import React from "react";
import _ from 'lodash';
import {ImageFile} from "../File";
import {FileInputContext, getFileProp} from "../GenericFileInput";

const Layout = ({input, previews = [], dropzoneProps, extra: { maxFiles } }) => {
    const context = React.useContext(FileInputContext);
    const {preloadedFiles = [], deletePreloadedFile, disabled} = context || ({});
    const {ref} = dropzoneProps;
    const placeholders = _.times(maxFiles - previews.length, () => input);
    return (
        <div
            ref={ref}
            className="image-input-container">
            {preloadedFiles.map(preloadedImage => {
                const deleteCallback = () => {deletePreloadedFile(preloadedImage);};
                return (
                    <ImageFile
                        file={getFileProp(preloadedImage)}
                        done={true}
                        deletable={!disabled}
                        onDelete={deleteCallback}/>
                );
            })}
            {previews}
            {placeholders}
        </div>
    );
};

export default Layout;
