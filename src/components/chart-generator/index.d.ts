export type GetLabel = (item: any) => string;
export type GetValue = (item: any) => number;

export interface Props {
  id?: string,
  type: string,
  data: any,
  getLabel?: GetLabel,
  getValue?: GetValue,
  mapper?: (data: any) => any,
  duration?: number
}
