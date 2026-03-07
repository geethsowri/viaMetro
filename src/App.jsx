import { useState } from 'react';
import { Train, ArrowUpDown } from 'lucide-react';
import StationAutocomplete from './components/StationAutocomplete';
import RouteResult from './components/RouteResult';
import { findShortestRoute } from './utils/routeFinder';
import './index.css';

function App() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [routeData, setRouteData] = useState(null);

  const handleSwap = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
    // Auto-calculate if both are selected
    if (source && destination) {
      setRouteData(findShortestRoute(destination, source));
    }
  };

  const handleCalculate = () => {
    if (source && destination) {
      const result = findShortestRoute(source, destination);
      setRouteData(result);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Hyderabad Metro Route Finder</h1>
        <p>Find the fastest route and minimum fare across the city.</p>
      </header>

      <div className="main-content">
        <div className="glass-card" style={{ alignSelf: 'start' }}>
          <h2 className="glass-card-title">
            <Train size={24} className="text-accent" />
            Plan Your Journey
          </h2>

          <StationAutocomplete
            label="From Station"
            placeholder="Search starting station..."
            value={source}
            onChange={(val) => {
              setSource(val);
              setRouteData(null); // Reset on change
            }}
            unavailableStations={destination ? [destination] : []}
          />

          <button className="swap-btn" onClick={handleSwap} aria-label="Swap stations" title="Swap stations">
            <ArrowUpDown size={20} />
          </button>

          <StationAutocomplete
            label="To Station"
            placeholder="Search destination..."
            value={destination}
            onChange={(val) => {
              setDestination(val);
              setRouteData(null); // Reset on change
            }}
            unavailableStations={source ? [source] : []}
          />

          <button
            className="btn-primary"
            onClick={handleCalculate}
            disabled={!source || !destination}
          >
            Show Route
          </button>
        </div>

        <div className="results-container">
          <RouteResult routeData={routeData || {}} />
        </div>
      </div>
    </div>
  );
}

export default App;
