/* eslint-disable  no-restricted-globals */
import {getVideoLink} from 'api/transforms';
import {ExpandableContainer} from 'components/common/ExpandableContainer';
import VideoPlayer from 'components/common/VideoPlayer';
import Form, {
  ErrorHandler,
  FormProps,
  FormSubmitHandler,
  SubmittedHandler,
  useForm,
  useFormValidityChecker,
} from 'components/ui/Form';
import FieldsContainer from 'components/ui/form/FieldsContainer';
import * as Input from 'components/ui/input';
import {InputContainer} from 'components/ui/input/InputContainer';
import {OptionShape} from 'components/ui/input/Select';
import {useRevokeKnowledgeTask} from 'hooks/selectors';
import React, {useCallback, useMemo, useRef} from 'react';
import {AnswerType, FileInfo, TaskDtoReq} from 'types/dtos';
import {SubjectInfo, TaskInfo} from 'types/entities';

import {
  getVideoId,
  getVideoLinkIsValid,
} from '../../courses/course-page/lessons/LessonForm';
import {useThemeSelect} from './ThemeForm';

type TaskFormData = {
  image?: FileInfo[];
  text: string;
  complexity: string;
  weight: string;
  subjectId?: number;
  themeId?: number;
  type: AnswerType;
  value: string;
  videoSolution: string;
  textSolution: string;
};
const INITIAL_FORM_DATA: TaskFormData = {
  text: '',
  complexity: '',
  weight: '1',
  value: '',
  videoSolution: '',
  textSolution: '',
  type: AnswerType.TEXT,
};

const typeOptions: OptionShape<AnswerType>[] = [
  {value: AnswerType.FILE, label: 'Файл'},
  {value: AnswerType.NUMBER, label: 'Число'},
  {value: AnswerType.TEXT, label: 'Текст'},
];

function getRequestData(formData: TaskFormData): TaskDtoReq {
  const {
    image,
    text,
    complexity,
    weight,
    subjectId,
    themeId,
    type,
    value,
    videoSolution,
    textSolution,
  } = formData;

  return {
    subjectId: subjectId as number,
    themeId,
    image: image && image[0] ? image[0].file_id : undefined,
    text,
    complexity: parseFloat(complexity),
    weight: parseFloat(weight),
    answer: {
      type: type as AnswerType,
      value,
      videoSolution,
      textSolution,
    },
  };
}

type FormComponentProps = FormProps<TaskInfo>;

export type TaskFormProps = {
  subjects: SubjectInfo[];
  title?: string;
  createRequest: (data: TaskDtoReq) => Promise<TaskInfo>;
  onSubmitted: SubmittedHandler<TaskInfo>;
  errorMessage: string;
  cancelLink: FormComponentProps['cancelLink'];
  task?: TaskInfo;
  subjectId?: number;
  parentThemeId?: number;
};

