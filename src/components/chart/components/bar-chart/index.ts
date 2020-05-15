import { extent, scaleSequential, scaleBand, interpolateViridis, scaleLinear, select } from 'd3';

import { UpdateScales, ChartComponentProps } from '../../types';

const barChart = (props: ChartComponentProps) => {
  const { svg, data, labels, values, height, props: { duration = 600 }, options } = props;

  const bars = select(svg)
    .selectAll('.bar')
    .data(data, (d, i) => labels[i]);

  const update = (d: any) => {
    d.transition().duration(duration)
      .attr('x', (d: any, i: number): any => options.width(labels[i]))
      .attr('y', (d: any, i: number) => options.height(values[i]))
      .attr('width', options.width.bandwidth())
      .attr('height', (d: any, i: number) => height - options.height(values[i]))
      .style('fill', (d: any, i: number) => options.colors(i));
  };

  bars.exit().remove();

  bars.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('y', height)
    .attr('x', (d, i): any => options.width(labels[i]))
    .attr('width', options.width.bandwidth())
    .attr('height', 0)
    .call(update);

  update(bars);
};

barChart.getOptions = () => (
  {
    colors: scaleSequential(interpolateViridis),
    width: scaleBand().padding(.2),
    height: scaleLinear()
  }
);

barChart.updateOptions = <Options>(options: Options | any, props: UpdateScales): Options | any => {
  const { width, height, data, labels, values } = props;

  options.width
    .domain(labels)
    .range([0, width]);

  options.height
    .domain(extent(values))
    .nice()
    .range([height, 0]);

  options.colors.domain([0, data.length]);

  return options;
};

export default barChart;
