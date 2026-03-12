import { MapPin, ArrowRightCircle } from 'lucide-react';
import { getLineColor, getLineName } from '../utils/routeFinder';
import networkData from '../data/metro-network-graph.json';

const RouteResult = ({ routeData }) => {
    const { path, interchanges, totalStops, fare } = routeData;

    if (!path || path.length === 0) {
        return (
            <div className="panel">
                <div className="empty-state">
                    <MapPin size={32} className="empty-state-icon" />
                    <p>Select departure and destination to view optimal route.</p>
                </div>
            </div>
        );
    }

    const isInterchange = (station) => interchanges.find(i => i.station === station);

    const getInitialLine = () => {
        if (interchanges.length > 0) return interchanges[0].fromLine;
        if (path.length > 1) {
            const from = path[0], to = path[1];
            const edge = networkData.edges.find(e => (e.from === from && e.to === to) || (e.from === to && e.to === from));
            return edge ? edge.line : null;
        }
        return null;
    };

    const getJourneyDetails = () => {
        let currentColor = getLineColor(getInitialLine());
        return path.map(station => {
            const interchangeDetails = isInterchange(station);
            const dotColor = currentColor;

            if (interchangeDetails) {
                currentColor = getLineColor(interchangeDetails.toLine);
            }

            return {
                station,
                interchangeDetails,
                lineColor: dotColor,
                newLineColor: currentColor
            };
        });
    };

    const journeyDetails = getJourneyDetails();

    return (
        <div className="panel">
            <h2 className="panel-title">Route Summary</h2>

            <div className="results-grid">
                <div className="stat-card">
                    <span className="stat-card-label">Total Stops</span>
                    <span className="stat-card-value">{totalStops}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card-label">Est. Fare</span>
                    <span className="stat-card-value">₹{fare}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card-label">Transfers</span>
                    <span className="stat-card-value">{interchanges.length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card-label">Est. Time</span>
                    <span className="stat-card-value">
                        {path.length > 0 ? (totalStops * 2) + Math.max(0, interchanges.length * 5) : 0}m
                    </span>
                </div>
            </div>

            <h3 className="panel-title" style={{ marginTop: '1.5rem', borderBottom: 'none', paddingBottom: 0 }}>Itinerary</h3>

            <div className="route-path">
                {journeyDetails.map(({ station, interchangeDetails, newLineColor }, index) => {
                    return (
                        <div key={`${station}-${index}`} className="route-step">
                            <div className="route-step-indicator">
                                <div className="route-line" />
                                <div
                                    className={`route-dot ${interchangeDetails ? 'interchange' : ''}`}
                                    style={{
                                        borderColor: newLineColor,
                                        backgroundColor: interchangeDetails ? undefined : newLineColor
                                    }}
                                />
                            </div>

                            <div className="route-step-content">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                                    <span className="station-name">{station}</span>
                                    {index === 0 && <span className="tag tag-start">Start</span>}
                                    {index === path.length - 1 && <span className="tag tag-success">End</span>}
                                </div>

                                {interchangeDetails && (
                                    <div className="interchange-notice">
                                        <ArrowRightCircle size={12} color={newLineColor} />
                                        <span>Transfer to <strong style={{ color: newLineColor }}>{getLineName(interchangeDetails.toLine)}</strong></span>
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
