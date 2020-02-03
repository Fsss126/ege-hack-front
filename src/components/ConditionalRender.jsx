import _ from 'lodash';
 import {useUser} from "store";

export function useCheckPermissions(requiredPermissions, requiredRoles, fullMatch = true) {
    const {userInfo} = useUser();
    if (!userInfo)
        return undefined;
    const {permissions, roles} = userInfo;
    if (requiredPermissions) {
        if (!(userInfo && userInfo.permissions && (
            fullMatch
                ? _.includes(permissions, requiredPermissions)
                : _.intersection(permissions, requiredPermissions).length)))
            return false;
    }
    if (requiredRoles) {
        if (!(userInfo && userInfo.role && (
            fullMatch
                ? _.includes(roles, requiredRoles)
                : _.intersection(roles, requiredRoles).length)))
            return false;
    }
    return true;
}

const ConditionalRenderer = ({requiredPermissions, requiredRoles, children, fullMatch}) => {
    const render = useCheckPermissions(requiredPermissions, requiredRoles, fullMatch);
    return render ? children : null;
};

export default ConditionalRenderer;
