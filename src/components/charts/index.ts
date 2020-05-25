import store from '@/hocs/store';

import BarChart from './bar-chart';

const Charts = store('Charts');

Charts.define('barchart', BarChart);

export default Charts;
