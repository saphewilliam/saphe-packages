import React, { ReactElement } from 'react';
import { FieldContainerProps } from '../../lib/props';
import { AddFieldPack } from '../../lib/util';

export default function FieldContainer(props: AddFieldPack<FieldContainerProps>): ReactElement {
  return props.fieldPack?.FieldContainer ? (
    <props.fieldPack.FieldContainer>{props.children}</props.fieldPack.FieldContainer>
  ) : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '25px',
      }}
    >
      {props.children}
    </div>
  );
}
