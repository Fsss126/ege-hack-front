import React from 'react';
import CoverImage from "./CoverImage";

export default function Teacher(props) {
    const {teacher: {firstName, lastName, photo}} = props;
    return (
        <div className="teacher-profile">
            <div className="container p-0">
                <div className="row flex-nowrap">
                    <div className="col-auto d-flex align-items-center">
                        <CoverImage src={photo} className="teacher-profile__photo"/>
                    </div>
                    <div className="col d-flex align-items-center">
                        <div className="teacher-profile__name">{firstName} {lastName}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
