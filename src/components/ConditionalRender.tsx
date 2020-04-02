import _ from 'lodash';
import {useUser} from "hooks/selectors";
import {UserInfo} from "types/entities";
import {AccountRole, Permission} from "../types/enums";

export type RequiredPermissions = Permission | Permission[]
export type RequiredRoles = AccountRole | AccountRole[];
export function checkPermissions(userInfo: UserInfo, requiredPermissions?: RequiredPermissions, requiredRoles?: RequiredRoles, fullMatch = true): boolean {
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

export function useCheckPermissions(requiredPermissions?: RequiredPermissions, requiredRoles?: RequiredRoles, fullMatch = true): boolean | undefined {
    const {userInfo} = useUser();
    if (!userInfo || userInfo instanceof Error)
        return undefined;
    return checkPermissions(userInfo, requiredPermissions, requiredRoles, fullMatch);
}

export type ConditionalRenderProps = {
    requiredPermissions?: RequiredPermissions;
    requiredRoles?: RequiredRoles;
    fullMatch?: boolean;
    children?: React.ReactElement;
}
const ConditionalRenderer: React.FC<ConditionalRenderProps> = (props) => {
    const {requiredPermissions, requiredRoles, children, fullMatch} = props;
    const render = useCheckPermissions(requiredPermissions, requiredRoles, fullMatch);
    return render && children ? children : null;
};

export default ConditionalRenderer;
