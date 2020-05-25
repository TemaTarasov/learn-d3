import React from 'react';

import uniqid from 'uniqid';
import dayjs from 'dayjs';

import Chart from './components/chart-generator';

const mock = () => new Array(Math.floor(Math.random() * 100))
  .fill(0)
  .map(() => (
    { label: uniqid(), value: Math.floor(Math.random() * 1000) }
  ));

const App = () => {
  const [data, setData] = React.useState(mock);

  React.useEffect(() => {
    setTimeout(() => {
      console.log('update:', dayjs().format('LTS'));

      setData(mock());
    }, 5000);
  });

  return (
    <Chart data={data} type="barchart" />
  );
};

App.displayName = 'App';
export default App;
