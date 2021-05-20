import React from 'react';
import { FormStyles, SelectFieldProps } from '../../utils/fieldTypes';
import BSSelectField from '../packs/bootstrap/BSSelectField';

interface Props extends SelectFieldProps {
  formStyle: FormStyles;
}

function SelectField(props: Props): JSX.Element {
  switch (props.formStyle) {
    case FormStyles.BOOTSTRAP:
      return <BSSelectField {...props} />;
    case FormStyles.MATERIAL:
      return <div></div>;
  }
}

export default SelectField;
