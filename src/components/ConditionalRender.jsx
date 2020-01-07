import {useUser} from "store";
import {checkInclusion} from "definitions/helpers";

const ConditionalRenderer = ({requiredPermissions, requiredRoles, children}) => {
    const {userInfo} = useUser();
    if (requiredPermissions) {
        if (!(userInfo && userInfo.permissions && checkInclusion(requiredPermissions, userInfo.permissions)))
            return null;
    }
    if (requiredRoles) {
        if (!(userInfo && userInfo.role && checkInclusion(requiredPermissions, userInfo.permissions)))
            return null;
    }
    return children;
};

export default ConditionalRenderer;
