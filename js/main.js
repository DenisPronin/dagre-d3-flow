(function () {
    "use strict";

    var GraphModel = require('./graph.model');

    var svg;
    var graph;
    var render;

    var init = function (_svg, _graph, _render) {
        svg = _svg;
        graph = _graph;
        render = _render;

        GraphModel.create(graph);
        render(_svg, _graph);

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
        render(svg, graph);
    };

    var expandCluster = function ($cluster, clusterId) {
        console.log('expand', clusterId);
        $cluster.classed('expanded', true);

    };

    module.exports = {
        init: init
    };

})();