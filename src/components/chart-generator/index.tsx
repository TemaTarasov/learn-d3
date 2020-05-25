import React from 'react';
import './style.scss';

import { Props } from './index.d';
import { Props as ComponentProps } from '../charts/component.d';

import uniqid from 'uniqid';
import { clone, get, isEqual } from 'lodash';

import callFn from '@/helpers/call-fn';
import debounce from '@/helpers/debounce';

import Charts from '../charts';

export default class extends React.Component<Props> {
  debounce = debounce();

  id: string;
  options: Props;

  origin: any;
  data: any = [];
  labels: string[] = [];
  values: number[] = [];

  chart: any;
  width: number = 0;
  height: number = 0;

  getLabelBound = this.getLabel.bind(this);
  getValueBound = this.getValue.bind(this);
  handleResizeBound = this.handleResize.bind(this);

  constructor(props: Props) {
    super(props);

    this.id = props.id || uniqid();
    this.options = clone(props);
  }

  public get container(): any {
    return (
      document.getElementById(this.id) || { getBoundingClientRect: () => ({}) }
    );
  }

  public get svg(): any {
    return document.getElementById(`${this.id}-svg`);
  }

  public getLabel(item: any): string {
    const getLabels = ({ label }: any) => label;

    return get(item, 'label', (
      this.options.getLabel || getLabels
    )(item));
  }

  public getValue(item: any): number {
    const getValues = ({ value }: any) => value;

    return get(item, 'value', (
      this.options.getLabel || getValues
    )(item));
  }

  protected getProps(): ComponentProps {
    const {
      svg,
      container,
      width,
      height,
      data,
      labels,
      values
    } = this;

    return {
      svg,
      container,
      width,
      height,
      data,
      labels,
      values,
      props: this.options,
      getLabel: this.getLabelBound,
      getValue: this.getValueBound
    };
  }

  componentDidMount() {
    const chart = Charts.get(this.options.type);

    if (chart) {
      this.chart = new chart(this.getProps());
    }

    this.sync(this.options);

    window.addEventListener('resize', this.handleResizeBound);
  }

  shouldComponentUpdate(props: Props) {
    if (!isEqual(props, this.options)) {
      if (props.type !== this.options.type && this.chart) {
        this.chart.unmount(this.getProps());

        const chart = Charts.get(props.type);

        if (chart) {
          this.chart = new chart();
        }
      }

      this.options = clone(props);
      this.sync(this.options);

      return false;
    }

    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResizeBound);
  }

  handleResize() {
    this.debounce.set(() => {
      this.sync(this.options);
    }, 50);
  }

  protected sync(props: Props = this.options) {
    let shouldUpdate: boolean = false;

    const { data, mapper } = props;

    if (!isEqual(data, this.origin)) {
      const result = this.data = callFn(mapper, data);

      this.origin = callFn(mapper, data);
      this.labels = result.map(this.getLabel.bind(this));
      this.values = result.map(this.getValue.bind(this));

      shouldUpdate = true;
    }

    const { width, height } = this.container.getBoundingClientRect();

    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;

      this.svg.style.width = width;
      this.svg.style.height = height;

      shouldUpdate = true;
    }

    if (shouldUpdate) {
      this.chart.update(this.getProps());
      this.chart.render(this.getProps());
    }
  }

  render() {
    return (
      <div className="chart">
        <div id={this.id} className="chart-content">
          <svg id={`${this.id}-svg`} />
        </div>
      </div>
    );
  }
}
