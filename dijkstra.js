
// 1. DEFINE THE EDGES

const edges = [
    ["Blantyre", "Chiradzulu", 25],
    ["Blantyre", "Thyolo", 40],
    ["Blantyre", "Mulanje", 65],
    ["Thyolo", "Mulanje", 60],
    ["Blantyre", "Chikwawa", 50],
    ["Chikwawa", "Nsanje", 100],
    ["Blantyre", "Zomba", 65],
    ["Chiradzulu", "Zomba", 45],
    ["Zomba", "Machinga", 55],
    ["Machinga", "Mangochi", 70],
    ["Machinga", "Balaka", 35],
    ["Balaka", "Ntcheu", 75],
    ["Ntcheu", "Dedza", 50],
    ["Dedza", "Lilongwe", 85],
    ["Lilongwe", "Salima", 100],
    ["Salima", "Nkhotakota", 90],
    ["Salima", "Mangochi", 110],
    ["Lilongwe", "Kasungu", 120],
    ["Nkhotakota", "Kasungu", 110],
    ["Kasungu", "Mzimba", 130],
    ["Mzimba", "Rumphi", 100],
    ["Rumphi", "Karonga", 150],
    ["Karonga", "Chitipa", 100]
];


// 2. BUILD THE GRAPH

function buildGraph(edges) {
    const graph = {};

    for (const [a, b, w] of edges) {

        if (w < 0) {
            throw new Error("Negative weight: " + a + "-" + b);
        }

        if (!graph[a]) graph[a] = [];
        if (!graph[b]) graph[b] = [];

        // Add both directions (undirected graph)
        graph[a].push([b, w]);
        graph[b].push([a, w]);
    }

    return graph;
}


// 3. DIJKSTRA'S ALGORITHM

function dijkstra(graph, source) {

    if (!graph[source]) {
        throw new Error("Unknown starting town: " + source);
    }

    const dist = {};
    const prev = {};
    const done = new Set();

    // Initialize distances
    for (const v in graph) {
        dist[v] = Infinity;
        prev[v] = null;
    }

    dist[source] = 0;

    while (done.size < Object.keys(graph).length) {

        let u = null;

        // Find the unvisited vertex with the smallest distance
        for (const v in graph) {
            if (
                !done.has(v) &&
                (u === null || dist[v] < dist[u])
            ) {
                u = v;
            }
        }

        if (u === null || dist[u] === Infinity) {
            break;
        }

        done.add(u);

        // Check neighbouring vertices
        for (const [v, w] of graph[u]) {

            if (done.has(v)) continue;

            const newDistance = dist[u] + w;

            if (newDistance < dist[v]) {
                dist[v] = newDistance;
                prev[v] = u;
            }
        }
    }

    return { dist, prev };
}


// 4. RECONSTRUCT THE SHORTEST PATH

function pathTo(dist, prev, target) {

    if (!(target in dist)) {
        throw new Error("Unknown destination: " + target);
    }

    if (dist[target] === Infinity) {
        return null;
    }

    const path = [];

    for (let v = target; v !== null; v = prev[v]) {
        path.unshift(v);
    }

    return path;
}


if (typeof module !== "undefined") {
    module.exports = { edges, buildGraph, dijkstra, pathTo };
}

if (typeof window !== "undefined") {
    window.edges = edges;
    window.buildGraph = buildGraph;
    window.dijkstra = dijkstra;
    window.pathTo = pathTo;
}

if (typeof require !== "undefined" && require.main === module) {
    const graph = buildGraph(edges);
    const source = "Blantyre";
    const target = "Chitipa";
    const { dist, prev } = dijkstra(graph, source);
    const path = pathTo(dist, prev, target);

    console.log("========== DIJKSTRA RESULTS ==========");
    console.log("Starting point:", source);
    console.log("Destination:", target);
    console.log("Shortest distance:", dist[target], "km");

    if (path !== null) {
        console.log("Shortest path:", path.join(" -> "));
    } else {
        console.log("No route exists.");
    }

    console.log("Total nodes:", Object.keys(graph).length);
    console.log("Total edges:", edges.length);
    console.log("======================================");
}
