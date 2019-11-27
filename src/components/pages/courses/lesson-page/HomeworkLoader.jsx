import React from "react";
import FileInput from "components/ui/FileInput";
import APIRequest from "api";
import NavigationBlocker from "components/common/NavigationBlocker";
import {useHomework} from "store";

const HomeworkLoader = ({homework, deadline, lessonId}) => {
    const isHomeworkSubmissionClosed = React.useCallback(() => deadline && new Date() >= deadline, [deadline]);
    const [hasChanges, setChanges] = React.useState(false);
    const onChange = React.useCallback((files) => {
        console.log('files changed', files);
        setChanges(true);
    }, []);
    const onSubmit = React.useCallback(async (files) => {
        console.log('files submitted', files);
        const file = files[0] ? files[0].id_file_name : null;
        //TODO: add error alert
        return APIRequest({
            url: `/lessons/${lessonId}/homeworks/pupil`,
            method: file ? 'PUT' : 'DELETE',
            data: {
                file
            }
        }).then(() => {
            setChanges(false);
        });
        // return Promise.resolve();
    }, [homework, lessonId, setChanges]);
    return (
        <div className="submission">
            {hasChanges && <NavigationBlocker/>}
            <FileInput
                maxFiles={1}
                accept="image/*,audio/*,video/*"
                initialFiles={homework.files}
                onChange={onChange}
                onSubmit={onSubmit}
                isDisabled={isHomeworkSubmissionClosed}/>
        </div>
    );
};

export default HomeworkLoader;
