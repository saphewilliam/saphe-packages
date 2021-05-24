import React from 'react';
import { TextFieldProps } from '../../utils/fieldTypes';
import BSTextField from '../packs/bootstrap/BSTextField';

function TextField(props: TextFieldProps): JSX.Element {
  return <BSTextField {...props} />;
}

export default TextField;
