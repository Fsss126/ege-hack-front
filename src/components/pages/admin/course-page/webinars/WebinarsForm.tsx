import Form, {
  FieldsContainer,
  FormElement,
  FormElementGroup,
  FormErrorHandler,
  FormProps,
  FormSubmitHandler,
  FormSubmittedHandler,
  useForm,
  useFormValidityChecker,
} from 'components/ui/Form';
import * as Input from 'components/ui/input';
import Tooltip, {TooltipPosition} from 'components/ui/Tooltip';
import {useRevokeWebinars} from 'hooks/selectors';
import React, {useCallback, useMemo, useRef} from 'react';
import {FileInfo, WebinarScheduleDtoReq} from 'types/dtos';
import {WebinarScheduleInfo} from 'types/entities';

type WebinarData = {
  name: string;
  description: string;
  date_start?: Date;
  duration: string;
};

type WebinarsFormData = {
  click_meeting_link: string;
  image?: FileInfo[];
  webinars: WebinarData[];
};
const INITIAL_FORM_DATA: WebinarsFormData = {
  click_meeting_link: '',
  image: undefined,
  webinars: [],
};

const INITIAL_WEBINAR_DATA: WebinarData = {
  name: '',
  description: '',
  duration: '',
  date_start: undefined,
};

function getRequestData(formData: WebinarsFormData): WebinarScheduleDtoReq {
  const {image, click_meeting_link, webinars} = formData;

  return {
    click_meeting_link,
    image: (image as FileInfo[])[0].file_id,
    webinars: webinars.map(({date_start, duration, ...rest}) => ({
      ...rest,
      date_start: (date_start as Date).getTime(),
      duration: parseInt(duration),
    })),
  };
}

type FormComponentProps = FormProps<WebinarScheduleInfo>;

export type WebinarsFormProps = {
  courseId: number;
  title?: string;
  createRequest: (data: WebinarScheduleDtoReq) => Promise<WebinarScheduleInfo>;
  onSubmitted: FormSubmittedHandler<WebinarScheduleInfo>;
  errorMessage: string;
  cancelLink: FormComponentProps['cancelLink'];
  webinars?: WebinarScheduleInfo;
};

const WebinarsForm: React.FC<WebinarsFormProps> = (props) => {
  const {
    courseId,
    title,
    createRequest,
    onSubmitted,
    errorMessage,
    cancelLink,
  } = props;

  const formElementRef = useRef<HTMLFormElement>(null);

  const checkValidity = useFormValidityChecker<WebinarsFormData>(
    formElementRef.current,
    (name, input, formData) => {
      if (name === 'image') {
        return formData.image && !!formData.image[0];
      }
      if (name === 'webinars') {
        for (const webinar of formData.webinars) {
          if (!(webinar.name && webinar.duration && webinar.date_start)) {
            return false;
          }
        }
        return true;
      }
    },
  );

  const {webinars: webinarsSchedule} = props;
  const {formData, isValid, onInputChange, reset} = useForm<WebinarsFormData>(
    (state): WebinarsFormData => {
      if (state || !webinarsSchedule) {
        return INITIAL_FORM_DATA;
      } else {
        const {image_link, click_meeting_link, webinars} = webinarsSchedule;

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
          click_meeting_link: click_meeting_link || '',
          webinars: webinars.map(
            ({date_start, duration, name, description, id}) => ({
              date_start,
              duration: duration.toString(),
              name,
              description: description || '',
              id,
            }),
          ),
        };
      }
    },
    checkValidity,
  );

  const {image, click_meeting_link, webinars} = formData;

  const initialImageFile = useMemo(() => formData.image, [formData.image]);

  const revokeWebinars = useRevokeWebinars(courseId);

  const onSubmit = useCallback<
    FormSubmitHandler<[undefined], Promise<WebinarScheduleInfo>>
  >(() => {
    console.log('submit', formData);
    return createRequest(getRequestData(formData));
  }, [formData, createRequest]);

  const onError = useCallback<FormErrorHandler>(
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
    <Form<WebinarScheduleInfo>
      title={title}
      ref={formElementRef}
      className="webinars-form container p-0"
      isValid={isValid}
      reset={reset}
      revokeRelatedData={revokeWebinars}
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
            // required
            maxFiles={1}
            initialFiles={initialImageFile}
            accept="image/*"
            onChange={onInputChange}
            maxSizeBytes={1024 * 1024}
          />
        </div>
        <FieldsContainer className="col">
          <Input.Input
            name="click_meeting_link"
            type="text"
            maxLength={300}
            required
            placeholder="ClickMeeting"
            value={click_meeting_link}
            onChange={onInputChange}
          />
        </FieldsContainer>
      </div>
      <FormElementGroup<WebinarData>
        elements={webinars}
        onChange={onInputChange}
        name="webinars"
        addBtnText="Добавить вебинар"
        initialElementData={INITIAL_WEBINAR_DATA}
        renderElement={(
          {name, date_start, duration, description},
          i,
        ): React.ReactElement => (
          <FormElement
            name="webinars"
            index={i}
            onChange={onInputChange}
            key={i}
          >
            <FieldsContainer className="row">
              <div className="col-12">
                <Input.Input
                  name={`webinars[${i}].name`}
                  type="text"
                  required
                  placeholder="Название"
                  value={name}
                  onChange={onInputChange}
                />
              </div>
              <div className="col-12">
                <Input.TextArea
                  name={`webinars[${i}].description`}
                  placeholder="Описание"
                  value={description}
                  onChange={onInputChange}
                />
              </div>
              <div className="col-12 col-md-6 col-lg start-date-input-container">
                <Input.DateInput
                  value={date_start}
                  required
                  placeholder="Дата начала"
                  dayPickerProps={{
                    selectedDays: date_start,
                    disabledDays: {before: new Date()},
                    modifiers: {start: date_start, end: date_start},
                  }}
                  name={`webinars[${i}].date_start`}
                  onChange={onInputChange}
                />
              </div>
              <div className="col-12 col-md-6 col-lg">
                <Input.TimeInput
                  name={`webinars[${i}].date_start`}
                  required
                  disabled={!date_start}
                  placeholder="Время"
                  value={date_start}
                  onChange={onInputChange}
                />
              </div>
              <div className="col-12 col-md-6 col-lg d-flex align-items-center">
                <Input.Input
                  name={`webinars[${i}].duration`}
                  type="number"
                  required
                  placeholder="Длительность"
                  value={duration}
                  onChange={onInputChange}
                />
                <Tooltip content={`В минутах`} position={TooltipPosition.left}>
                  <i className="icon-info" style={{paddingLeft: '12px'}} />
                </Tooltip>
              </div>
            </FieldsContainer>
          </FormElement>
        )}
      />
    </Form>
  );
};

export default WebinarsForm;
