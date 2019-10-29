import React from 'react';
import CoverImage from "./CoverImage";
import {Link} from "react-router-dom";
import Contacts from "./Contacts";

export default function Teacher(props) {
    const {teacher: {firstName, lastName, photo, contacts, subjects, about}, link, bio=false, className} = props;
    const onClick = React.useCallback((event) => {
        const clicked = !event.target.closest('.social-media');
        // event.preventDefault();
    }, []);
    return (
        <Link to={link} className={`${className} teacher-profile`} onClick={onClick}>
            <div className="container p-0">
                <div className="row flex-nowrap">
                    <div className="col-auto d-flex align-items-center">
                        <CoverImage src={photo} className="teacher-profile__photo" round square/>
                    </div>
                    <div className="col d-flex flex-column justify-content-center">
                        <h3 className="teacher-profile__name">{firstName} {lastName}</h3>
                        {bio && (
                            <div className="teacher-profile__subjects font-size-sm">
                                {subjects.map(({name}, i) => i === 0 ? name : name.toLowerCase()).join(', ')}
                            </div>)}
                        {bio && (<Contacts contacts={contacts}/>)}
                    </div>
                </div>
                {bio && (
                    <div className="row">
                        <div className="col-12 description-text">
                            {about}
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}
