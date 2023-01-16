export const BSSelectField = 'void';

// import { Props } from '@saphe/react-form';
// import { ReactElement } from 'react';
// import BSFieldText from './BSFieldText';

// export default function BSSelectField(props: Props.SelectProps): ReactElement {
//   return (
//     <>
//       {props.label && (
//         <label htmlFor={props.id} className="form-label">
//           {props.label}
//         </label>
//       )}

//       <select
//         className={`form-select${props.error ? ' is-invalid' : ''}`}
//         id={props.id}
//         name={props.name}
//         value={props.value ?? ''}
//         disabled={props.disabled}
//         onChange={(e) => props.onChange(e.target.value)}
//         onBlur={props.onBlur}
//         aria-describedby={props.describedBy}
//       >
//         <option value="" disabled>
//           {props.placeholder ?? ''}
//         </option>
//         {props.options.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//       <BSFieldText {...props} />
//     </>
//   );
// }
