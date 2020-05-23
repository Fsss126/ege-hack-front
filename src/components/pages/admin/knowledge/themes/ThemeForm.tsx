/* eslint-disable  no-restricted-globals */
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
import {OptionShape} from 'components/ui/input/Select';
import {useRevokeKnowledgeTheme} from 'modules/knowledge/knowledge.hooks';
import React, {useCallback, useMemo, useRef} from 'react';
import {ThemeDtoReq} from 'types/dtos';
import {SubjectInfo, ThemeInfo} from 'types/entities';

import {ThemeSelect} from './ThemeSelect';

type ThemeFormData = {
  name: string;
  subject_id?: number;
  parent_theme_id?: number;
};
const INITIAL_FORM_DATA: ThemeFormData = {
  name: '',
};

function getRequestData(formData: ThemeFormData): ThemeDtoReq {
  const {name, subject_id, parent_theme_id} = formData;

  return {
    name,
    subject_id: subject_id as number,
    parent_theme_id: parent_theme_id as number,
  };
}

type FormComponentProps = FormProps<ThemeInfo>;

export type CourseFormProps = {
  subjects: SubjectInfo[];
  title?: string;
  createRequest: (data: ThemeDtoReq) => Promise<ThemeInfo>;
  onSubmitted: SubmittedHandler<ThemeInfo>;
  errorMessage: string;
  cancelLink: FormComponentProps['cancelLink'];
  theme?: ThemeInfo;
  subjectId?: number;
  parentThemeId?: number;
};

export type SubjectOption = OptionShape<number>;

const ThemeForm: React.FC<CourseFormProps> = (props) => {
  const {
    subjects,
    title: formTitle,
    createRequest,
    onSubmitted,
    errorMessage,
    cancelLink,
    subjectId: passedSubjectId,
    parentThemeId: passedParentThemeId,
  } = props;

  const subjectOptions = useMemo<SubjectOption[]>(
    () => subjects.map(({id, name}) => ({value: id, label: name})),
    [subjects],
  );

  const formElementRef = useRef<HTMLFormElement>(null);

  const checkValidity = useFormValidityChecker<ThemeFormData>(
    formElementRef.current,
  );

  const {theme} = props;
  const {formData, isValid, onInputChange, reset} = useForm<ThemeFormData>(
    (state): ThemeFormData => {
      if (state || !theme) {
        const formData = {...INITIAL_FORM_DATA};

        if (passedSubjectId) {
          formData.subject_id = passedSubjectId;
        }

        if (passedParentThemeId) {
          formData.parent_theme_id = passedParentThemeId;
        }

        return formData;
      } else {
        const {name, subject_id, parent_theme_id} = theme;

        return {
          name,
          subject_id,
          parent_theme_id,
        };
      }
    },
    checkValidity,
  );

  const {name, subject_id, parent_theme_id} = formData;

  const onSubmit = useCallback<
    FormSubmitHandler<[undefined], Promise<ThemeInfo>>
  >(() => {
    return createRequest(getRequestData(formData));
  }, [formData, createRequest]);

  const revokeThemes = useRevokeKnowledgeTheme();

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

  const onSubjectChange = useCallback(
    (value: any, name: any) => {
      onInputChange(value, name);
      onInputChange(undefined, 'parent_theme_id');
    },
    [onInputChange],
  );

  return (
    <Form<ThemeInfo>
      title={formTitle}
      ref={formElementRef}
      className="theme-form container p-0"
      isValid={isValid}
      reset={reset}
      onSubmit={onSubmit}
      onSubmitted={onSubmitted}
      onError={onError}
      revokeRelatedData={revokeThemes}
      cancelLink={cancelLink}
    >
      <div className="row">
        <FieldsContainer className="col">
          <Input.Select
            name="subject_id"
            required
            placeholder="Предмет"
            options={subjectOptions}
            value={subject_id}
            isClearable={false}
            onChange={onSubjectChange}
          />
          <ThemeSelect
            subjectId={subject_id}
            placeholder="Родительская тема"
            name="parent_theme_id"
            onChange={onInputChange}
            value={parent_theme_id}
          />
          <Input.Input
            name="name"
            type="text"
            required
            placeholder="Название"
            value={name}
            onChange={onInputChange}
          />
        </FieldsContainer>
      </div>
    </Form>
  );
};

export default ThemeForm;
