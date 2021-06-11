import React, { ReactElement } from 'react';

interface Props {
  describedBy: string;
  description?: string;
  error: string;
}

export default function FieldText(props: Props): ReactElement {
  return (
    <>
      {props.description && (
        <div id={props.describedBy}>{props.description}</div>
      )}
      {props.error && <div>{props.error}</div>}
    </>
  );
}
