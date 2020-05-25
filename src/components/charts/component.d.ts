import { Props as ChartGenerator, GetLabel, GetValue } from '../chart-generator/index.d';

export interface Props {
  svg: any
  container: any,
  width: number,
  height: number,
  data: any,
  labels: string[],
  values: values[],
  props: ChartGenerator,
  getLabel: GetLabel,
  getValue: GetValue
}

export class Component<Props> {
  unmount(props: Props);

  update(props: Props);

  render(props: Props);
}
