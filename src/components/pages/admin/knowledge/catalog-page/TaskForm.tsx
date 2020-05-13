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
  name: string;
  text: string;
  complexity: string;
  score: string;
  subject_id?: number;
  theme_id?: number;
  type: AnswerType;
  value: string;
  video_solution: string;
  text_solution: string;
};
const INITIAL_FORM_DATA: TaskFormData = {
  name: '',
  text: '',
  complexity: '',
  score: '1',
  value: '',
  video_solution: '',
  text_solution: '',
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
    name,
    text,
    complexity,
    score,
    subject_id,
    theme_id,
    type,
    value,
    video_solution,
    text_solution,
  } = formData;

  return {
    subject_id: subject_id as number,
    name,
    theme_id,
    image: image && image[0] ? image[0].file_id : undefined,
    text,
    complexity: parseFloat(complexity),
    score: parseFloat(score),
    answer:
      type === AnswerType.NUMBER
        ? {
            type,
            num_value: parseFloat(value),
          }
        : type === AnswerType.TEXT
        ? {type, text_value: value}
        : {type},
    solution: {
      video_value: video_solution,
      text_value: text_solution,
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

      if (name === 'video_solution') {
        const {video_solution} = formData;

        return video_solution ? getVideoLinkIsValid(video_solution) : undefined;
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
          formData.subject_id = passedSubjectId;
        }

        if (passedThemeId) {
          formData.theme_id = passedThemeId;
        }

        return formData;
      } else {
        const {
          name,
          text,
          image_link,
          score,
          complexity,
          subject_id,
          theme_id,
          answer: {value, video_solution, text_solution, type},
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
          score: score.toString(),
          complexity: complexity ? complexity.toString() : '',
          value: value ? value.toString() : '',
          video_solution: video_solution || '',
          text_solution: text_solution || '',
          type,
          name,
          text,
          subject_id,
          theme_id,
        };
      }
    },
    checkValidity,
  );

  const {
    name,
    image,
    text,
    complexity,
    score,
    subject_id,
    theme_id,
    type,
    value,
    video_solution,
    text_solution,
  } = formData;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialImageFile = useMemo(() => formData.image, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialVideoLink = useMemo(() => formData.video_solution, []);

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
    loadedNodeIds,
    loadData,
  } = useThemeSelect(subjects, subject_id, theme_id);

  const onSubjectChange = useCallback(
    (value: any, name: any) => {
      onInputChange(value, name);
      onInputChange(undefined, 'themeId');
    },
    [onInputChange],
  );

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
            name="subject_id"
            required
            placeholder="Предмет"
            options={subjectOptions}
            value={subject_id}
            isClearable={false}
            onChange={onSubjectChange}
          />
          <Input.TreeSelect<number, string>
            placeholder="Тема"
            name="theme_id"
            onChange={onInputChange}
            value={theme_id}
            treeDataSimpleMode
            treeData={themeTreeNodes}
            allowClear
            treeLoadedKeys={loadedNodeIds}
            loading={isLoading && !hasError}
            loadData={loadData as any}
            disabled={themeTreeNodes === undefined}
          />
          <Input.Input
            name="name"
            type="text"
            required
            placeholder="Название"
            value={name}
            onChange={onInputChange}
          />
          <Input.TextArea
            name="text"
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
                name="score"
                type="number"
                required
                min="0"
                max="10"
                placeholder="Вес"
                value={score}
                onChange={onInputChange}
              />
            </div>
            <div className="col">
              <Input.Input
                name="complexity"
                type="number"
                min="0"
                max="10"
                placeholder="Сложность"
                value={complexity}
                onChange={onInputChange}
              />
            </div>
          </div>
          <Input.TextArea
            name="text_solution"
            className="large"
            placeholder="Решение"
            value={text_solution}
            onChange={onInputChange}
          />
          <Input.Input
            name="video_solution"
            type="text"
            placeholder="Ссылка на видео решения"
            value={video_solution}
            onChange={onInputChange}
          />
          {video_solution && getVideoLinkIsValid(video_solution) && (
            <ExpandableContainer
              key={video_solution}
              toggleText="Видео"
              initiallyExpanded={video_solution !== initialVideoLink}
            >
              <VideoPlayer
                video_link={getVideoLink(getVideoId(video_solution))}
              />
            </ExpandableContainer>
          )}
        </FieldsContainer>
      </div>
    </Form>
  );
};

export default TaskForm;
