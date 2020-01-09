import {useUser} from "store";
import {checkInclusion} from "definitions/helpers";

export function useCheckPermissions(requiredPermissions, requiredRoles) {
    const {userInfo} = useUser();
    if (requiredPermissions) {
        if (!(userInfo && userInfo.permissions && checkInclusion(requiredPermissions, userInfo.permissions)))
            return false;
    }
    if (requiredRoles) {
        if (!(userInfo && userInfo.role && checkInclusion(requiredPermissions, userInfo.permissions)))
            return false;
    }
    return true;
}

const ConditionalRenderer = ({requiredPermissions, requiredRoles, children}) => {
    const render = useCheckPermissions(requiredPermissions, requiredRoles);
    return render ? children : null;
};

export default ConditionalRenderer;
