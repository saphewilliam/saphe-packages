import React from 'react';
import { FormStyles, TextFieldProps } from '../../utils/fieldTypes';
import BSTextField from '../packs/bootstrap/BSTextField';

interface Props extends TextFieldProps {
  formStyle: FormStyles;
}

function TextField(props: Props): JSX.Element {
  switch (props.formStyle) {
    case FormStyles.BOOTSTRAP:
      return <BSTextField {...props} />;
    case FormStyles.MATERIAL:
      return <div></div>;
  }
}

export default TextField;
