import { Props } from '@saphe/react-form';
import React, { ReactElement } from 'react';

export default function BSFieldContainer(props: Props.FieldContainerProps): ReactElement {
  return <div className="mb-3">{props.children}</div>;
}
