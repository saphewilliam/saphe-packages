import React, { ReactElement } from 'react';
import { AddFieldPack } from '../utils/helperTypes';
import { FormFieldContainerProps } from '../utils/propTypes';

export default function FormFieldContainer(
  props: AddFieldPack<FormFieldContainerProps>,
): ReactElement {
  return props.fieldPack?.FormFieldContainer ? (
    <props.fieldPack.FormFieldContainer>
      {props.children}
    </props.fieldPack.FormFieldContainer>
  ) : (
    <div>{props.children}</div>
  );
}
