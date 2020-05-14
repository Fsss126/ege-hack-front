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
import {
  ElementComponentProps,
  FormElement,
  FormElementGroup,
} from 'components/ui/form/FormElementGroup';
import * as Input from 'components/ui/input';
import {SimpleDataNode} from 'components/ui/input/TreeSelect';
import {
  useKnowledgeSubjectContent,
  useKnowledgeTask,
  useRevokeKnowledgeTest,
} from 'hooks/selectors';
import React, {useCallback, useMemo, useRef} from 'react';
import {TestDtoReq} from 'types/dtos';
import {SubjectInfo, TaskInfo, TestInfo, ThemeInfo} from 'types/entities';

import {
  getThemeNodeId,
  mapThemesToNodes,
  ThemeTreeNode,
  useLoadThemeLevel,
} from '../catalog-page/ThemeForm';

type TaskData = {
  taskId?: number;
};

type TestFormData = {
  name: string;
  pass_criteria: string;
  deadline?: Date;
  tasks: TaskData[];
};
const INITIAL_FORM_DATA: TestFormData = {
  name: '',
  pass_criteria: '',
  deadline: undefined,
  tasks: [],
};

const INITIAL_TASK_DATA: TaskData = {
  taskId: undefined,
};

function getRequestData(formData: TestFormData): TestDtoReq {
  const {name, pass_criteria, deadline, tasks} = formData;

  return {
    name,
    pass_criteria: parseFloat(pass_criteria),
    deadline: deadline ? deadline.getTime() : undefined,
    task_ids: tasks.map(({taskId}) => taskId as number),
  };
}

export type TaskTreeNode = Require<SimpleDataNode<number, string>, 'rootPId'>;

export const mapTasksToNodes = ({
  id,
  theme_id,
  subject_id,
  text,
}: TaskInfo): TaskTreeNode => ({
  id: `2.task.${id}`,
  value: id,
  pId: `1.theme.${theme_id}`,
  rootPId: `subject.${subject_id}`,
  isLeaf: true,
  title: text,
});

export const mapThemeToContainingNodes = (theme: ThemeInfo): ThemeTreeNode => ({
  ...mapThemesToNodes(theme),
  isLeaf: !theme.has_sub_themes && !theme.has_sub_tasks,
  selectable: false,
  value: NaN,
});

export function useTaskSelect(
  subjects: SubjectInfo[],
  subjectId?: number,
  taskId?: number,
) {
  const {
    themes,
    tasks,
    loadedThemes,
    error: errorLoadingRootContent,
    reload: reloadRootContent,
  } = useKnowledgeSubjectContent(subjectId);

  const {task, error: errorLoadingTask, reload: reloadTask} = useKnowledgeTask(
    subjectId,
    taskId,
  );

  const isLoading =
    subjectId !== undefined &&
    (!themes || !tasks || (taskId !== undefined && !task));

  const errors = [errorLoadingRootContent, errorLoadingTask];
  const reloadCallbacks = [reloadRootContent, reloadTask];

  const {hasError, notFound} = useHandleErrors(errors, reloadCallbacks);

  const themeTreeNodes = useMemo<ThemeTreeNode[] | undefined>(() => {
    const themesNodes = themes
      ? themes.map(mapThemeToContainingNodes).filter(({isLeaf}) => !isLeaf)
      : [];

    return isLoading ? undefined : themesNodes;
  }, [isLoading, themes]);
  const taskTreeNodes = useMemo<TaskTreeNode[] | undefined>(() => {
    let tasksNodes = tasks ? tasks.map(mapTasksToNodes) : [];
    const taskNode = task ? mapTasksToNodes(task) : [];

    tasksNodes = _.uniqBy(_.concat(tasksNodes, taskNode), 'id');

    return isLoading ? undefined : tasksNodes;
  }, [isLoading, task, tasks]);

  const treeNodes = useMemo(() => {
    return themeTreeNodes && taskTreeNodes
      ? _.concat(themeTreeNodes, taskTreeNodes)
      : undefined;
  }, [taskTreeNodes, themeTreeNodes]);

  const loadedNodeIds = loadedThemes.map((id) => getThemeNodeId(id));

  const loadData = useLoadThemeLevel();

  return {
    hasError,
    notFound,
    isLoading,
    treeNodes,
    loadData,
    loadedNodeIds,
    errors,
    reloadCallbacks,
  };
}

type TaskElementRenderProps = {
  selectedTasks: number[];
  subjects: SubjectInfo[];
  subjectId: number;
};

type TaskElementProps = ElementComponentProps<TaskData, TaskElementRenderProps>;

