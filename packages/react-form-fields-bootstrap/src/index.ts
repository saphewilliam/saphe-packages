import { FieldPack, FieldTypes } from '@saphe/react-form';
import BSCheckBoxField from './components/BSCheckBoxField';
import BSFormFieldContainer from './components/BSFormFieldContainer';
import BSSelectField from './components/BSSelectField';
import BSSubmitButton from './components/BSSubmitButton';
import BSTextAreaField from './components/BSTextAreaField';
import BSTextField from './components/BSTextField';

export const BootstrapFieldPack: FieldPack = {
  FormFieldContainer: BSFormFieldContainer,
  SubmitButton: BSSubmitButton,
  [FieldTypes.TEXT]: BSTextField,
  [FieldTypes.TEXTAREA]: BSTextAreaField,
  [FieldTypes.SELECT]: BSSelectField,
  [FieldTypes.CHECKBOX]: BSCheckBoxField,
};
