# main.py — Part 4: Pipeline parse endpoint with DAG detection
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Pipeline(BaseModel):
    nodes: list[dict[str, Any]]
    edges: list[dict[str, Any]]


def is_dag(nodes: list[dict], edges: list[dict]) -> bool:
    """
    Returns True if the graph formed by nodes/edges is a Directed Acyclic Graph.
    Uses Kahn's algorithm (topological sort via in-degree counting).
    """
    node_ids = {n["id"] for n in nodes}

    # Build adjacency list and in-degree map
    adj       = {nid: [] for nid in node_ids}
    in_degree = {nid: 0  for nid in node_ids}

    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")
        if src in node_ids and tgt in node_ids:
            adj[src].append(tgt)
            in_degree[tgt] += 1

    # Start with all nodes of in-degree 0
    queue = [nid for nid, deg in in_degree.items() if deg == 0]
    visited = 0

    while queue:
        node = queue.pop()
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_ids)


@app.get("/")
def root():
    return {"status": "VectorShift pipeline API running"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag       = is_dag(pipeline.nodes, pipeline.edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag":    dag,
    }
