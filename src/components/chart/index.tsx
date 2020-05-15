import React from 'react';
import './style.scss';

import { get, isEqual } from 'lodash';
import uniqid from 'uniqid';

import callFn from '@/helpers/call-fn';

import { withFauxDOM } from 'react-faux-dom';

import debounce from '@/helpers/debounce';

import barChart from './components/bar-chart';

import { ChartProps, ChartState } from './types';

class Chart extends React.PureComponent<ChartProps, ChartState> {
  static displayName = 'Chart';

  protected debounce = debounce();

  protected id: string;
  protected data: any = [];
  protected labels: string[] = [];
  protected values: number[] = [];

  protected options: any;
  protected instance: any;

  handleResizeBound = this.handleResize.bind(this);

  constructor(props: ChartProps) {
    super(props);

    this.id = props.id || uniqid();

    this.state = { width: 0, height: 0 };
  }

  componentDidMount() {
    const { props, handleResizeBound } = this;

    this.updateInstance(props);
    this.process(props);

    window.addEventListener('resize', handleResizeBound);
  }

  componentDidUpdate(prevProps: Readonly<ChartProps>) {
    const { data, type } = prevProps;

    if (type !== this.props.type) {
      this.updateInstance();
    }

    if (!isEqual(data, this.props.data)) {
      this.process(this.props);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResizeBound);
  }

  handleResize() {
    this.debounce.set(this.updateScales.bind(this), 50);
  }

  updateInstance(props: ChartProps = this.props) {
    const { type = 'barchart' } = props;

    if (type === 'barchart') {
      this.instance = barChart;
    }

    this.options = this.instance.getOptions();
  }

  protected getLabel(item: any): any {
    const getLabel = (item: any) => item.label;

    return get(item, 'label', (
      this.props.getLabel || getLabel
    )(item));
  }

  protected getValue(item: any): any {
    const getValue = (item: any) => item.value;

    return get(item, 'value', (
      this.props.getValue || getValue
    )(item));
  }

  get container(): any {
    return document.getElementById(`${this.id}-content`) ||
      {
        getBoundingClientRect: () => (
          {}
        )
      };
  }

  protected get svg() {
    return this.props.connectFauxDOM('g', 'content');
  }

  protected process(props: ChartProps = this.props) {
    const { data, mapper } = props;

    this.data = callFn(mapper, data);
    this.labels = [];
    this.values = [];

    this.data.forEach((item: any) => {
      this.labels.push(this.getLabel(item));
      this.values.push(this.getValue(item));
    });

    this.updateScales(props);
  }

  updateScales(props: ChartProps = this.props) {
    const { data, labels, values } = this;

    let { width = 0, height = 0 } = this.container.getBoundingClientRect();

    this.options = this.instance.updateOptions(this.options, { width, height, data, labels, values });

    this.setState({ width, height }, () => (
      this.chart(props, this.state, data)
    ));
  }

  protected chart(props: ChartProps = this.props, state: ChartState = this.state, data: [] = this.data) {
    const { svg, labels, values, options } = this;
    const { width, height } = state;

    this.instance({ svg, data, labels, values, width, height, props, state, options });

    props.animateFauxDOM(props.duration || 600);
  }

  render() {
    const { width, height } = this.state;

    const content = get(this.props, 'content');

    return (
      <div id={this.id} className="chart" key={this.id}>
        <div id={`${this.id}-content`} className="chart-content">
          <svg width={width} height={height}>
            {content}
          </svg>
        </div>
      </div>
    );
  }
}

export default withFauxDOM(Chart);
