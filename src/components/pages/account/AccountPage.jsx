import React from "react";
import Page, {PageContent} from "components/Page";
import UserProfile from "components/common/UserProfile";
import {useUser} from "store";

const AccountPage = () => {
    const {user, userInfo} = useUser();
    return (
        <Page title="Аккаунт" className="account-page">
            <PageContent>
                <UserProfile {...user}/>
            </PageContent>
        </Page>
    );
};

export default AccountPage;
