import _ from 'lodash';
import {useUser} from "store";

export function checkPermissions(userInfo, requiredPermissions, requiredRoles, fullMatch = true) {
    const {permissions, roles} = userInfo;
    if (requiredPermissions) {
        if (!(fullMatch
            ? _.includes(permissions, requiredPermissions)
            : _.intersection(permissions, requiredPermissions).length !== 0))
            return false;
    }
    if (requiredRoles) {
        if (!(fullMatch
            ? _.includes(roles, requiredRoles)
            : _.intersection(roles, requiredRoles).length !== 0))
            return false;
    }
    return true;
}

export function useCheckPermissions(requiredPermissions, requiredRoles, fullMatch) {
    const {userInfo} = useUser();
    if (!userInfo)
        return undefined;
    return checkPermissions(userInfo, requiredPermissions, requiredRoles, fullMatch);
}

const ConditionalRenderer = ({requiredPermissions, requiredRoles, children, fullMatch}) => {
    const render = useCheckPermissions(requiredPermissions, requiredRoles, fullMatch);
    return render ? children : null;
};

export default ConditionalRenderer;
