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

    const getEdge = (from, to) => {
        return edges.find(
            (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from)
        );
    };

    let currentLine = null;

    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];

        // An edge between 'from' and 'to' gives the physical line corridor
        const edge = getEdge(from, to);
        if (!edge) continue;

        const edgeLine = edge.line;

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
    const fare = getFare(source, destination);

    return {
        path,
        interchanges,
        totalStops: path.length - 1,
        fare
    };
};

export const getFare = (source, destination) => {
    if (!fareData.fares[source] || fareData.fares[source][destination] === undefined) {
        return 0; // Fallback
    }
    return fareData.fares[source][destination];
};

export const getAllStations = () => {
    return fareData.stations; // already sorted or grouped optimally, or we can sort them alphabetically
};

export const getLineColor = (lineId) => {
    return networkData.lines[lineId]?.color || '#888';
};

export const getLineName = (lineId) => {
    return networkData.lines[lineId]?.name || 'Unknown Line';
}
