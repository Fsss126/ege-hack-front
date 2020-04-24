import APIRequest from 'api';
import NavigationBlocker from 'components/common/NavigationBlocker';
import {FileInput} from 'components/ui/input';
import {InputSubmitCallback} from 'components/ui/input/file-input/GenericFileInput';
import React from 'react';
import {HomeworkInfo} from 'types/entities';

export type HomeworkLoaderProps = {
  homework: HomeworkInfo;
  deadline: Date;
  lessonId: number;
};
const HomeworkLoader: React.FC<HomeworkLoaderProps> = (props) => {
  const {homework, deadline, lessonId} = props;
  const isHomeworkSubmissionClosed = React.useCallback(
    () => deadline && new Date() >= deadline,
    [deadline],
  );
  const [hasChanges, setChanges] = React.useState(false);
  const onChange = React.useCallback((files, name, changed) => {
    console.log('files changed', changed, files);
    setChanges(changed);
  }, []);
  const onSubmit: InputSubmitCallback = React.useCallback(
    async (files) => {
      console.log('files submitted', files);
      const file = files && files[0] ? files[0].file_id : null;

      //TODO: add error alert
      return APIRequest({
        url: `/lessons/${lessonId}/homeworks/pupil`,
        method: file ? 'PUT' : 'DELETE',
        data: {
          file,
        },
      }).then(() => {
        console.log('loaded');
        setChanges(false);
      });
      // return Promise.resolve();
    },
    [lessonId, setChanges],
  );

  return (
    <div className="submission">
      {hasChanges && <NavigationBlocker />}
      <FileInput
        name="homework"
        maxFiles={1}
        // accept="image/*,audio/*,video/*"
        initialFiles={homework ? homework.files : undefined}
        onChange={onChange}
        onSubmit={onSubmit}
        disabled={isHomeworkSubmissionClosed}
      />
    </div>
  );
};

export default HomeworkLoader;
