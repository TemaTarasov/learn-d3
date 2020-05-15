import React from 'react';

import uniqid from 'uniqid';

import Chart from './components/chart';

const mock = () => new Array(12)
  .fill(0)
  .map(() => (
    { label: uniqid(), value: Math.floor(Math.random() * 1000) }
  ));

const App = () => {
  const [data, setData] = React.useState(mock);

  React.useEffect(() => {
    setTimeout(() => {
      setData(mock());
    }, 5000);
  });

  return (
    <Chart data={data} />
  );
};

App.displayName = 'App';
export default App;
