import React, { ReactElement } from 'react';
import { FieldPack } from '../utils/helperTypes';
import { FormFieldContainerProps } from '../utils/propTypes';

interface Props extends FormFieldContainerProps {
  fieldPack?: FieldPack;
}

export default function FormFieldContainer(props: Props): ReactElement {
  return props.fieldPack?.FormFieldContainer ? (
    <props.fieldPack.FormFieldContainer>
      {props.children}
    </props.fieldPack.FormFieldContainer>
  ) : (
    <div>{props.children}</div>
  );
}
