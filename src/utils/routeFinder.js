import networkData from '../data/metro-network-graph.json';
import fareData from '../data/fair-chart.json';

// BFS to find the shortest path (minimum stops) between two stations.
export const findShortestRoute = (source, destination) => {
    if (source === destination) {
        return processPath([source]);
    }

    const adjacencyList = networkData.adjacency_list;

    // Queue for BFS: stores the current path
    const queue = [[source]];
    const visited = new Set();
    visited.add(source);

    while (queue.length > 0) {
        const path = queue.shift();
        const currentNode = path[path.length - 1];

        if (currentNode === destination) {
            return processPath(path);
        }

        const neighbors = adjacencyList[currentNode] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([...path, neighbor]);
            }
        }
    }

    return { path: [], interchanges: [], totalStops: 0, fare: 0 }; // No route found
};

const processPath = (path) => {
    if (path.length === 0) return { path: [], interchanges: [], totalStops: 0, fare: 0 };
    if (path.length === 1) return { path, interchanges: [], totalStops: 0, fare: 0 };

    const interchanges = [];
    const edges = networkData.edges;

    const getConnectingLines = (from, to) => {
        return edges
            .filter((e) => (e.from === from && e.to === to) || (e.from === to && e.to === from))
            .map(e => e.line);
    };

    let currentLine = null;

    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];

        // An edge between 'from' and 'to' might exist on multiple lines (e.g. Ameerpet to MGBS is just one, but what if they share a segment?)
        // Actually, in this network graph, nodes are only adjacent on one specific line unless they share a segment.
        const connectingLines = getConnectingLines(from, to);
        if (connectingLines.length === 0) continue;

        let edgeLine;

        // If we are already on a line that connects these two stations, stay on it.
        if (currentLine !== null && connectingLines.includes(currentLine)) {
            edgeLine = currentLine;
        } else {
            // Otherwise, we MUST switch lines. We pick the first available. 
            // Better yet, look ahead to see which line continues further to prevent unnecessary rapid switching.
            // Simplified: pick the connecting line that the NEXT station is also on, if possible.
            edgeLine = connectingLines[0];
            if (connectingLines.length > 1 && i + 2 < path.length) {
                const nextTo = path[i + 2];
                const nextConnectingLines = getConnectingLines(to, nextTo);
                const commonLine = connectingLines.find(l => nextConnectingLines.includes(l));
                if (commonLine) edgeLine = commonLine;
            }
        }

        if (currentLine === null) {
            currentLine = edgeLine;
        } else if (currentLine !== edgeLine) {
            interchanges.push({
                station: from,
                fromLine: currentLine,
                toLine: edgeLine
            });
            currentLine = edgeLine;
        }
    }

    const source = path[0];
    const destination = path[path.length - 1];
    const totalStops = path.length - 1;
    const fare = getFare(source, destination, totalStops);

    return {
        path,
        interchanges,
        totalStops,
        fare
    };
};

export const getFare = (source, destination, totalStops = 0) => {
    if (!fareData.fares[source] || fareData.fares[source][destination] === undefined) {
        if (totalStops === 0) return 0;
        // Basic fallback estimation: 10 base + 5 for every 2 stops, up to a typical max of 60.
        const estimated = 10 + Math.floor((totalStops - 1) / 2) * 5;
        return Math.min(60, estimated);
    }
    return fareData.fares[source][destination];
};

export const getAllStations = () => {
    return fareData.stations;
};

export const getLineColor = (lineId) => {
    return networkData.lines[lineId]?.color || '#888';
};

export const getLineName = (lineId) => {
    return networkData.lines[lineId]?.name || 'Unknown Line';
}
