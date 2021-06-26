import { FieldPack, Field } from '@saphe/react-form';
import BSCheckField from './components/BSCheckField';
import BSFormFieldContainer from './components/BSFormFieldContainer';
import BSNumberField from './components/BSNumberField';
import BSSelectField from './components/BSSelectField';
import BSSubmitButton from './components/BSSubmitButton';
import BSTextAreaField from './components/BSTextAreaField';
import BSTextField from './components/BSTextField';

export const BootstrapFieldPack: FieldPack = {
  FormFieldContainer: BSFormFieldContainer,
  SubmitButton: BSSubmitButton,
  [Field.TEXT]: BSTextField,
  [Field.TEXT_AREA]: BSTextAreaField,
  [Field.SELECT]: BSSelectField,
  [Field.CHECK]: BSCheckField,
  [Field.NUMBER]: BSNumberField,
};
