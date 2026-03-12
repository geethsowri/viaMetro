import { useState, useEffect } from 'react';
import { Train, ArrowUpDown, Sun, Moon } from 'lucide-react';
import StationAutocomplete from './components/StationAutocomplete';
import RouteResult from './components/RouteResult';
import { findShortestRoute } from './utils/routeFinder';
import './index.css';

function App() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [routeData, setRouteData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSwap = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
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
      <header className="app-header">
        <div className="header-title">
          <Train size={20} className="title-icon" />
          <h1>viaMetro</h1>
        </div>
        <button
          className="icon-btn theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      <main className="app-main">
        <aside className="app-sidebar">
          <div className="panel">
            <h2 className="panel-title">Route Configuration</h2>
            <div className="routing-controls">
              <StationAutocomplete
                label="Source"
                placeholder="Select departure"
                value={source}
                onChange={(val) => {
                  setSource(val);
                  setRouteData(null);
                }}
                unavailableStations={destination ? [destination] : []}
              />

              <button className="icon-btn swap-btn" onClick={handleSwap} aria-label="Swap stations" title="Swap stations">
                <ArrowUpDown size={16} />
              </button>

              <StationAutocomplete
                label="Destination"
                placeholder="Select arrival"
                value={destination}
                onChange={(val) => {
                  setDestination(val);
                  setRouteData(null);
                }}
                unavailableStations={source ? [source] : []}
              />

              <button
                className="btn btn-primary calculate-btn"
                onClick={handleCalculate}
                disabled={!source || !destination}
              >
                Calculate Route
              </button>
            </div>
          </div>
        </aside>

        <section className="app-content">
          <RouteResult routeData={routeData || {}} />
        </section>
      </main>
    </div>
  );
}

export default App;
