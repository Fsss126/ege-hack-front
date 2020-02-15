import React from "react";
import CoverImage from "./CoverImage";
import Contacts from "./Contacts";

const UserProfile = ({first_name, last_name, photo, contacts, about, role}) => {
    const fullName = first_name && last_name ? `${first_name} ${last_name}` : undefined;
    return (
        <React.Fragment>
            <div className="user-profile__avatar-container">
                <div className="user-profile__avatar-wrap">
                    <CoverImage src={photo} className="user-profile__avatar" placeholder round square/>
                </div>
            </div>
            <div className="user-profile__info layout__content-block">
                <div className="d-flex flex-column align-items-center">
                    {fullName ? <h2>{fullName}</h2> : <h2 className="ph-item"><div className="ph-text"/></h2>}
                    {role && <div className="font-size-sm">{role}</div>}
                    {contacts && <Contacts contacts={contacts}/>}
                    <div className="description-text font-size-sm align-self-lg-start">{about}</div>
                </div>
            </div>
        </React.Fragment>
    )
};

export default UserProfile;
