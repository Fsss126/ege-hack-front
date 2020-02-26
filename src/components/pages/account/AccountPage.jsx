import React from "react";
import Page, {PageContent} from "components/Page";
import UserProfile from "components/common/UserProfile";
import {useUser} from "store/selectors";

const AccountPage = () => {
    const {userInfo} = useUser();
    let photo_max, first_name, last_name;
    if (userInfo) {
        ({vk_info: {photo_max, first_name, last_name}} = userInfo);
    }
    return (
        <Page title="Аккаунт" className="account-page" isLoaded={true}>
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
