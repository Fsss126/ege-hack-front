import React from "react";
import APIRequest from "api";
import NavigationBlocker from "components/common/NavigationBlocker";
import {FileInput} from "components/ui/file-input";

const HomeworkLoader = ({homework, deadline, lessonId}) => {
    const isHomeworkSubmissionClosed = React.useCallback(() => deadline && new Date() >= deadline, [deadline]);
    const [hasChanges, setChanges] = React.useState(false);
    const onChange = React.useCallback((changed, files) => {
        console.log('files changed', changed, files);
        setChanges(changed);
    }, []);
    const onSubmit = React.useCallback(async (files) => {
        console.log('files submitted', files);
        const file = files[0] ? files[0].file_id : null;
        //TODO: add error alert
        return APIRequest({
            url: `/lessons/${lessonId}/homeworks/pupil`,
            method: file ? 'PUT' : 'DELETE',
            data: {
                file
            }
        }).then(() => {
            console.log('loaded');
            setChanges(false);
        });
        // return Promise.resolve();
    }, [lessonId, setChanges]);
    return (
        <div className="submission">
            {hasChanges && <NavigationBlocker/>}
            <FileInput
                maxFiles={1}
                // accept="image/*,audio/*,video/*"
                initialFiles={homework.files}
                onChange={onChange}
                onSubmit={onSubmit}
                isDisabled={isHomeworkSubmissionClosed}/>
        </div>
    );
};

export default HomeworkLoader;
