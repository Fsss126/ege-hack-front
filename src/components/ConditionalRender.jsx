import _ from 'lodash';
import {useUser} from "store/selectors";

export function checkPermissions(userInfo, requiredPermissions, requiredRoles, fullMatch = true) {
    const {permissions, roles} = userInfo;
    if (typeof requiredPermissions === 'string')
        requiredPermissions = [requiredPermissions];
    if (typeof requiredRoles === 'string')
        requiredRoles = [requiredRoles];

    if (requiredPermissions) {
        if (!(fullMatch
            ? _.difference(requiredPermissions, permissions).length === 0
            : _.intersection(requiredPermissions, permissions).length !== 0))
            return false;
    }
    if (requiredRoles) {
        if (!(fullMatch
            ? _.difference(requiredRoles, roles).length === 0
            : _.intersection(requiredRoles, roles).length !== 0))
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
