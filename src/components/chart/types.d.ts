import { ReactFauxDomProps } from 'react-faux-dom';

export type ChartLabels = string[];
export type ChartValues = number[];

export interface ChartProps extends ReactFauxDomProps {
  padding?: number,
  id?: string,
  data?: any,
  type?: string,
  duration?: number,
  getLabel?: (item: any) => string,
  getValue?: (item: any) => number,
  mapper?: (data: any) => []
}

export interface ChartState {
  width: number,
  height: number
}

export interface UpdateScales {
  width: number,
  height: number,
  data: any,
  labels: ChartLabels,
  values: ChartValues
}

export interface ChartComponentProps {
  svg: any,
  data: any,
  labels: ChartLabels,
  values: ChartValues,
  width: number,
  height: number,
  props: ChartProps,
  state: ChartState,
  options: any
}
