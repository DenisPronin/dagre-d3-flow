(function () {
    "use strict";

    var GraphModel = require('./graph.model');

    var svg;
    var graph;
    var renderer;

    var init = function (_svg, _graph, _renderer) {
        svg = _svg;
        graph = _graph;
        renderer = _renderer;

        GraphModel.create(graph);
    };

    var render = function () {
        renderer(svg, graph);
        addLinks();
    };

    var addLinks = function () {
        let clusters = GraphModel.getClusters();
        clusters.forEach(function (cluster) {
            addToggleLink(cluster);
        });
    };

    var addToggleLink = function (clusterObj) {
        let $elem = findClusterElem(clusterObj.id);
        if($elem[0].length === 0) {
            return false;
        }

        let $rect = $elem.select('rect');
        let x = $rect.attr('x');
        let y = $rect.attr('y');

        var text = 'Expand';
        if(clusterObj.cluster.isExpanded) {
            $elem.classed('expanded', true);
            text = 'Collapse';
        }
        let $toggleGroup = $elem.append('g');
        $toggleGroup.classed('toggle-link', true);
        let $textLabel = $toggleGroup.append('text');
        $textLabel
            .text(text)
            .attr('x', x)
            .attr('y', y);

        $textLabel.on('click', function (clusterId) {
            if($elem.classed('expanded')) {
                collapseCluster($elem, clusterId);
            }
            else {
                expandCluster($elem, clusterId);
            }
        });
    };

    var findClusterElem = function (clusterId) {
        var elems = svg.selectAll('.cluster,.node');
        return elems.filter(function (id) {
           return id === clusterId
        });
    };

    var collapseCluster = function ($cluster, clusterId) {
        $cluster.classed('expanded', false);
        GraphModel.collapseCluster(clusterId);
        var nodes = GraphModel.getNodes();
        var node = nodes[clusterId];
        if(node.isCluster) {
            var contents = node.cluster.contents;
            var edges = node.cluster.edges;
            for(let _id of Object.keys(contents)) {
                graph.removeNode(_id);
            }

            edges.outer.input.forEach(function (edge) {
                graph.setEdge(edge.v, clusterId);
            });
            edges.outer.output.forEach(function (edge) {
                graph.setEdge(clusterId, edge.w);
            });
        }
        render();
    };

    var expandCluster = function ($cluster, clusterId) {
        console.log('expand', clusterId);
        $cluster.classed('expanded', true);

    };

    module.exports = {
        init: init,
        render: render
    };

})();