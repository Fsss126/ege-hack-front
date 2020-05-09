import Catalog, {
  CatalogBodyProps,
  CatalogProps,
  FilterFunc,
  FilterProps,
} from 'components/common/Catalog';
import Teacher from 'components/common/Teacher';
import _ from 'lodash';
import React from 'react';
import {CourseInfo, SubjectInfo, TeacherInfo} from 'types/entities';

const Filter: React.FC<FilterProps> = (props) => (
  <Catalog.Filter
    filterBy={{online: false, subject: true, search: true}}
    {...props}
  />
);

export type TeachersCatalogProps = Omit<
  CatalogProps<CourseInfo>,
  'emptyPlaceholder' | 'noMatchPlaceholder' | 'renderItem'
>;

const TeachersCatalog = (props: TeachersCatalogProps) => {
  const renderTeacher = React.useCallback(
    (teacher, {link, subjects, ...rest}) => (
      <div
        className="teacher-profile-wrap list__item col-12 col-md-6 col-xl-4 d-flex"
        key={teacher.id}
      >
        <Teacher
          teacher={teacher}
          subjects={subjects}
          bio
          link={link}
          {...rest}
        />
      </div>
    ),
    [],
  );

  return (
    <Catalog.Catalog
      className="teachers-catalog"
      emptyPlaceholder="Нет преподавателей"
      noMatchPlaceholder="Нет преподавателей, соответствующих условиям поиска"
      flex
      renderItem={renderTeacher}
      {...props}
    />
  );
};

const filter: FilterFunc<TeacherInfo> = (teacher, {subject}) =>
  subject ? teacher.subjects.some(({id}) => subject === id) : true;

export type CourseBodyProps = Omit<
  CatalogBodyProps<CourseInfo>,
  'items' | 'options' | 'filter'
> & {
  teachers: TeacherInfo[];
  subjects: SubjectInfo[];
};
const Body: React.FC<CourseBodyProps> = (props) => {
  const {teachers, subjects, ...otherProps} = props;

  const options = React.useMemo(() => {
    const subjectsMap = _.zipObject(
      subjects.map(({id}) => id),
      subjects,
    );
    const subjectsTeachers = _.reduce<
      TeacherInfo,
      {[key: number]: SubjectInfo}
    >(
      teachers,
      (result, teacher) => {
        teacher.subjects.forEach((subject) => {
          result[subject.id] = subjectsMap[subject.id];
        });
        return result;
      },
      {},
    );

    return _.values(subjectsTeachers).map(({id, name}) => ({
      value: id,
      label: name,
    }));
  }, [subjects, teachers]);

  return (
    <Catalog.Body
      options={options}
      filter={filter}
      items={teachers}
      {...otherProps}
    />
  );
};

export default {
  ...Catalog,
  Filter,
  Catalog: TeachersCatalog,
  Body,
};
