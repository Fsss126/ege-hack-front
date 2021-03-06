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
import _ from 'lodash';
import {useRevokeLessons} from 'modules/lessons/lessons.hooks';
import React, {useCallback, useMemo, useRef} from 'react';
import {FileInfo, HometaskDtoReq, LessonDtoReq} from 'types/dtos';
import {LessonInfo} from 'types/entities';

interface LessonFormData {
  name: string;
  num: string;
  image?: Nullable<FileInfo[]>;
  video_link: string;
  description: string;
  is_locked: boolean;
  attachments?: Nullable<FileInfo[]>;
  hometask_description: string;
  hometask_file?: FileInfo[] | null;
  hometask_deadline?: Date;
  test_id?: number;
}
const INITIAL_FORM_DATA: LessonFormData = {
  name: '',
  num: '',
  video_link: '',
  description: '',
  is_locked: false,
  hometask_description: '',
  test_id: undefined,
  image: null,
  attachments: undefined,
  hometask_file: null,
  hometask_deadline: undefined,
};

export function getVideoLinkIsValid(videoLink: string) {
  try {
    const url = new URL(videoLink);

    return url.hostname === 'vimeo.com' || url.hostname === 'player.vimeo.com';
  } catch (e) {
    return false;
  }
}

export function getVideoId(videoLink: string) {
  return videoLink.split('/').pop() as string;
}

function getRequestData(
  formData: LessonFormData,
  courseId: number,
): LessonDtoReq {
  const {
    name,
    image,
    num: numParam,
    video_link,
    description,
    is_locked,
    attachments,
    hometask_description,
    hometask_file,
    hometask_deadline,
    test_id,
  } = formData;
  const requestData: LessonDtoReq = {
    course_id: courseId,
    name,
    num: parseInt(numParam),
    description,
    is_locked,
    test_id,
    video_link: getVideoId(video_link),
    image: (image as FileInfo[])[0].file_id,
    attachments: [],
  };

  if (hometask_file || hometask_description) {
    const hometask: HometaskDtoReq = {
      description: hometask_description,
      deadline: (hometask_deadline as Date).getTime(),
    };

    if (hometask_file) {
      hometask.file = hometask_file[0].file_id;
    }
    requestData.hometask = hometask;
  }
  if (attachments) {
    requestData.attachments = attachments.map(({file_id}) => file_id);
  }
  return requestData;
}

type FormComponentProps = FormProps<LessonInfo>;

export type LessonFormProps = {
  courseId: number;
  title?: string;
  createRequest: (data: LessonDtoReq) => Promise<LessonInfo>;
  onSubmitted: SubmittedHandler<LessonInfo>;
  errorMessage: string;
  cancelLink: FormComponentProps['cancelLink'];
  lesson?: LessonInfo;
};

