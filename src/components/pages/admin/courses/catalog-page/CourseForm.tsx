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
import {useRevokeCourses} from 'hooks/selectors';
import React, {useCallback, useMemo, useRef} from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {CourseDtoReq, FileInfo} from 'types/dtos';
import {CourseInfo, SubjectInfo, TeacherInfo} from 'types/entities';

type CourseFormData = {
  name: string;
  subject_id?: number;
  teacher_id?: number;
  image?: FileInfo[];
  spread_sheet_link: string;
  price: string;
  date_start?: Date;
  date_end?: Date;
  online: boolean;
  description: string;
  hide_from_market: boolean;
};
const INITIAL_FORM_DATA: CourseFormData = {
  name: '',
  price: '',
  online: false,
  description: '',
  hide_from_market: true,
  spread_sheet_link: '',
  date_start: undefined,
  date_end: undefined,
  image: undefined,
};

function getRequestData(formData: CourseFormData): CourseDtoReq {
  const {
    name,
    subject_id,
    teacher_id,
    image,
    price,
    date_start,
    date_end,
    online,
    description,
    hide_from_market,
    spread_sheet_link,
  } = formData;

  return {
    name,
    subject_id: subject_id as number,
    teacher_id: teacher_id as number,
    image: (image as FileInfo[])[0].file_id,
    price: parseFloat(price),
    date_start: (date_start as Date).getTime(),
    date_end: (date_end as Date).getTime(),
    online,
    description,
    hide_from_market,
    spread_sheet_link,
  };
}

const isHiddenFromMarket = (isAvailable: boolean): boolean => !isAvailable;

type FormComponentProps = FormProps<CourseInfo>;

export type CourseFormProps = {
  subjects: SubjectInfo[];
  teachers: TeacherInfo[];
  title?: string;
  createRequest: (data: CourseDtoReq) => Promise<CourseInfo>;
  onSubmitted: SubmittedHandler<CourseInfo>;
  errorMessage: string;
  cancelLink: FormComponentProps['cancelLink'];
  course?: CourseInfo;
};
type SubjectOption = OptionShape<number>;
type TeacherOption = SubjectOption;
const CourseForm: React.FC<CourseFormProps> = (props) => {
  const {
    subjects,
    teachers,
    title,
    createRequest,
    onSubmitted,
    errorMessage,
    cancelLink,
  } = props;

  const subjectOptions = useMemo<SubjectOption[]>(
    () => subjects.map(({id, name}) => ({value: id, label: name})),
    [subjects],
  );
  const teacherOptions = useMemo<TeacherOption[]>(
    () =>
      teachers.map(({id, vk_info: {first_name, last_name}}) => ({
        value: id,
        label: `${first_name} ${last_name}`,
      })),
    [teachers],
  );

  const formElementRef = useRef<HTMLFormElement>(null);

  const checkValidity = useFormValidityChecker<CourseFormData>(
    formElementRef.current,
    (name, input, formData) => {
      if (name === 'image') {
        return formData.image && !!formData.image[0];
      }
    },
  );

  const {course} = props;
  const {formData, isValid, onInputChange, reset} = useForm<CourseFormData>(
    (state): CourseFormData => {
      if (state || !course) {
        return INITIAL_FORM_DATA;
      } else {
        const {
          image_link,
          id,
          purchased,
          teacher_ids,
          hide_from_market,
          description,
          price,
          spread_sheet_link,
          ...otherData
        } = course;

        return {
          hide_from_market: hide_from_market || false,
          teacher_id: teacher_ids[0],
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
          price: price.toString(),
          spread_sheet_link: spread_sheet_link || '',
          ...otherData,
        };
      }
    },
    checkValidity,
  );

  const {
    name,
    subject_id,
    teacher_id,
    image,
    price,
    date_start,
    date_end,
    online,
    description,
    hide_from_market,
    spread_sheet_link,
  } = formData;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialImageFile = useMemo(() => formData.image, []);

  const from = date_start;
  const to = date_end;
  const modifiers = {start: from, end: to};

  const dateEndInputRef = useRef<DayPickerInput>(null);

  const onSubmit = useCallback<
    FormSubmitHandler<[undefined], Promise<CourseInfo>>
  >(() => {
    return createRequest(getRequestData(formData));
  }, [formData, createRequest]);

  const revokeShopCatalog = useRevokeCourses();

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

  const onStartDateSelect = useCallback(
    () => dateEndInputRef.current?.getInput().focus(),
    [],
  );

  return (
    <Form<CourseInfo>
      title={title}
      ref={formElementRef}
      className="course-form container p-0"
      isValid={isValid}
      reset={reset}
      onSubmit={onSubmit}
      onSubmitted={onSubmitted}
      onError={onError}
      revokeRelatedData={revokeShopCatalog}
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
          <Input.Select
            name="subject_id"
            required
            placeholder="Предмет"
            options={subjectOptions}
            value={subject_id}
            isClearable={false}
            onChange={onInputChange}
          />
          <Input.Select
            name="teacher_id"
            required
            placeholder="Преподаватель"
            options={teacherOptions}
            value={teacher_id}
            isClearable={false}
            onChange={onInputChange}
          />
          <Input.Input
            name="price"
            type="price"
            required
            placeholder="Цена"
            value={price}
            onChange={onInputChange}
          />
          <Input.CheckBox
            name="online"
            value={online}
            label="Онлайн курс"
            onChange={onInputChange}
          />
          <div className="row">
            <div className="col start-date-input-container">
              <Input.DateInput
                value={from}
                required
                placeholder="Дата начала"
                dayPickerProps={{
                  selectedDays: [from, from && to ? {from, to} : undefined],
                  disabledDays: to ? {after: to} : undefined,
                  toMonth: to,
                  modifiers,
                  onDayClick: onStartDateSelect,
                }}
                name="date_start"
                onChange={onInputChange}
              />
            </div>
            <div className="col end-date-input-container">
              <Input.DateInput
                ref={dateEndInputRef}
                required
                value={to}
                placeholder="Дата окончания"
                dayPickerProps={{
                  selectedDays: [from, from && to ? {from, to} : undefined],
                  disabledDays: from ? {before: from} : undefined,
                  modifiers,
                  month: from,
                  fromMonth: from,
                }}
                name="date_end"
                onChange={onInputChange}
              />
            </div>
          </div>
          <Input.TextArea
            name="description"
            className="large"
            placeholder="Описание"
            value={description}
            onChange={onInputChange}
          />
          <Input.CheckBox
            name="hide_from_market"
            value={!hide_from_market}
            label="Доступен в магазине"
            parse={isHiddenFromMarket}
            onChange={onInputChange}
          />
          <Input.Input
            name="spread_sheet_link"
            type="text"
            placeholder="Ссылка на Гугл таблицу"
            value={spread_sheet_link}
            maxLength={1000}
            onChange={onInputChange}
          />
        </FieldsContainer>
      </div>
    </Form>
  );
};

export default CourseForm;
