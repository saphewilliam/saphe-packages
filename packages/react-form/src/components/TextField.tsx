import { ReactElement } from 'react';

// TODO strongly type props
export default function TextField(props: { label: string }): ReactElement {
  return <p>{props.label}</p>;
}
