export interface Props {
  placeholder: string;
}

export interface Emits {
  (e: 'change', value: string): void;
}
