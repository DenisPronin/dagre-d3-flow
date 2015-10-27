(function () {
    "use strict";

    var svg;
    var graph;
    var render;

    var init = function (_svg, _graph, _render) {
        svg = _svg;
        graph = _graph;
        render = _render;
        let $clusters = _svg.selectAll('.cluster');
        $clusters.each(function () {
            let $cluster = d3.select(this);
            addToggleLink($cluster);
        });
    };

    var addToggleLink = function ($cluster) {
        let $rect = $cluster.select('rect');
        let x = $rect.attr('x');
        let y = $rect.attr('y');

        $cluster.classed('expanded', true);
        let $toggleGroup = $cluster.append('g');
        $toggleGroup.classed('toggle-link', true);

        let $textLabel = $toggleGroup.append('text');
        $textLabel
            .text('Collapse')
            .attr('x', x)
            .attr('y', y);


        $textLabel.on('click', function (clusterId) {
            if($cluster.classed('expanded')) {
                collapseCluster($cluster, clusterId);
            }
            else {
                expandCluster($cluster, clusterId);
            }
        });

    };

    var collapseCluster = function ($cluster, clusterId) {
        console.log('collapse', clusterId);
        $cluster.classed('expanded', false);
        $cluster.style('display', 'none');

        let childrenNodes = getChild(clusterId);

        let edges = getEdges(childrenNodes);
        edges.innerEdges.forEach(function (innerEdge) {
            let edgePaths = d3.selectAll('.edgePath');
            edgePaths.each(function (edgeData) {
                if(_.isEqual(edgeData, innerEdge)) {
                    this.style.display = 'none';
                }
            });
        });
        var newNodeId = clusterId + '-collapsed';
        graph.setNode(newNodeId, graph._nodes[clusterId]);
        if(graph._parent[clusterId] !== '\x00') {
            graph.setParent(newNodeId, graph._parent[clusterId]);
        }
        edges.outerEdges.input.forEach(function (edge) {
            graph.setEdge(edge.v, newNodeId);
        });
        edges.outerEdges.output.forEach(function (edge) {
            graph.setEdge(newNodeId, edge.w);
        });

        childrenNodes.forEach(function (child) {
            child.el.style('display', 'none');
            //graph.removeNode(child.id);
        });
        //graph.removeNode(clusterId);
        render(svg, graph);
    };

    var getChild = function (clusterId) {
        let childIds = [];
        let clusterChildren = graph._children[clusterId];
        for(let childId in clusterChildren) {
            let $child = d3.selectAll('.node,.cluster').filter(function (el) {
                return el === childId;
            });
            childIds.push({
                el: $child,
                id: childId
            });
            childIds = childIds.concat(getChild(childId));
        }
        return childIds;
    };

    var getEdges = function (clusterNodes) {
        let innerEdges = [];
        let outerEdges = {
            input: [],
            output: []
        };

        clusterNodes.forEach(function (node) {
            let outEdges = graph._out[node.id];
            _.forEach(outEdges, function (edge) {
                let nodes = _.where(clusterNodes, {id: edge.w});
                if(nodes.length > 0) {
                    innerEdges.push(edge);
                }
                else {
                    outerEdges.output.push(edge);
                }
            });

            let inEdges = graph._in[node.id];
            _.forEach(inEdges, function (edge) {
                let nodes = _.where(clusterNodes, {id: edge.v});
                if(nodes.length === 0) {
                    outerEdges.input.push(edge);
                }
            });
        });
        return {
            innerEdges: innerEdges,
            outerEdges: outerEdges
        };
    };

    var expandCluster = function ($cluster, clusterId) {
        console.log('expand', clusterId);
        $cluster.classed('expanded', true);

    };

    module.exports = {
        init: init
    };

})();