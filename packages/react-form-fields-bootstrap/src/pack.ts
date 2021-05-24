import { FieldPack, FieldTypes } from '@saphe/react-form';
import BSCheckBoxField from './components/BSCheckBoxField';
import BSSelectField from './components/BSSelectField';
import BSTextAreaField from './components/BSTextAreaField';
import BSTextField from './components/BSTextField';

// TODO add number input
export const BootstrapFieldPack: FieldPack = {
  [FieldTypes.TEXT]: BSTextField,
  [FieldTypes.TEXTAREA]: BSTextAreaField,
  [FieldTypes.SELECT]: BSSelectField,
  [FieldTypes.CHECKBOX]: BSCheckBoxField,
};
