import React from "react";
import Page, {PageContent} from "components/Page";
import UserProfile from "components/common/UserProfile";
import {useUser} from "hooks/selectors";
import { UserInfo} from "types/entities";

export type AccountPageProps = {
    userInfo?: UserInfo;
}
const AccountPage: React.FC<AccountPageProps> = () => {
    const {userInfo} = useUser();
    let photo, first_name, last_name;
    if (userInfo && !(userInfo instanceof Error)) {
        ({vk_info: {photo, first_name, last_name}} = userInfo);
    }
    return (
        <Page title="Аккаунт" className="account-page" isLoaded={true}>
            <PageContent>
                <UserProfile
                    first_name={first_name}
                    last_name={last_name}
                    photo={photo}/>
            </PageContent>
        </Page>
    );
};

export default AccountPage;
