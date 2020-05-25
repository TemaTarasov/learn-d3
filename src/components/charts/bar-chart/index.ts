import { extent, scaleSequential, scaleBand, interpolateViridis, scaleLinear, select } from 'd3';

import Component, { Props } from '../component';

export default class extends Component {
  protected colors = scaleSequential(interpolateViridis);
  protected width = scaleBand().padding(.2);
  protected height = scaleLinear();

  protected content: any;

  getContent(props: Props) {
    const { svg } = props;

    return select(svg).selectAll('.content').data(['mock']);
  }

  unmount(props: Props) {
    this.getContent(props).exit().remove();
  }

  update(props: Props) {
    const { width, height, data, labels, values } = props;

    this.width
      .domain(labels)
      .range([0, width]);

    this.height
      // @ts-ignore
      .domain(extent(values))
      .nice()
      .range([height, 0]);

    this.colors.domain([0, data.length]);
  }

  render(props: Props) {
    this.unmount(props);

    const content = this.getContent(props);

    content
      .enter()
      .append('g')
      .attr('class', 'content')
      .call(this.bars.bind(this, props));

    return this.bars(props, content);
  }

  bars(props: Props, d: any) {
    const { height, labels, } = props;

    const bars = d.selectAll('.bar').data(labels);

    bars.exit().remove();

    bars
      .data(labels)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', height)
      .attr('x', (d: any, i: number): any => this.width(labels[i]))
      .attr('width', this.width.bandwidth())
      .attr('height', 0)
      .call(this.updateBars.bind(this, props));

    return this.updateBars(props, bars);
  }

  updateBars(props: Props, d: any) {
    const { height, labels, values, props: { duration = 600 } } = props;

    d.transition().duration(duration)
      .attr('x', (d: any, i: number): any => this.width(labels[i]))
      .attr('y', (d: any, i: number) => this.height(values[i]))
      .attr('width', this.width.bandwidth())
      .attr('height', (d: any, i: number) => height - this.height(values[i]))
      .attr('fill', (d: any, i: number) => this.colors(i));

    return d;
  }
}
