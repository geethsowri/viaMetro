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
    <div className="os-window">
      {/* Fake OS Top Bar */}
      <div className="os-topbar">
        <div className="os-controls">
          <div className="os-btn close"></div>
          <div className="os-btn min"></div>
          <div className="os-btn max"></div>
        </div>
        <div className="os-title">viaMetro.exe</div>
        <div className="theme-toggle-container">
          <button
            className="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={18} strokeWidth={3} /> : <Moon size={18} strokeWidth={3} />}
          </button>
        </div>
      </div>

      <div className="os-content">
        {/* Left Sidebar */}
        <div className="os-sidebar">
          <h2 className="sidebar-title">
            <Train size={28} style={{ strokeWidth: 3, verticalAlign: 'middle', marginRight: '8px' }} />
            Plan Route
          </h2>

          <StationAutocomplete
            label="Source Station"
            placeholder="Search starting station..."
            value={source}
            onChange={(val) => {
              setSource(val);
              setRouteData(null);
            }}
            unavailableStations={destination ? [destination] : []}
          />

          <button className="swap-btn" onClick={handleSwap} aria-label="Swap stations">
            <ArrowUpDown size={24} style={{ strokeWidth: 3 }} />
          </button>

          <StationAutocomplete
            label="Destination Station"
            placeholder="Search destination..."
            value={destination}
            onChange={(val) => {
              setDestination(val);
              setRouteData(null);
            }}
            unavailableStations={source ? [source] : []}
          />

          <button
            className="btn-primary"
            onClick={handleCalculate}
            disabled={!source || !destination}
          >
            Find Route
          </button>
        </div>

        {/* Main Results Panel */}
        <div className="os-main">
          <RouteResult routeData={routeData || {}} />
        </div>
      </div>
    </div>
  );
}

export default App;
