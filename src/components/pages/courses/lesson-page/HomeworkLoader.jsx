import React from "react";
import FileInput from "components/ui/FileInput";
import APIRequest from "definitions/api";
import NavigationBlocker from "components/ui/NavigationBlocker";

const HomeworkLoader = ({homework, lessonId}) => {
    const isHomeworkSubmissionClosed = React.useCallback(() => homework.deadline && new Date() >= homework.deadline, [homework]);
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
            url: `/lessons/${lessonId}/homeworks/`,
            method: file ? (homework.submittedFiles ? 'PUT' : 'POST') : 'DELETE',
            data: {
                file
            }
        });
    }, [homework, lessonId]);
    return (
        <div className="submission">
            {hasChanges && <NavigationBlocker/>}
            <FileInput
                maxFiles={1}
                accept="image/*,audio/*,video/*"
                initialFiles={homework.submittedFiles}
                onChange={onChange}
                onSubmit={onSubmit}
                isDisabled={isHomeworkSubmissionClosed}/>
        </div>
    );
};

export default HomeworkLoader;
