import APIRequest, {getCancelToken} from 'api';
import {AxiosError, Canceler} from 'axios';
import {useCredentials} from 'modules/user/user.hooks';
import React, {useCallback, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import {CourseInfo, DiscountInfo} from 'types/entities';
import {SimpleCallback} from 'types/utility/common';

export type DiscountHookResult = {
  discount?: DiscountInfo;
  error?: AxiosError;
  reload: SimpleCallback;
  isLoading: boolean;
};

export function useDiscount(
  selectedCourses: Set<CourseInfo> | number,
): DiscountHookResult {
  const {credentials} = useCredentials();
  const [discount, setDiscount] = React.useState<DiscountInfo>();
  const [error, setError] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const cancelRef = useRef<Canceler>();
  const fetchDiscount = useCallback(async () => {
    const courses =
      selectedCourses instanceof Set
        ? [...selectedCourses].map(({id}) => id)
        : [selectedCourses];

    if (courses.length === 0) {
      return;
    }
    const cancelPrev = cancelRef.current;

    if (cancelPrev) {
      cancelPrev();
    }
    const {token: cancelToken, cancel} = getCancelToken();
    cancelRef.current = cancel;
    try {
      if (error) {
        setError(undefined);
      }
      // setDiscount(null);
      setLoading(true);
      const discount: DiscountInfo = await APIRequest.get(
        '/payments/discounts',
        {
          params: {
            coursesIds: courses,
          },
          cancelToken,
        },
      );
      setDiscount(discount);
    } catch (e) {
      console.error('Error loading discount', e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [selectedCourses, error]);

  React.useEffect(() => {
    if (credentials && !error) {
      fetchDiscount();
    }
  }, [credentials, selectedCourses, error, fetchDiscount]);

  return {discount, error, reload: fetchDiscount, isLoading};
}

export type RedirectHookResult = SimpleCallback;

export function useRedirect(redirectUrl?: string): RedirectHookResult {
  const history = useHistory();

  return useCallback(() => {
    if (redirectUrl) {
      history.replace(redirectUrl);
    }
  }, [history, redirectUrl]);
}
