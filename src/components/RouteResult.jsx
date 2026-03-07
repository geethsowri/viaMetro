import { MapPin, Navigation, Info } from 'lucide-react';
import { getLineColor, getLineName } from '../utils/routeFinder';
import networkData from '../data/metro-network-graph.json';

const RouteResult = ({ routeData }) => {
    const { path, interchanges, totalStops, fare } = routeData;

    if (!path || path.length === 0) {
        return (
            <div className="glass-card">
                <div className="empty-state">
                    <MapPin />
                    <p>Select a source and destination to view the optimal route.</p>
                </div>
            </div>
        );
    }

    // Pre-calculate line info per station for rendering
    const isInterchange = (station) => interchanges.find(i => i.station === station);

    const getInitialLine = () => {
        if (interchanges.length > 0) return interchanges[0].fromLine;
        if (path.length > 1) {
            // Find the edge between node 0 and 1
            const from = path[0], to = path[1];
            const edge = networkData.edges.find(e => (e.from === from && e.to === to) || (e.from === to && e.to === from));
            return edge ? edge.line : null;
        }
        return null;
    };

    let currentLineColor = getLineColor(getInitialLine());

    return (
        <div className="glass-card">
            <h2 className="glass-card-title">
                <Navigation size={20} className="text-accent" />
                Route Overview
            </h2>

            <div className="stats-grid">
                <div className="stat-box">
                    <div className="stat-value highlight">{totalStops}</div>
                    <div className="stat-label">Total Stops</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value">₹{fare}</div>
                    <div className="stat-label">Fare Amount</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value">{interchanges.length}</div>
                    <div className="stat-label">Interchanges</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value">{path.length > 0 ? (totalStops * 2) + Math.max(0, interchanges.length * 5) : 0}</div>
                    <div className="stat-label">Mins (Est.)</div>
                </div>
            </div>

            <div className="route-timeline">
                {path.map((station, index) => {
                    const interchangeDetails = isInterchange(station);

                    if (interchangeDetails) {
                        currentLineColor = getLineColor(interchangeDetails.toLine);
                    }

                    return (
                        <div key={`${station}-${index}`} className="timeline-item">
                            <div
                                className={`timeline-dot ${interchangeDetails ? 'interchange' : ''}`}
                                style={{ borderColor: currentLineColor }}
                            />

                            <div className="timeline-content">
                                <div className="station-name">{station}</div>

                                {index === 0 && <div className="station-meta text-accent">Journey Starts Here</div>}
                                {index === path.length - 1 && <div className="station-meta text-accent">Destination Reached</div>}

                                {interchangeDetails && (
                                    <div className="interchange-alert">
                                        <Info size={16} />
                                        <span>Change here for <strong>{getLineName(interchangeDetails.toLine)}</strong></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RouteResult;
