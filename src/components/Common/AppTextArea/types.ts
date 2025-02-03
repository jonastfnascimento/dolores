export interface TextAreaProps {
  name?: string;
  placeholder: string;
  value: string;
  maxLength?: number;
  minLength?: number;
  rows?: number;
  cols?: number;
  error?: boolean;
  autocomplete?: 'on' | 'off';
  loading?: boolean;
}
