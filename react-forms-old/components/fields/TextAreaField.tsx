import React from 'react';
import { TextAreaFieldProps } from '../../utils/fieldTypes';
import BSTextAreaField from '../packs/bootstrap/BSTextAreaField';

function TextAreaField(props: TextAreaFieldProps): JSX.Element {
  const { rows = 6 } = props;

  return <BSTextAreaField {...props} rows={rows} />;
}

export default TextAreaField;