// TODO: disable selected tasks
const TaskElement = (props: TaskElementProps) => {
  const {taskId, selectedTasks, subjects, subjectId, onChange, index} = props;

  const {
    hasError,
    isLoading,
    treeNodes,
    loadedNodeIds,
    loadData,
  } = useTaskSelect(subjects, subjectId, taskId);

  return (
    <FormElement name="tasks" index={index} onChange={onChange} key={index}>
      <FieldsContainer>
        <div className="col-12">
          <Input.TreeSelect<number, string>
            placeholder="Задание"
            name={`tasks[${index}].taskId`}
            required
            onChange={onChange}
            value={taskId}
            treeDataSimpleMode
            treeData={treeNodes}
            treeLoadedKeys={loadedNodeIds}
            allowClear
            loading={isLoading && !hasError}
            loadData={loadData as any}
            disabled={treeNodes === undefined}
          />
        </div>
      </FieldsContainer>
    </FormElement>
  );
};

type FormComponentProps = FormProps<TestInfo>;

export type TestFormProps = {
  lessonId: number;
  courseId: number;
  subjectId: number;
  subjects: SubjectInfo[];
  title?: string;
  createRequest: (data: TestDtoReq) => Promise<TestInfo>;
  onSubmitted: SubmittedHandler<TestInfo>;
  errorMessage: string;
  cancelLink: FormComponentProps['cancelLink'];
  test?: TestInfo;
};

const TestForm: React.FC<TestFormProps> = (props) => {
  const {
    lessonId,
    subjectId,
    courseId,
    subjects,
    title,
    createRequest,
    onSubmitted,
    errorMessage,
    cancelLink,
  } = props;

  const formElementRef = useRef<HTMLFormElement>(null);

  const checkValidity = useFormValidityChecker<TestFormData>(
    formElementRef.current,
    (name, input, formData) => {
      if (name === 'deadline') {
        return true;
      }
      if (name === 'tasks') {
        for (const task of formData.tasks) {
          if (!task.taskId) {
            return false;
          }
        }
        return true;
      }
    },
  );

  const {test} = props;
  const {formData, isValid, onInputChange, reset} = useForm<TestFormData>(
    (state): TestFormData => {
      if (state || !test) {
        return INITIAL_FORM_DATA;
      } else {
        const {id, tasks, pass_criteria, ...rest} = test;

        return {
          ...rest,
          pass_criteria: pass_criteria.toString(),
          tasks: tasks.map(({id}) => ({taskId: id})),
        };
      }
    },
    checkValidity,
  );

  const {name, pass_criteria, deadline, tasks} = formData;

  const revokeTest = useRevokeKnowledgeTest(courseId, lessonId);

  const onSubmit = useCallback<
    FormSubmitHandler<[undefined], Promise<TestInfo>>
  >(() => {
    return createRequest(getRequestData(formData));
  }, [formData, createRequest]);

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

  const selectedTasks = useMemo(
    () =>
      tasks
        .map(({taskId}) => taskId)
        .filter((id): id is number => id !== undefined),
    [tasks],
  );

  const modifiers = {start: deadline, end: deadline};

  return (
    <Form<TestInfo>
      title={title}
      ref={formElementRef}
      className="test-form container p-0"
      isValid={isValid}
      reset={reset}
      revokeRelatedData={revokeTest}
      onSubmit={onSubmit}
      onSubmitted={onSubmitted}
      onError={onError}
      cancelLink={cancelLink}
    >
      <div className="row">
        <FieldsContainer className="col">
          <Input.Input
            name="name"
            type="text"
            required
            placeholder="Название"
            value={name}
            onChange={onInputChange}
          />
          <div className="row">
            <div className="col">
              <Input.DateInput
                value={deadline}
                placeholder="Дедлайн"
                dayPickerProps={{
                  selectedDays: deadline,
                  disabledDays: {before: new Date()},
                  modifiers,
                }}
                name="deadline"
                clickUnselectsDay={true}
                onChange={onInputChange}
              />
            </div>
            <div className="col">
              <Input.Input
                name="pass_criteria"
                required
                type="decimal"
                placeholder="Порог прохождения"
                step="0.01"
                min="0"
                max="1"
                value={pass_criteria}
                onChange={onInputChange}
              />
            </div>
          </div>
        </FieldsContainer>
      </div>
      <FormElementGroup<TaskData, TaskElementRenderProps>
        elements={tasks}
        onChange={onInputChange}
        name="tasks"
        addBtnText="Добавить задание"
        initialElementData={INITIAL_TASK_DATA}
        renderProps={{selectedTasks, subjects, subjectId}}
        elementComponent={TaskElement}
      />
    </Form>
  );
};

export default TestForm;
