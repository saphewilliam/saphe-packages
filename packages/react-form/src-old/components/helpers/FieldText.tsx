import { ReactElement } from 'react';

interface Props {
  describedBy: string;
  description?: string;
  error: string;
  id: string;
}

export default function FieldText(props: Props): ReactElement {
  return (
    <>
      {props.error && (
        <p style={{ margin: 0, color: 'red' }} data-testid={`${props.id}Error`}>
          {props.error}
        </p>
      )}
      {props.description && (
        <p style={{ margin: 0 }} id={props.describedBy}>
          {props.description}
        </p>
      )}
    </>
  );
}
