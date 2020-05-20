import {getIsFeatureEnabled, TOGGLE_FEATURES} from 'definitions/constants';
import _ from 'lodash';
import {useUserInfo} from 'modules/user/user.hooks';
import React from 'react';
import {AccountInfo} from 'types/entities';

import {AccountRole, Permission} from '../types/enums';

export type RequiredPermissions = Permission | Permission[];

export type RequiredRoles = AccountRole | AccountRole[];

export function checkPermissions(
  userInfo: AccountInfo,
  requiredPermissions?: RequiredPermissions,
  requiredRoles?: RequiredRoles,
  fullMatch = true,
): boolean {
  const {permissions, roles} = userInfo;

  if (typeof requiredPermissions === 'string') {
    requiredPermissions = [requiredPermissions];
  }
  if (typeof requiredRoles === 'string') {
    requiredRoles = [requiredRoles];
  }

  if (requiredPermissions) {
    if (
      !(fullMatch
        ? _.difference(requiredPermissions, permissions).length === 0
        : _.intersection(requiredPermissions, permissions).length !== 0)
    ) {
      return false;
    }
  }
  if (requiredRoles) {
    if (
      !(fullMatch
        ? _.difference(requiredRoles, roles).length === 0
        : _.intersection(requiredRoles, roles).length !== 0)
    ) {
      return false;
    }
  }
  return true;
}

export function useCheckPermissions(
  requiredPermissions?: RequiredPermissions,
  requiredRoles?: RequiredRoles,
  fullMatch = true,
): boolean | undefined {
  const {userInfo, error} = useUserInfo();

  if (!userInfo || error) {
    return undefined;
  }
  return checkPermissions(
    userInfo,
    requiredPermissions,
    requiredRoles,
    fullMatch,
  );
}

export interface ConditionalRenderProps {
  requiredPermissions?: RequiredPermissions;
  requiredRoles?: RequiredRoles;
  fullMatch?: boolean;
  children?: React.ReactNode;
}
const ConditionalRenderer: React.FC<ConditionalRenderProps> = (props) => {
  const {requiredPermissions, requiredRoles, children, fullMatch} = props;
  const render = useCheckPermissions(
    requiredPermissions,
    requiredRoles,
    fullMatch,
  );

  return render && children ? <>{children}</> : null;
};

export interface FeatureToggleGuardProps {
  feature: TOGGLE_FEATURES;
  children: React.ReactNode;
}

export const FeatureToggleGuard = (props: FeatureToggleGuardProps) => {
  const {feature, children} = props;
  const isFeatureEnabled = getIsFeatureEnabled(feature);

  return isFeatureEnabled && children ? <>{children}</> : null;
};

export default ConditionalRenderer;
