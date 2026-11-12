export type NotificationTimingMenuProps = {
  value: number;
  options: readonly number[];
  getLabel: (value: number) => string;
  onChange: (value: number) => void;
};
