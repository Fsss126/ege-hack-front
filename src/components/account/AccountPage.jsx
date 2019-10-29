import _ from "lodash";
import React from "react";
import Course from "../common/Course";
import Button from "../ui/Button";
import Page, {PageContent} from "../Page";
import UserProfile from "../common/UserProfile";
import {useUser} from "../../store";

const AccountPage = () => {
    const {user, userInfo} = useUser();
    const {first_name:firstName, last_name:lastName, photo, contacts, subjects, about} = user;
    const profile = {
        firstName,
        lastName,
        photo,
        contacts,
        about
    };
    return (
        <Page title="Аккаунт" className="account-page">
            <PageContent>
                <UserProfile {...profile}/>
            </PageContent>
        </Page>
    );
};

export default AccountPage;
