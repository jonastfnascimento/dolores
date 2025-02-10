export interface Props {
  steps: Array<{
    label: string;
    active: boolean;
    ancor: string;
  }>;
}

export interface Emits {
  (e: 'scrollToElement', value: string): void;
}
