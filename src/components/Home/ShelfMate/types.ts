export interface Props {
  types: 'avatar' | 'persona' | 'content';
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: Array<any>;
}
