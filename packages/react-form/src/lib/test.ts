import { ReactElement } from 'react';
import renderer from 'react-test-renderer';

export const matchSnapshot = (component: ReactElement): void =>
  expect(renderer.create(component).toJSON()).toMatchSnapshot();
