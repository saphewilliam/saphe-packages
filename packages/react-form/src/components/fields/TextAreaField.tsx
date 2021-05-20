import React from 'react';
import { FormStyles, TextAreaFieldProps } from '../../utils/fieldTypes';
import BSTextAreaField from '../packs/bootstrap/BSTextAreaField';

interface Props extends TextAreaFieldProps {
  formStyle: FormStyles;
}

function TextAreaField(props: Props): JSX.Element {
  switch (props.formStyle) {
    case FormStyles.BOOTSTRAP:
      return <BSTextAreaField {...props} rows={props.rows ?? 6} />;
    case FormStyles.MATERIAL:
      return <div></div>;
  }
}

export default TextAreaField;
