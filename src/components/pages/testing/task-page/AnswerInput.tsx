import * as Input from 'components/ui/input';
import {InputChangeHandler} from 'components/ui/input/Input';
import React, {forwardRef, useCallback, useMemo} from 'react';
import {FileInfo} from 'types/dtos';
import {AnswerType} from 'types/entities';
import {SimpleCallback} from 'types/utility/common';

export interface AnswerInputProps {
  type: AnswerType;
  value: string | FileInfo[];
  onInputChange: InputChangeHandler<any, any>;
  onFormChange: SimpleCallback;
}

export const AnswerInput = forwardRef<HTMLFormElement, AnswerInputProps>(
  (props, ref) => {
    const {type, value, onInputChange, onFormChange} = props;
    const initialValue = useMemo(() => value, [value]);

    const onChange: InputChangeHandler<any, any> = useCallback(
      (...args: Parameters<typeof onInputChange>) => {
        onFormChange();
        onInputChange(...args);
      },
      [onFormChange, onInputChange],
    );

    return (
      <form ref={ref} className="test-task__input" autoComplete="off">
        <h4 className="test-task__input-title">Ответ</h4>
        {type === AnswerType.TEXT && (
          <Input.Input
            name="value"
            type="text"
            onChange={onChange}
            value={value as string}
          />
        )}
        {type === AnswerType.NUMBER && (
          <Input.Input
            name="value"
            type="number"
            onChange={onChange}
            value={value as string}
          />
        )}
        {type === AnswerType.FILE && (
          <Input.FileInput
            name="value"
            filesName=""
            inputContent="Загрузить решение"
            value={value as FileInfo[]}
            maxFiles={1}
            initialFiles={initialValue as FileInfo[]}
            onChange={onChange}
          />
        )}
      </form>
    );
  },
);
AnswerInput.displayName = 'AnswerInput';
