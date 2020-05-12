/* eslint-disable  no-restricted-globals */
import {useHandleErrors} from 'components/layout/Page';
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
import {SimpleDataNode} from 'components/ui/input/TreeSelect';
import {
  useKnowledgeLevelFetch,
  useKnowledgeSubjectThemes,
  useKnowledgeTheme,
  useRevokeKnowledgeTheme,
} from 'hooks/selectors';
import React, {useCallback, useMemo, useRef} from 'react';
import {ThemeDtoReq} from 'types/dtos';
import {SubjectInfo, ThemeInfo} from 'types/entities';
import {Deferred} from 'utils/promiseHelper';

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

export type ThemeTreeNode = Require<
  SimpleDataNode<number, string>,
  'rootPId'
> & {
  themeId: number;
  parentThemeId?: number;
  subjectId: number;
};

export const mapSubjectsToOptions = ({
  id,
  name,
}: SubjectInfo): SubjectOption => ({
  value: id,
  label: name,
});

export const mapThemesToNodes = ({
  id,
  parent_theme_id,
  subject_id,
  has_sub_themes,
  has_sub_tasks,
  name,
}: ThemeInfo): ThemeTreeNode => ({
  id: `1.theme.${id}`,
  value: id,
  pId: `1.theme.${parent_theme_id}`,
  rootPId: `subject.${subject_id}`,
  title: name,
  themeId: id,
  parentThemeId: parent_theme_id,
  subjectId: subject_id,
  isLeaf: !has_sub_themes && !has_sub_tasks,
});

export function useLoadThemeLevel() {
  const fetchThemes = useKnowledgeLevelFetch();

  return useCallback(
    (treeNode: ThemeTreeNode): Promise<unknown> => {
      const deferred = new Deferred();
      const {subjectId, themeId} = treeNode;

      fetchThemes(subjectId, themeId, deferred.resolve, deferred.reject);

      return deferred.promise;
    },
    [fetchThemes],
  );
}

export function useThemeSelect(
  subjects: SubjectInfo[],
  subject_id?: number,
  themeId?: number,
) {
  const {
    themes,
    error: errorLoadingRootThemes,
    reload: reloadRootThemes,
  } = useKnowledgeSubjectThemes(subject_id);
  const {
    theme,
    error: errorLoadingTheme,
    reload: reloadTheme,
  } = useKnowledgeTheme(subject_id, themeId);

  const isLoading =
    subject_id !== undefined && (!themes || (themeId !== undefined && !theme));

  const errors = [errorLoadingRootThemes, errorLoadingTheme];
  const reloadCallbacks = [reloadRootThemes, reloadTheme];

  const {hasError, notFound} = useHandleErrors(errors, reloadCallbacks);

  const subjectOptions = useMemo<SubjectOption[]>(
    () => subjects.map(mapSubjectsToOptions),
    [subjects],
  );
  const themeTreeNodes = useMemo<ThemeTreeNode[] | undefined>(() => {
    let themesNodes = themes ? themes.map(mapThemesToNodes) : [];
    const themeNode = theme ? mapThemesToNodes(theme) : [];

    themesNodes = _.uniqBy(_.concat(themesNodes, themeNode), 'id');

    return isLoading ? undefined : themesNodes;
  }, [isLoading, theme, themes]);

  const loadData = useLoadThemeLevel();

  return {
    hasError,
    notFound,
    isLoading,
    subjectOptions,
    themeTreeNodes,
    loadData,
    errors,
    reloadCallbacks,
  };
}

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

  const {
    hasError,
    isLoading,
    subjectOptions,
    themeTreeNodes,
    loadData,
  } = useThemeSelect(subjects, subject_id, parent_theme_id);

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
          <Input.TreeSelect<number, string>
            placeholder="Родительская тема"
            name="parent_theme_id"
            onChange={onInputChange}
            value={parent_theme_id}
            treeDataSimpleMode
            treeData={themeTreeNodes}
            allowClear
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
        </FieldsContainer>
      </div>
    </Form>
  );
};

export default ThemeForm;
