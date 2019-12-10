import React from "react";
import Page, {PageContent} from "components/Page";
import UserProfile from "components/common/UserProfile";
import {useUser} from "store";

const AccountPage = () => {
    const {user, userInfo} = useUser();
    let photo_max;
    if (userInfo) {
        ({vk_info: {photo_max}} = userInfo);
    }
    const {user: {first_name, last_name}} = user;
    return (
        <Page title="Аккаунт" className="account-page">
            <PageContent>
                <UserProfile
                    first_name={first_name}
                    last_name={last_name}
                    photo={photo_max}/>
            </PageContent>
        </Page>
    );
};

export default AccountPage;
