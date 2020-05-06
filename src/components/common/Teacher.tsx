import classNames from 'classnames';
import React from 'react';
import {Link, LinkProps} from 'react-router-dom';
import {TeacherInfo} from 'types/entities';

import Contacts from './Contacts';
import CoverImage from './CoverImage';

export type TeacherProps = {
  teacher: TeacherInfo;
  link: LinkProps['to'];
  bio?: boolean;
  className?: string;
};
const Teacher: React.FC<TeacherProps> = (props) => {
  const {
    teacher: {
      vk_info: {first_name, last_name, photo},
      contacts,
      subjects: teacherSubjects,
    },
    link,
    bio = false,
    className,
  } = props;
  // const onClick = React.useCallback((event) => {
  //   const clicked = !event.target.closest('.social-media');
  //   // event.preventDefault();
  // }, []);

  return (
    <Link
      to={link}
      className={classNames(
        'teacher-profile',
        'd-flex',
        'align-items-center',
        className,
      )}
    >
      <div className="container p-0">
        <div className="row flex-nowrap">
          <div className="col-auto d-flex align-items-center">
            <CoverImage
              src={photo}
              className="teacher-profile__photo"
              round
              square
            />
          </div>
          <div className="col d-flex flex-column justify-content-center overflow-hidden teacher-profile__info-container">
            <div className="teacher-profile__info">
              <h3 className="teacher-profile__name">
                {first_name} {last_name}
              </h3>
              {bio && (
                <div className="teacher-profile__subjects description-text font-size-sm">
                  {teacherSubjects
                    .map(({name}, i) => (i === 0 ? name : name.toLowerCase()))
                    .join(', ')}
                </div>
              )}
              {contacts && <Contacts contacts={contacts} />}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default Teacher;
