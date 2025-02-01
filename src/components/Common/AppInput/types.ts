export interface Props {
  type: 'text' | 'password' | 'email';
  placeholder: string;
  value: string;
  maxLength?: number;
  minLength?: number;
  error?: boolean;
}
