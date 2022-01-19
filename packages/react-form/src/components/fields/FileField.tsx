import React, { ReactElement } from 'react';
import { getFieldStyle } from '../../lib/form';
import { FileProps } from '../../lib/props';
import { AddFieldPack } from '../../lib/util';
import FieldContainer from '../helpers/FieldContainer';
import FieldText from '../helpers/FieldText';

export default function FileField(props: AddFieldPack<FileProps>): ReactElement {
  return (
    <FieldContainer fieldPack={props.fieldPack}>
      {props.fieldPack?.FILE ? (
        <props.fieldPack.FILE {...props} />
      ) : (
        <>
          <label htmlFor={props.id}>{props.label}</label>
          <label style={{ cursor: 'pointer', ...getFieldStyle(props.error) }}>
            <span>{props.value?.name ?? 'No file chosen'}</span>
            <input
              type="file"
              id={props.id}
              name={props.name}
              disabled={props.disabled}
              // TODO
              // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#limiting_accepted_file_types
              // accept="image/png, image/jpeg"
              // accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              // multiple={false}
              onChange={(e) => props.onChange(e.target.files?.item(0) ?? null)}
              onBlur={props.onBlur}
              aria-describedby={props.describedBy}
              style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: 0,
              }}
            />
          </label>
          <FieldText {...props} />
        </>
      )}
    </FieldContainer>
  );
}
