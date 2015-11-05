(function () {
    'use strict';

    var GraphModel = require('./graph.model');
    var Icons = require('./icons');
    var Zoom = require('./zoom');

    var svg;
    var svgGroup;
    var graph;
    var renderer;

    var init = function (_svg, _graph) {
        svg = _svg;
        svgGroup = _svg.select('g');
        graph = _graph;
        renderer = new dagreD3.render();

        GraphModel.create(graph);
    };

    var render = function () {
        setEdgesInterpolation();
        var durationVal = 400;
        graph.graph().transition = function(selection) {
            return selection.transition().duration(durationVal);
        };
        renderer(svgGroup, graph);

        setTimeout(function () {
            addLinks();
        }, durationVal + 100);

        renderStatus();
        Zoom.setZoom(svg, svgGroup, graph);
    };

    var renderStatus = function () {
        let nodes = GraphModel.getNodes();
        for(let nodeId of Object.keys(nodes)) {
            let node = nodes[nodeId];
            if(node.properties.status) {
                setNodeStatus(nodeId, node.properties.status);
            }
        }
    };

    var setNodeStatus = function (nodeId, status) {
        GraphModel.setNodeStatus(nodeId, status);
        let $nodeElem = findNodeElem(nodeId);
        $nodeElem.classed(status, true);
    };

    var setEdgesInterpolation = function () {
        for(let key of Object.keys(graph._edgeLabels)) {
            let edgeLabel = graph._edgeLabels[key];
            edgeLabel.lineInterpolate = 'bundle';
        }
    };

    var addLinks = function () {
        let clusters = GraphModel.getClusters();
        clusters.forEach((cluster) => {
            addToggleLink(cluster);
        });
    };

    var addToggleLink = function (clusterObj) {
        let $elem = findNodeElem(clusterObj.id);
        if($elem[0].length === 0) {
            return false;
        }

        let icons = Icons.icons;
        let $rect = $elem.select('rect');
        let $label = $elem.select('.label g');

        if(!$rect[0][0] || !$elem[0][0]) {
            return false;
        }

        let width = $rect.attr('width');
        let height = $rect.attr('height');

        if(!width || !height) {
            return false;
        }

        if(clusterObj.cluster.isExpanded) {
            $label.attr('transform', 'translate(' + (-width / 2) + ',' + (-height / 2) + ')').classed('toggle-link expanded', true);
        }
        else {
            $label.attr('transform', 'translate(' + (-width / 2) + ',' + (-height / 4) + ')').classed('toggle-link collapsed', true);
            $rect.attr('width', parseFloat(width) + 10);
        }

        if(clusterObj.cluster.isExpanded) {
            $label.selectAll('*').remove();
            $label
                .append('text')
                .append('tspan').attr("xml:space", "preserve").attr("dy", "1em").attr("x", "1").text(clusterObj.properties.flowLabel);
        }

        $label.select('text').transition().attr('transform', 'translate(25, 0)').duration(300);

        let $togglePlusLink = $label.insert('path', ':first-child');
        $togglePlusLink
            .attr('d', function(d) {
                return (clusterObj.cluster.isExpanded) ? icons.minus : icons.plus;
            })
            .attr('transform', 'translate(0, -4) scale(0.8)');

        $label.on('click', function (clusterId) {
            if(clusterObj.cluster.isExpanded) {
                collapseCluster(clusterId);
            }
            else {
                expandCluster(clusterId);
            }
        });
    };

    var findNodeElem = function (nodeId) {
        let elems = svg.selectAll('.cluster,.node');
        return elems.filter(id => id === nodeId);
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
            // set label for node for right calc size of nodes in dagre-d3
            graph._nodes[clusterId].label = graph._nodes[clusterId].flowLabel;
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

            graph._nodes[clusterId].label = '';
        }
        render();

    };

    module.exports = {
        init: init,
        render: render,
        setNodeStatus: setNodeStatus
    };

})();