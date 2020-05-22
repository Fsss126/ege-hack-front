import APIRequest from 'api';
import NavigationBlocker from 'components/common/NavigationBlocker';
import {FileInput} from 'components/ui/input';
import {InputSubmitCallback} from 'components/ui/input/file-input/GenericFileInput';
import {useRevokeUserHomework} from 'hooks/selectors';
import React from 'react';
import {HomeworkInfo, UserHomeworkInfo} from 'types/entities';

export type HomeworkLoaderProps = {
  homework: UserHomeworkInfo | null;
  deadline?: Date;
  courseId: number;
  lessonId: number;
};
const HomeworkLoader: React.FC<HomeworkLoaderProps> = (props) => {
  const {homework, deadline, courseId, lessonId} = props;
  const isHomeworkSubmissionClosed = React.useCallback(
    () => !!(deadline && new Date() >= deadline),
    [deadline],
  );
  const [hasChanges, setChanges] = React.useState(false);
  const onChange = React.useCallback((files, name, changed) => {
    setChanges(changed);
  }, []);

  const revokeUserHomework = useRevokeUserHomework(courseId, lessonId);

  const onSubmit: InputSubmitCallback = React.useCallback(
    async (files) => {
      const file = files && files[0] ? files[0].file_id : null;

      const responseHomework: HomeworkInfo = (await APIRequest({
        url: `/lessons/${lessonId}/homeworks/pupil`,
        method: file ? 'PUT' : 'DELETE',
        data: {
          file,
        },
      })) as any;

      setChanges(false);
      revokeUserHomework(responseHomework);
    },
    [lessonId, revokeUserHomework],
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
        filesName="Решение"
      />
      {isHomeworkSubmissionClosed() && (!homework || !homework.files) && (
        <div className="description-block">Решение не отправлено</div>
      )}
    </div>
  );
};

export default HomeworkLoader;
