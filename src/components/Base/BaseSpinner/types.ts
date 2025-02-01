export type SpinnerSize = 'mini' | 'small' | 'medium' | 'large' | 'huge';

export type SpinnerSpeed =
  | 'very-slow'
  | 'slow'
  | 'average'
  | 'fast'
  | 'very-fast';

export interface Props {
  color?: string;
  size?: SpinnerSize;
  speed?: SpinnerSpeed;
}
