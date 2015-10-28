(function () {
    "use strict";

    var flow = {};

    var getFlow = function () {
        return flow;
    };

    var getNodes = function () {
        return flow.nodes;
    };

    var getClusters = function () {
        let clusters = [];
        Object.keys(flow.nodes).forEach(function (nodeId) {
            if(flow.nodes[nodeId].isCluster) {
                clusters.push(flow.nodes[nodeId]);
            }
        });
        return clusters;
    };

    var create = function (graph) {
        flow.nodes = {};
        for(let _nodeId of Object.keys(graph._nodes)) {
            flow.nodes[_nodeId] = {};
            let flowNode = flow.nodes[_nodeId];
            flowNode.id = _nodeId;
            flowNode.properties = graph._nodes[_nodeId];

            flowNode.children = getChildren(graph, _nodeId);
            flowNode.parents = getParent(graph, _nodeId);

            flowNode.isCluster = (isCluster(graph._children[_nodeId]));
            if(flowNode.isCluster) {
                flowNode.cluster = setCluster(graph, _nodeId);
            }

        }
        setClustersLinks();
        graph._flow = flow;
    };

    var getChildren = function (graph, _nodeId) {
        let _out = graph._out[_nodeId];
        let children = {};
        for(let child of Object.keys(_out)) {
            children[_out[child].w] = true;
        }
        return children;
    };

    var getParent = function (graph, _nodeId) {
        let parents = {};
        let _in = graph._in[_nodeId];
        for(let parent of Object.keys(_in)) {
            parents[_in[parent].v] = true;
        }
        return parents;
    };

    var setCluster = function (graph, _nodeId) {
        let cluster = {
            isExpanded: true,
            contents: {}
        };
        let graphCluster = graph._children[_nodeId];
        cluster.contents = setClusterContent(graph, graphCluster);
        cluster.edges = setClusterEdges(graph, Object.keys(cluster.contents));
        return cluster;
    };

    var setClusterContent = function (graph, cluster) {
        let contents = {};
        for(let child of Object.keys(cluster)) {
            contents[child] = true;
            if(isCluster(graph._children[child])) {
                let innerContent = setClusterContent(graph, graph._children[child]);
                Object.assign(contents, innerContent);
            }
        }
        return contents;
    };

    var setClusterEdges = function (graph, clusterNodes) {
        let edges = {
            inner: [],
            outer: {
                input: [],
                output: []
            }
        };

        for(let nodeId of clusterNodes) {
            let outEdges = graph._out[nodeId];
            for(let edgeKey of Object.keys(outEdges)) {
                let _edge = outEdges[edgeKey];
                let nodes = clusterNodes.filter(function (_node) {
                    return _node === _edge.w;
                });
                if(nodes.length > 0) {
                    edges.inner.push({v: _edge.v, w: _edge.w});
                }
                else {
                    edges.outer.output.push({v: _edge.v, w: _edge.w});
                }
            }

            let inEdges = graph._in[nodeId];
            for(let edgeKey of Object.keys(inEdges)) {
                let _edge = inEdges[edgeKey];
                let nodes = clusterNodes.filter(function (_node) {
                    return _node === _edge.v;
                });
                if (nodes.length === 0) {
                    edges.outer.input.push({v: _edge.v, w: _edge.w});
                }
            }
        }

        return edges;
    };

    var setClustersLinks = function () {
        let clusters = getClusters();
        for(let clusterNode of clusters) {
            let outputEdges = clusterNode.cluster.edges.outer.output;
            for(let edge of outputEdges) {
                let linkCluster = findClusterByInnerEdge(edge, clusterNode.id);
                if(linkCluster) {
                    edge.linkToCluster = linkCluster.id;
                }
            }
        }
    };

    var findClusterByInnerEdge = function (edge, linkId) {
        let clusters = getClusters();
        let resCluster = null;
        for (let clusterNode of clusters) {
            let edges = clusterNode.cluster.edges.outer.input;
            let res = edges.filter(function (_edge) {
                return JSON.stringify(edge) === JSON.stringify(_edge);
            });
            if(res.length > 0) {
                res[0].linkToCluster = linkId;
                resCluster = clusterNode;
                break;
            }
        }
        return resCluster;
    };

    var isCluster = function (cluster) {
        return (Object.keys(cluster).length > 0);
    };

    var expandCluster = function (clusterId) {
        if(flow.nodes[clusterId] && flow.nodes[clusterId].cluster) {
            flow.nodes[clusterId].cluster.isExpanded = true;
        }
    };

    var collapseCluster = function (clusterId) {
        if(flow.nodes[clusterId] && flow.nodes[clusterId].cluster) {
            flow.nodes[clusterId].cluster.isExpanded = false;
        }
    };

    module.exports = {
        create: create,
        getFlow: getFlow,
        getNodes: getNodes,
        getClusters: getClusters,
        expandCluster: expandCluster,
        collapseCluster: collapseCluster
    };
})();