const TaskForm: React.FC<TaskFormProps> = (props) => {
  const {
    subjects,
    title: formTitle,
    createRequest,
    onSubmitted,
    errorMessage,
    cancelLink,
    subjectId: passedSubjectId,
    parentThemeId: passedThemeId,
  } = props;

  const formElementRef = useRef<HTMLFormElement>(null);

  const checkValidity = useFormValidityChecker<TaskFormData>(
    formElementRef.current,
    (name, input, formData) => {
      if (name === 'image') {
        return formData.image && !!formData.image[0];
      }

      if (name === 'videoSolution') {
        const {videoSolution} = formData;

        return videoSolution ? getVideoLinkIsValid(videoSolution) : undefined;
      }

      if (name === 'value') {
        const {type} = formData;

        if (type === AnswerType.FILE) {
          return true;
        }

        return undefined;
      }
    },
  );

  const {task} = props;
  const {formData, isValid, onInputChange, reset} = useForm<TaskFormData>(
    (state): TaskFormData => {
      if (state || !task) {
        const formData = {...INITIAL_FORM_DATA};

        if (passedSubjectId) {
          formData.subjectId = passedSubjectId;
        }

        if (passedThemeId) {
          formData.themeId = passedThemeId;
        }

        return formData;
      } else {
        const {
          image_link,
          id,
          weight,
          complexity,
          answer: {value, videoSolution, textSolution, ...answer},
          ...otherData
        } = task;

        return {
          image: image_link
            ? [
                {
                  file_id: image_link.split('/').pop() as string,
                  file_link: image_link,
                  file_name: image_link,
                },
              ]
            : undefined,
          weight: weight.toString(),
          complexity: complexity ? complexity.toString() : '',
          value: value ? value.toString() : '',
          videoSolution: videoSolution || '',
          textSolution: textSolution || '',
          ...answer,
          ...otherData,
        };
      }
    },
    checkValidity,
  );

  const {
    image,
    text,
    complexity,
    weight,
    subjectId,
    themeId,
    type,
    value,
    videoSolution,
    textSolution,
  } = formData;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialImageFile = useMemo(() => formData.image, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialVideoLink = useMemo(() => formData.videoSolution, []);

  const onSubmit = useCallback<
    FormSubmitHandler<[undefined], Promise<TaskInfo>>
  >(() => {
    return createRequest(getRequestData(formData));
  }, [formData, createRequest]);

  const revokeTask = useRevokeKnowledgeTask();

  const onError = useCallback<ErrorHandler>(
    (error, showErrorMessage, reloadCallback) => {
      showErrorMessage(errorMessage, [
        {
          text: 'Закрыть',
        },
        {
          text: 'Заново',
          action: reloadCallback,
        },
      ]);
    },
    [errorMessage],
  );

  const {
    hasError,
    isLoading,
    subjectOptions,
    themeTreeNodes,
    loadData,
    onSubjectChange,
  } = useThemeSelect(subjects, onInputChange, subjectId, themeId);

  const onTypeChange = useCallback(
    (value: any, name: any) => {
      onInputChange(value, name);
      onInputChange('', 'value');
    },
    [onInputChange],
  );

  return (
    <Form<TaskInfo>
      title={formTitle}
      ref={formElementRef}
      className="task-form container p-0"
      isValid={isValid}
      reset={reset}
      onSubmit={onSubmit}
      onSubmitted={onSubmitted}
      onError={onError}
      revokeRelatedData={revokeTask}
      cancelLink={cancelLink}
    >
      <div className="row">
        <FieldsContainer className="col-12">
          <Input.Select
            name="subjectId"
            required
            placeholder="Предмет"
            options={subjectOptions}
            value={subjectId}
            isClearable={false}
            onChange={onSubjectChange}
          />
          <Input.TreeSelect<number, number>
            placeholder="Тема"
            name="themeId"
            onChange={onInputChange}
            value={themeId}
            treeDataSimpleMode
            treeData={themeTreeNodes}
            allowClear
            loading={isLoading && !hasError}
            loadData={loadData as any}
            disabled={themeTreeNodes === undefined}
          />
          <Input.Input
            name="text"
            type="text"
            required
            placeholder="Текст задания"
            value={text}
            onChange={onInputChange}
          />
          <Input.Select
            name="type"
            required
            placeholder="Тип ответа"
            options={typeOptions}
            value={type}
            isClearable={false}
            onChange={onTypeChange}
          />
          {type !== AnswerType.FILE && (
            <Input.Input
              name="value"
              required
              placeholder="Ответ"
              value={value}
              onChange={onInputChange}
            />
          )}
          <div className="row">
            <div className="preview-container col-12 col-md-auto">
              <InputContainer placeholder="Рисунок">
                <Input.ImageInput
                  name="image"
                  required
                  value={image}
                  maxFiles={1}
                  initialFiles={initialImageFile}
                  accept="image/*"
                  onChange={onInputChange}
                  maxSizeBytes={1024 * 1024}
                />
              </InputContainer>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Input.Input
                name="weight"
                type="number"
                required
                placeholder="Вес"
                value={weight}
                onChange={onInputChange}
              />
            </div>
            <div className="col">
              <Input.Input
                name="complexity"
                type="number"
                placeholder="Сложность"
                value={complexity}
                onChange={onInputChange}
              />
            </div>
          </div>
          <Input.TextArea
            name="textSolution"
            className="large"
            placeholder="Решение"
            value={textSolution}
            onChange={onInputChange}
          />
          <Input.Input
            name="videoSolution"
            type="text"
            placeholder="Ссылка на видео решения"
            value={videoSolution}
            onChange={onInputChange}
          />
          {videoSolution && getVideoLinkIsValid(videoSolution) && (
            <ExpandableContainer
              key={videoSolution}
              toggleText="Видео"
              initiallyExpanded={videoSolution !== initialVideoLink}
            >
              <VideoPlayer
                video_link={getVideoLink(getVideoId(videoSolution))}
              />
            </ExpandableContainer>
          )}
        </FieldsContainer>
      </div>
    </Form>
  );
};

export default TaskForm;
