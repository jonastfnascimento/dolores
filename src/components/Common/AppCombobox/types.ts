export interface Item {
  id: number;
  label: string;
}

export interface Props {
  placeholder: string;
  items: Item[];
  maxLength?: number;
  minLength?: number;
  error?: boolean;
  autocomplete?: 'on' | 'off';
  loading?: boolean;
}
