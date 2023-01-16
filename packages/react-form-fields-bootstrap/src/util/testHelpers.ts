export const testHelpers = 'void';

// import useForm, { Field, State } from '@saphe/react-form';
// import { renderHook } from '@testing-library/react';
// import { ReactElement } from 'react';
// import { BootstrapFieldPack } from '..';

// export const renderForm = (hook: () => State): ReactElement => renderHook(hook).result.current.form;

// export const minimalTextFieldForm = (props?: { description?: string }): State =>
//   useForm({
//     name: 'minimalTextFieldForm',
//     fieldPack: BootstrapFieldPack,
//     fields: {
//       textField: {
//         type: Field.TEXT,
//         label: 'Text Field',
//         description: props?.description,
//         // validation: {
//         //   required:
//         // }
//       },
//     },
//   });

// export const minimalTextAreaFieldForm = (props?: { description?: string }): State =>
//   useForm({
//     name: 'minimalTextAreaFieldForm',
//     fieldPack: BootstrapFieldPack,
//     fields: {
//       textAreaField: {
//         type: Field.TEXT_AREA,
//         label: 'Textarea Field',
//         description: props?.description,
//       },
//     },
//   });

// export const minimalSelectFieldForm = (props?: { description?: string }): State =>
//   useForm({
//     name: 'minimalSelectFieldForm',
//     fieldPack: BootstrapFieldPack,
//     fields: {
//       selectField: {
//         type: Field.SELECT,
//         label: 'Select Field',
//         description: props?.description,
//         options: [
//           {
//             label: 'Option 1',
//             value: 'option-1',
//           },
//           {
//             label: 'Option 2',
//             value: 'option-2',
//           },
//         ],
//       },
//     },
//   });

// export const minimalCheckFieldForm = (props?: { description?: string }): State =>
//   useForm({
//     name: 'minimalCheckFieldForm',
//     fieldPack: BootstrapFieldPack,
//     fields: {
//       checkField: {
//         type: Field.CHECK,
//         label: 'Check Field',
//         description: props?.description,
//       },
//     },
//   });

// export const minimalNumberFieldForm = (props?: { description?: string }): State =>
//   useForm({
//     name: 'minimalNumberFieldForm',
//     fieldPack: BootstrapFieldPack,
//     fields: {
//       numberField: {
//         type: Field.NUMBER,
//         label: 'Number Field',
//         description: props?.description,
//       },
//     },
//   });
