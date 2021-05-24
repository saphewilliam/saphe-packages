import React, { ReactElement } from 'react';
import { FormFieldContainerProps } from '../utils/fieldPropTypes';
import { FieldPack } from '../utils/helperTypes';

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
