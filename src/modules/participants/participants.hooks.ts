import {useCheckPermissions} from 'components/ConditionalRender';
import {
  ParticipantDeleteCallback,
  ParticipantDeleteErrorCallback,
  participantsDeleteRequest,
  participantsFetch,
  participantsRevoke,
} from 'modules/participants/participants.actions';
import {selectParticipants} from 'modules/participants/participants.selectors';
import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CourseParticipantInfo} from 'types/entities';
import {Permission} from 'types/enums';

export function useParticipants(courseId: number) {
  const isAllowed = useCheckPermissions(Permission.PARTICIPANT_MANAGEMENT);
  const participants = useSelector(selectParticipants)[courseId] || undefined;
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(participantsFetch({courseId}));
  }, [courseId, dispatch]);
  useEffect(() => {
    if (isAllowed) {
      if (!participants) {
        dispatchFetchAction();
      }
    }
  }, [dispatchFetchAction, isAllowed, participants]);
  return participants instanceof Error
    ? ({error: participants, reload: dispatchFetchAction} as const)
    : ({
        participants: !isAllowed ? false : participants,
        reload: dispatchFetchAction,
      } as const);
}

export function useRevokeParticipants(courseId: number) {
  const dispatch = useDispatch();

  return useCallback(
    (data: CourseParticipantInfo[]) => {
      dispatch(participantsRevoke({courseId, data}));
    },
    [dispatch, courseId],
  );
}

export function useDeleteParticipant(
  onDelete?: ParticipantDeleteCallback,
  onError?: ParticipantDeleteErrorCallback,
) {
  const dispatch = useDispatch();

  return useCallback(
    (courseId: number, userId: number) => {
      dispatch(
        participantsDeleteRequest({
          courseId,
          userId,
          onDelete,
          onError,
        }),
      );
    },
    [dispatch, onDelete, onError],
  );
}
