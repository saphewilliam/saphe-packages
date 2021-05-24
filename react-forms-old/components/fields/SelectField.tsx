import React from 'react';
import BSSelectField from '../../../../react-form-fields-bootstrap/src/components/BSSelectField';
import { SelectFieldProps } from '../../utils/fieldTypes';

function SelectField(props: SelectFieldProps): JSX.Element {
  return <BSSelectField {...props} />;
}

export default SelectField;
