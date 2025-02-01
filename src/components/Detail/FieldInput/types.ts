export interface Props {
  for: string;
  label: string;
  placeholder: string;
  type?: 'input' | 'textarea';
  value?: string;
  error: boolean;
  errorLabel?: string;
  disabled?: boolean;
}

export interface Emits {
  (e: 'change', value: string): void;
}
