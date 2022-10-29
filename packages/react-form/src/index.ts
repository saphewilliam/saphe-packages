export type { Plugin } from './lib/plugin';
export { ValidationMode } from './lib/validation';
export { State } from './lib/fieldState';
export * from './lib/plugins';
export * from './lib/types';

import { useForm } from './hooks/useForm';
export default useForm;
