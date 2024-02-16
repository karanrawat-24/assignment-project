import  { useState } from 'react';
import Plot from 'react-plotly.js';
import './App.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const apiKey = 'FCT7SMKMG759YC7A';
  const searchStock = () => {
    fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        setStockData(data);
        setSelectedSession(null);
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  const handlePointClick = (event) => {
    const { points } = event;
    if (points.length > 0) {
      const date = points[0].x;
      const timeSeries = stockData['Time Series (Daily)'];
      const session = timeSeries[date];
      setSelectedSession(session);
    }
  };

  return (
    <div className='App'>
      <h1>Stock Search</h1>
      <input
        type='text'
        placeholder='Enter stock symbol'
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <button onClick={searchStock}>Search</button>
      {stockData && (
        <div>
          <h2>{stockData['Meta Data']['2. Symbol']}</h2>
          <p>Company Name: {stockData['Meta Data']['2. Name']}</p>
          <p>Market: {stockData['Meta Data']['3. Market']}</p>
          <p>Currency: {stockData['Meta Data']['8. Currency']}</p>
        </div>
      )}
      {stockData && (
        <Plot
          data={[
            {
              x: Object.keys(stockData['Time Series (Daily)'])
                .slice(0, 100)
                .reverse(),
              y: Object.values(stockData['Time Series (Daily)'])
                .slice(0, 100)
                .map((session) => parseFloat(session['4. close']))
                .reverse(),
              type: 'scatter',
              mode: 'lines',
              name: 'Closing Price',
            },
          ]}
          layout={{
            title: 'Stock Price Last 100 Sessions',
            xaxis: { title: 'Date' },
            yaxis: { title: 'Closing Price' },
          }}
          onClick={handlePointClick}
        />
      )}
      {selectedSession && (
        <div>
          <h3>Detailed Information for {selectedSession['date']}</h3>
          <p>Open: {selectedSession['1. open']}</p>
          <p>High: {selectedSession['2. high']}</p>
          <p>Low: {selectedSession['3. low']}</p>
          <p>Close: {selectedSession['4. close']}</p>
        </div>
      )}
    </div>
  );
}

export default App;
