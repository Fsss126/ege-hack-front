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
import {useRevokeSubjects} from 'modules/subjects/subjects.hooks';
import React, {useCallback, useMemo, useRef} from 'react';
import {FileInfo, SubjectDtoReq} from 'types/dtos';
import {SubjectInfo} from 'types/entities';

type SubjectFormData = {
  name: string;
  image?: Nullable<FileInfo[]>;
  description: string;
};
const INITIAL_FORM_DATA: SubjectFormData = {
  name: '',
  description: '',
  image: undefined,
};

function getRequestData(formData: SubjectFormData): SubjectDtoReq {
  const {name, image, description} = formData;

  return {
    name,
    image: (image as FileInfo[])[0].file_id,
    description,
  };
}

type FormComponentProps = FormProps<SubjectInfo>;

export type SubjectFormProps = {
  title?: string;
  createRequest: (data: SubjectDtoReq) => Promise<SubjectInfo>;
  onSubmitted: SubmittedHandler<SubjectInfo>;
  errorMessage: string;
  cancelLink: FormComponentProps['cancelLink'];
  subject?: SubjectInfo;
};
const SubjectForm: React.FC<SubjectFormProps> = (props) => {
  const {title, createRequest, onSubmitted, errorMessage, cancelLink} = props;

  const formElementRef = useRef<HTMLFormElement>(null);

  const checkValidity = useFormValidityChecker<SubjectFormData>(
    formElementRef.current,
    (name, input, formData) => {
      if (name === 'image') {
        return !!(formData.image && !!formData.image[0]);
      }
    },
  );

  const {subject} = props;
  const {formData, isValid, onInputChange, reset} = useForm<SubjectFormData>(
    (state): SubjectFormData => {
      if (state || !subject) {
        return INITIAL_FORM_DATA;
      } else {
        const {image_link, id, description, ...otherData} = subject;

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
          description: description || '',
          ...otherData,
        };
      }
    },
    checkValidity,
  );

  const {name, image, description} = formData;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialImageFile = useMemo(() => formData.image || undefined, []);

  const onSubmit = useCallback<
    FormSubmitHandler<[undefined], Promise<SubjectInfo>>
  >(() => {
    return createRequest(getRequestData(formData));
  }, [formData, createRequest]);

  const revokeSubjects = useRevokeSubjects();

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

  return (
    <Form<SubjectInfo>
      title={title}
      ref={formElementRef}
      className="subject-form container p-0"
      isValid={isValid}
      reset={reset}
      onSubmit={onSubmit}
      onSubmitted={onSubmitted}
      onError={onError}
      revokeRelatedData={revokeSubjects}
      cancelLink={cancelLink}
    >
      <div className="row">
        <div className="preview-container col-12 col-md-auto">
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
          <Input.TextArea
            name="description"
            className="large"
            placeholder="Описание"
            value={description}
            onChange={onInputChange}
          />
        </FieldsContainer>
      </div>
    </Form>
  );
};

export default SubjectForm;
