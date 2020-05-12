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
  title: string;
  subjectId?: number;
  parentThemeId?: number;
};
const INITIAL_FORM_DATA: ThemeFormData = {
  title: '',
};

function getRequestData(formData: ThemeFormData): ThemeDtoReq {
  const {title, subjectId, parentThemeId} = formData;

  return {
    title,
    subjectId: subjectId as number,
    parentThemeId: parentThemeId as number,
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

export type ThemeTreeNode = Require<SimpleDataNode<number, number>, 'rootPId'>;

export const mapSubjectsToOptions = ({
  id,
  name,
}: SubjectInfo): SubjectOption => ({
  value: id,
  label: name,
});

export const mapThemesToNodes = ({
  id,
  parentThemeId,
  subjectId,
  hasSubThemes,
  title,
}: ThemeInfo): ThemeTreeNode => ({
  id,
  value: id,
  pId: parentThemeId,
  rootPId: subjectId,
  isLeaf: !hasSubThemes,
  title,
});

export function useLoadThemeLevel() {
  const fetchThemes = useKnowledgeLevelFetch();

  return useCallback(
    (treeNode: ThemeTreeNode): Promise<unknown> => {
      const deferred = new Deferred();
      const {rootPId: subjectId, id} = treeNode;

      fetchThemes(subjectId, id, deferred.resolve, deferred.reject);

      return deferred.promise;
    },
    [fetchThemes],
  );
}

export function useThemeSelect(
  subjects: SubjectInfo[],
  subjectId?: number,
  themeId?: number,
) {
  const {
    themes,
    error: errorLoadingRootThemes,
    reload: reloadRootThemes,
  } = useKnowledgeSubjectThemes(subjectId);
  const {
    theme,
    error: errorLoadingTheme,
    reload: reloadTheme,
  } = useKnowledgeTheme(subjectId, themeId);

  const isLoading =
    subjectId !== undefined && (!themes || (themeId !== undefined && !theme));

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
          formData.subjectId = passedSubjectId;
        }

        if (passedParentThemeId) {
          formData.parentThemeId = passedParentThemeId;
        }

        return formData;
      } else {
        const {title, subjectId, parentThemeId} = theme;

        return {
          title,
          subjectId,
          parentThemeId,
        };
      }
    },
    checkValidity,
  );

  const {title, subjectId, parentThemeId} = formData;

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
  } = useThemeSelect(subjects, subjectId, parentThemeId);

  const onSubjectChange = useCallback(
    (value: any, name: any) => {
      onInputChange(value, name);
      onInputChange(undefined, 'parentThemeId');
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
            name="subjectId"
            required
            placeholder="Предмет"
            options={subjectOptions}
            value={subjectId}
            isClearable={false}
            onChange={onSubjectChange}
          />
          <Input.TreeSelect<number, number>
            placeholder="Родительская тема"
            name="parentThemeId"
            onChange={onInputChange}
            value={parentThemeId}
            treeDataSimpleMode
            treeData={themeTreeNodes}
            allowClear
            loading={isLoading && !hasError}
            loadData={loadData as any}
            disabled={themeTreeNodes === undefined}
          />
          <Input.Input
            name="title"
            type="text"
            required
            placeholder="Название"
            value={title}
            onChange={onInputChange}
          />
        </FieldsContainer>
      </div>
    </Form>
  );
};

export default ThemeForm;
