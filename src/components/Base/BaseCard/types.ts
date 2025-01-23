import type { Props as ProfileImageProps } from './ProfileImage/types';

export interface Props {
  name: string;
  type: ProfileImageProps['type'];
  date: string;
  quantity: number;
}
