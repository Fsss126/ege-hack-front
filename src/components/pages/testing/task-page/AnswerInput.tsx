import * as Input from 'components/ui/input';
import {InputChangeHandler} from 'components/ui/input/Input';
import React, {useMemo} from 'react';
import {FileInfo} from 'types/dtos';
import {AnswerType} from 'types/entities';
import {SimpleCallback} from 'types/utility/common';

export interface AnswerInputProps {
  type: AnswerType;
  value: string | FileInfo[];
  onInputChange: InputChangeHandler<any, any>;
  onFormChange: SimpleCallback;
}

export const AnswerInput: React.FC<AnswerInputProps> = (props) => {
  const {type, value, onInputChange, onFormChange} = props;
  const initialValue = useMemo(() => value, [value]);

  return (
    <form
      className="test-task__input"
      onChange={onFormChange}
      autoComplete="off"
    >
      <h4 className="test-task__input-title">Ответ</h4>
      {type === AnswerType.TEXT && <Input.Input type="text" />}
      {type === AnswerType.NUMBER && <Input.Input type="number" />}
      {type === AnswerType.FILE && (
        <Input.FileInput
          name="value"
          filesName=""
          inputContent="Загрузить решение"
          value={value as FileInfo[]}
          maxFiles={1}
          initialFiles={initialValue as FileInfo[]}
          onChange={onInputChange}
        />
      )}
    </form>
  );
};
