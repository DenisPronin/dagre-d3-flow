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
        addLinks();
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

        let icons = Icons.icons;
        let $rect = $elem.select('rect');
        let $label = $elem.select('.label g');

        let $togglePlusLink = $label.insert('path', ':first-child');
        $togglePlusLink
            .attr('d', function(d) {
                return (clusterObj.cluster.isExpanded) ? icons['minus'] : icons['plus'];
            })
            .attr('transform', 'translate(0, -4) scale(0.8)')
            .attr('class', function(d) {
                return (clusterObj.cluster.isExpanded) ? 'toggle-link expanded' : 'toggle-link collapsed';
            });

        let width = $rect.attr('width');
        let height = $rect.attr('height');
        if(clusterObj.cluster.isExpanded) {
            $label.attr('transform', 'translate(' + (-width / 2) + ',' + (-height / 2) + ')');
        }
        else {
            $label.attr('transform', 'translate(' + (-width / 2) + ',' + (-height / 4) + ')');
            $rect.attr('width', parseFloat(width) + 10);
        }
        $label.select('text').attr('transform', 'translate(25, 0)');

        $togglePlusLink.on('click', function (clusterId) {
            if(clusterObj.cluster.isExpanded) {
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
                GraphModel.expandCluster(_id);
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