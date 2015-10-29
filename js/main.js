(function () {
    'use strict';

    var GraphModel = require('./graph.model');
    var Icons = require('./icons');

    var svg;
    var graph;
    var renderer;

    var init = function (_svg, _graph) {
        svg = _svg;
        graph = _graph;
        renderer = new dagreD3.render();

        GraphModel.create(graph);
    };

    var render = function () {
        renderer(svg, graph);
        setClusterLabels();
        addLinks();
    };

    var setClusterLabels = function () {
        let nodes = GraphModel.getNodes();
        let icons = Icons.icons;
        svg.selectAll('.cluster').each(function(clusterId) {
            let $cluster = d3.select(this);
            let $rect = $cluster.select('rect');
            let $label = $cluster.select('.label g');
            let $togglePlusLink = $label.insert('path', ':first-child');
            $togglePlusLink.attr('d', function(d) {
                return (nodes[clusterId].cluster.isExpanded) ? icons['minus'] : icons['plus'];
            });

            var width = $rect.attr('width');
            var height = $rect.attr('height');

            $label.attr('transform',
                'translate(' + (-width / 2) + ',' + (-height / 2) + ')');

        });
    };

    var addLinks = function () {
        let clusters = GraphModel.getClusters();
        clusters.forEach((cluster) => {
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

        let text = 'Expand';
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
                collapseCluster(clusterId);
            }
            else {
                expandCluster(clusterId);
            }
        });
    };

    var findClusterElem = function (clusterId) {
        let elems = svg.selectAll('.cluster,.node');
        return elems.filter(id => id === clusterId);
    };

    var collapseCluster = function (clusterId) {
        GraphModel.collapseCluster(clusterId);
        let nodes = GraphModel.getNodes();
        let node = nodes[clusterId];
        if(node.isCluster) {
            let contents = node.cluster.contents;
            let edges = node.cluster.edges;
            for(let _id of Object.keys(contents)) {
                graph.removeNode(_id);
            }

            edges.outer.input.forEach((edge) => {
                let link = edge.v;
                if(edge.linkToCluster && !nodes[edge.linkToCluster].cluster.isExpanded) {
                    link = edge.linkToCluster;
                }
                graph.setEdge(link, clusterId);
            });
            edges.outer.output.forEach((edge) => {
                let link = edge.w;
                if(edge.linkToCluster && !nodes[edge.linkToCluster].cluster.isExpanded) {
                    link = edge.linkToCluster;
                }
                graph.setEdge(clusterId, link);
            });
        }
        render();
    };

    var expandCluster = function (clusterId) {
        GraphModel.expandCluster(clusterId);
        let nodes = GraphModel.getNodes();
        let node = nodes[clusterId];
        if(node.isCluster) {
            graph.removeNode(clusterId);
            graph.setNode(clusterId, node.properties);
            let contents = node.cluster.contents;
            let edges = node.cluster.edges;
            let contentsNodes = [];
            let contentsClusters = [];
            Object.keys(contents).forEach((_id) => {
                if(nodes[_id].isCluster) {
                    contentsClusters.push(_id);
                }
                else {
                    contentsNodes.push(_id);
                }
            });

            for(let _id of contentsNodes) {
                graph.setNode(_id, nodes[_id].properties);
                graph.setParent(_id, clusterId);
            }
            for(let _id of contentsClusters) {
                graph.setNode(_id, nodes[_id].properties);
                graph.setParent(_id, clusterId);
                for (let contentId in nodes[_id].cluster.contents) {
                    graph.setParent(contentId, _id);
                }
            }
            for(let parentId of Object.keys(node.parents)) {
                graph.setParent(clusterId, parentId);
            }

            edges.inner.forEach((edge) => {
                graph.setEdge(edge.v, edge.w);
            });
            edges.outer.input.forEach((edge) => {
                let link = edge.v;
                if(edge.linkToCluster && !nodes[edge.linkToCluster].cluster.isExpanded) {
                    link = edge.linkToCluster;
                }
                graph.setEdge(link, edge.w);
            });
            edges.outer.output.forEach((edge) => {
                let link = edge.w;
                if(edge.linkToCluster && !nodes[edge.linkToCluster].cluster.isExpanded) {
                    link = edge.linkToCluster;
                }
                graph.setEdge(edge.v, link);
            });

        }
        render();

    };

    module.exports = {
        init: init,
        render: render
    };

})();