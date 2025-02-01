export interface Props {
  show: boolean;
  hasSuccess: boolean;
  entityUrl?: string;
  remove: boolean;
}

export interface Emits {
  (e: 'close'): void;
}
