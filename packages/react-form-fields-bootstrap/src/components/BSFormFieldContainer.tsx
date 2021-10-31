import { Props } from '@saphe/react-form';
import React, { ReactElement } from 'react';

export default function BSFormFieldContainer(props: Props.FormFieldContainerProps): ReactElement {
  return <div className="mb-3">{props.children}</div>;
}
