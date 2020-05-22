import APIRequest from 'api';
import Contacts from 'components/common/Contacts';
import CoverImage from 'components/common/CoverImage';
import ConditionalRenderer from 'components/ConditionalRender';
import {ContentBlock} from 'components/layout/ContentBlock';
import Form, {
  ErrorHandler,
  FormSubmitHandler,
  useForm,
  useFormValidityChecker,
} from 'components/ui/Form';
import FieldsContainer from 'components/ui/form/FieldsContainer';
import * as Input from 'components/ui/input';
import {OptionShape} from 'components/ui/input/Select';
import {useRevokeUserInfo} from 'hooks/selectors';
import {
  getGraduationYearByGrade,
  LAST_GRADE,
  MIDDLE_SCHOOL_FIRST_GRADE,
} from 'modules/userInfo/userInfo.utils';
import React, {useCallback, useRef} from 'react';
import {AccountDtoReq} from 'types/dtos';
import {AccountInfo, PupilInfo, TeacherInfo} from 'types/entities';
import {AccountRole} from 'types/enums';

type GradeOption = OptionShape<number>;

const gradeOptions: GradeOption[] = _.times(
  LAST_GRADE - MIDDLE_SCHOOL_FIRST_GRADE + 1,
  (i) => {
    const grade = MIDDLE_SCHOOL_FIRST_GRADE + i;

    return {value: grade, label: grade.toString()};
  },
);

type AccountFormData = Optionalize<
  Omit<Required<PupilInfo>, 'final_year'>,
  'grade'
> &
  Required<TeacherInfo>;
const INITIAL_FORM_DATA: AccountFormData = {
  city: '',
  school: '',
  grade: undefined,
  phone: '',
  email: '',
  instagram: '',
  bio: '',
};

function getRequestData(formData: AccountFormData): AccountDtoReq {
  const {city, school, grade, phone, email, bio, instagram} = formData;

  return {
    pupil: {
      city: city || undefined,
      school: school || undefined,
      final_year:
        grade !== undefined ? getGraduationYearByGrade(grade) : undefined,
      phone: phone || undefined,
      email: email || undefined,
      instagram: instagram || undefined,
    },
    teacher: {
      bio: bio || undefined,
      instagram: instagram || undefined,
    },
  };
}

const createRequest = (requestData: AccountDtoReq): Promise<AccountInfo> =>
  APIRequest.put(`/accounts/info`, requestData);

interface SettingsFormProps {
  accountInfo: AccountInfo;
}

export const SettingsForm = (props: SettingsFormProps) => {
  const {accountInfo} = props;
  const {
    vk_info: {photo, first_name, last_name},
    contacts,
  } = accountInfo;

  const fullName = `${first_name} ${last_name}`;

  const formElementRef = useRef<HTMLFormElement>(null);

  const checkValidity = useFormValidityChecker<AccountFormData>(
    formElementRef.current,
  );

  const {formData, isValid, onInputChange, reset} = useForm<AccountFormData>(
    (): AccountFormData => {
      const {pupil, teacher} = accountInfo;
      const {final_year, ...pupilInfo} = pupil || {};
      const teacherInfo = teacher || {};

      return _({...pupilInfo, ...teacherInfo})
        .defaults(INITIAL_FORM_DATA)
        .value();
    },
    checkValidity,
  );

  const {city, school, grade, phone, email, instagram, bio} = formData;

  const onSubmit = useCallback<
    FormSubmitHandler<[undefined], Promise<AccountInfo>>
  >(() => {
    return createRequest(getRequestData(formData));
  }, [formData]);

  const revokeUserInfo = useRevokeUserInfo();

  const onSubmitted = React.useCallback((response, showSuccessMessage) => {
    showSuccessMessage('Изменения сохранены', [
      {
        text: 'Ок',
      },
    ]);
  }, []);

  const onError = useCallback<ErrorHandler>(
    (error, showErrorMessage, reloadCallback) => {
      showErrorMessage('Ошибка при сохранении', [
        {
          text: 'Закрыть',
        },
        {
          text: 'Заново',
          action: reloadCallback,
        },
      ]);
    },
    [],
  );

  return (
    <ContentBlock className="account-settings">
      <div className="account-settings__account container p-0">
        <div className="row">
          <div className="col-auto">
            <CoverImage
              src={photo}
              className="account-settings__avatar"
              placeholder
              round
              square
            />
          </div>
          <div className="col">
            <h4 className="account-settings__name">{fullName}</h4>
            <Contacts contacts={_.omit(contacts, 'ig')} />
          </div>
        </div>
      </div>
      <Form<AccountInfo>
        title="Информация профиля"
        ref={formElementRef}
        className="theme-form container p-0"
        isValid={isValid}
        reset={reset}
        onSubmit={onSubmit}
        onSubmitted={onSubmitted}
        onError={onError}
        revokeRelatedData={revokeUserInfo}
      >
        <div className="row">
          <FieldsContainer className="col">
            <ConditionalRenderer requiredRoles={AccountRole.PUPIL}>
              <Input.Input
                name="city"
                type="text"
                placeholder="Город"
                value={city}
                onChange={onInputChange}
                icon={<i className="icon-location" />}
              />
              <Input.Input
                name="school"
                type="text"
                placeholder="Школа"
                value={school}
                onChange={onInputChange}
                icon={<i className="far fa-building" />}
              />
              <Input.Select
                name="grade"
                placeholder="Класс"
                options={gradeOptions}
                value={grade}
                isClearable={false}
                onChange={onInputChange}
                icon={<i className="icon-academic" />}
              />
              <Input.Input
                name="phone"
                type="tel"
                placeholder="Телефон"
                value={phone}
                onChange={onInputChange}
                icon={<i className="icon-phone" />}
              />
              <Input.Input
                name="email"
                type="email"
                placeholder="Почта"
                value={email}
                onChange={onInputChange}
                icon={<i className="far fa-envelope" />}
              />
            </ConditionalRenderer>
            <Input.Input
              name="instagram"
              type="text"
              placeholder="Instagram"
              value={instagram}
              onChange={onInputChange}
              icon={<i className="fab fa-instagram ig" />}
            />
            <ConditionalRenderer requiredRoles={AccountRole.TEACHER}>
              <Input.TextArea
                name="bio"
                placeholder="О себе"
                value={bio}
                onChange={onInputChange}
                icon={<i className="icon-info" />}
              />
            </ConditionalRenderer>
          </FieldsContainer>
        </div>
      </Form>
    </ContentBlock>
  );
};