const LessonForm: React.FC<LessonFormProps> = (props) => {
  const {
    courseId,
    title,
    createRequest,
    onSubmitted,
    errorMessage,
    cancelLink,
  } = props;

  const formElementRef = useRef<HTMLFormElement>(null);

  const checkValidity = useFormValidityChecker<LessonFormData>(
    formElementRef.current,
    (name, input, formData) => {
      if (
        _.includes(
          [
            'attachments',
            'hometask_description',
            'hometask_file',
            'hometask_deadline',
            'test_id',
          ],
          name,
        )
      ) {
        return true;
      }
      if (name === 'image') {
        return !!(formData.image && formData.image[0]);
      } else if (name === 'video_link') {
        return getVideoLinkIsValid(formData.video_link);
      }
    },
  );

  const {lesson} = props;
  const {formData, isValid, onInputChange, reset} = useForm<LessonFormData>(
    (state): LessonFormData => {
      if (state || !lesson) {
        return INITIAL_FORM_DATA;
      } else {
        const {
          image_link,
          video_link,
          id,
          course_id,
          locked: is_locked,
          num,
          description,
          test_id,
          assignment: {
            deadline: hometask_deadline,
            description: hometask_description,
            files: hometask_file,
          } = {},
          ...otherData
        } = lesson;

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
          video_link: video_link || '',
          num: num.toString() || '',
          description: description || '',
          is_locked,
          hometask_deadline,
          hometask_description: hometask_description || '',
          hometask_file,
          test_id,
          ...otherData,
        };
      }
    },
    checkValidity,
  );

  const {
    name,
    num,
    image,
    video_link,
    description,
    is_locked,
    attachments,
    hometask_description,
    hometask_file,
    hometask_deadline,
  } = formData;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialImageFile = useMemo(() => formData.image || undefined, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialVideoLink = useMemo(() => formData.video_link, []);

  const revokeLessons = useRevokeLessons(courseId);

  const onSubmit = useCallback<
    FormSubmitHandler<[undefined], Promise<LessonInfo>>
  >(() => {
    return createRequest(getRequestData(formData, courseId));
  }, [formData, courseId, createRequest]);

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

  const modifiers = {start: hometask_deadline, end: hometask_deadline};

  return (
    <Form<LessonInfo>
      title={title}
      ref={formElementRef}
      className="lesson-form container p-0"
      isValid={isValid}
      reset={reset}
      revokeRelatedData={revokeLessons}
      onSubmit={onSubmit}
      onSubmitted={onSubmitted}
      onError={onError}
      cancelLink={cancelLink}
    >
      <div className="row">
        <div className="preview-container col-12 col-md-auto">
          <Input.ImageInput
            name="image"
            value={image}
            required
            maxFiles={1}
            initialFiles={initialImageFile || undefined}
            accept="image/*"
            onChange={onInputChange}
            maxSizeBytes={1024 * 1024}
          />
        </div>
        <FieldsContainer className="col">
          <Input.Input
            name="name"
            type="text"
            required
            placeholder="Название"
            value={name}
            onChange={onInputChange}
          />
          <Input.Input
            name="num"
            type="number"
            placeholder="Номер урока"
            value={num}
            onChange={onInputChange}
          />
          <Input.CheckBox
            name="is_locked"
            value={is_locked}
            label="Урок заблокирован"
            onChange={onInputChange}
          />
        </FieldsContainer>
      </div>
      <div className="row">
        <div className="form__fields col-12">
          <Input.Input
            name="video_link"
            type="text"
            required
            placeholder="Ссылка на видео"
            value={video_link}
            onChange={onInputChange}
          />
          {video_link && getVideoLinkIsValid(video_link) && (
            <ExpandableContainer
              key={video_link}
              toggleText="Видео"
              initiallyExpanded={video_link !== initialVideoLink}
            >
              <VideoPlayer video_link={getVideoLink(getVideoId(video_link))} />
            </ExpandableContainer>
          )}
          <Input.TextArea
            name="description"
            placeholder="Описание"
            value={description}
            onChange={onInputChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <Input.FileInput
            name="attachments"
            filesName="Материалы к уроку"
            value={attachments}
            maxFiles={10}
            maxSizeBytes={1024 * 1024 * 15}
            // accept="image/*,audio/*,video/*"
            initialFiles={lesson ? lesson.attachments : undefined}
            onChange={onInputChange}
          />
        </div>
      </div>
      <FieldsContainer className="row">
        <div className="col-12">
          <h4 className="file-input__files-title">Домашнее задание</h4>
        </div>
        <div className="col-12">
          <Input.TextArea
            name="hometask_description"
            placeholder="Описание"
            className="large"
            value={hometask_description}
            onChange={onInputChange}
          />
        </div>
        <div className="col-auto">
          <Input.DateInput
            value={hometask_deadline}
            placeholder="Дедлайн"
            dayPickerProps={{
              selectedDays: hometask_deadline,
              disabledDays: {before: new Date()},
              modifiers,
            }}
            name="hometask_deadline"
            clickUnselectsDay={true}
            onChange={onInputChange}
          />
        </div>
        <div className="col-auto">
          <Input.TimeInput
            name="hometask_deadline"
            disabled={!hometask_deadline}
            value={hometask_deadline}
            placeholder="Время"
            onChange={onInputChange}
          />
        </div>
        <div className="col-12">
          <Input.FileInput
            name="hometask_file"
            filesName={null}
            value={hometask_file}
            maxFiles={1}
            // accept="image/*,audio/*,video/*"
            maxSizeBytes={1024 * 1024 * 15}
            initialFiles={
              lesson && lesson.assignment && lesson.assignment.files
                ? lesson.assignment.files
                : undefined
            }
            onChange={onInputChange}
          />
        </div>
      </FieldsContainer>
    </Form>
  );
};

export default LessonForm;
