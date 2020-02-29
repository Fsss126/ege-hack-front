import React from "react";
import _ from 'lodash';
import {ImageFile} from "../File";
import {FileInputContext} from "../GenericFileInput";
import {ILayoutProps} from "react-dropzone-uploader/dist/Dropzone";

const Layout: React.FC<ILayoutProps> = (props) => {
    const {input, previews = [], dropzoneProps, extra: { maxFiles } } = props;
    const context = React.useContext(FileInputContext);
    const {preloadedFiles = [], deletePreloadedFile, disabled} = context || ({});
    const {ref} = dropzoneProps;
    const placeholders = _.times(maxFiles - (previews?.length || 0), () => input);
    return (
        <div
            ref={ref}
            className="image-input-container">
            {preloadedFiles && (
                preloadedFiles.map(preloadedImage => {
                    const {file_id} = preloadedImage;
                    const deleteCallback = () => {deletePreloadedFile(preloadedImage);};
                    return (
                        <ImageFile
                            key={file_id}
                            file={preloadedImage}
                            done={true}
                            deletable={!disabled}
                            onDelete={deleteCallback}/>
                    );
                })
            )}
            {previews}
            {placeholders}
        </div>
    );
};

export default Layout;
