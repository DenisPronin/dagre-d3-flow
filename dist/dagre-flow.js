var DagreFlow =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	(function () {
	    'use strict';
	
	    var GraphModel = __webpack_require__(1);
	    var Icons = __webpack_require__(2);
	    var Zoom = __webpack_require__(3);
	
	    var svg;
	    var svgGroup;
	    var graph;
	    var renderer;
	
	    var init = function init(_svg, _graph) {
	        svg = _svg;
	        svgGroup = _svg.select('g');
	        graph = _graph;
	        renderer = new dagreD3.render();
	
	        GraphModel.create(graph);
	    };
	
	    var render = function render() {
	        var durationVal = 400;
	        graph.graph().transition = function (selection) {
	            return selection.transition().duration(durationVal);
	        };
	        renderer(svgGroup, graph);
	
	        setTimeout(function () {
	            addLinks();
	        }, durationVal + 100);
	
	        renderStatus();
	        Zoom.setZoom(svg, svgGroup, graph);
	    };
	
	    var renderStatus = function renderStatus() {
	        var nodes = GraphModel.getNodes();
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;
	
	        try {
	            for (var _iterator = Object.keys(nodes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var nodeId = _step.value;
	
	                var node = nodes[nodeId];
	                if (node.properties.status) {
	                    setNodeStatus(nodeId, node.properties.status);
	                }
	            }
	        } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion && _iterator['return']) {
	                    _iterator['return']();
	                }
	            } finally {
	                if (_didIteratorError) {
	                    throw _iteratorError;
	                }
	            }
	        }
	    };
	
	    var setNodeStatus = function setNodeStatus(nodeId, status) {
	        GraphModel.setNodeStatus(nodeId, status);
	        var $nodeElem = findNodeElem(nodeId);
	        $nodeElem.classed(status, true);
	    };
	
	    var addLinks = function addLinks() {
	        var clusters = GraphModel.getClusters();
	        clusters.forEach(function (cluster) {
	            addToggleLink(cluster);
	        });
	    };
	
	    var addToggleLink = function addToggleLink(clusterObj) {
	        var $elem = findNodeElem(clusterObj.id);
	        if ($elem[0].length === 0) {
	            return false;
	        }
	
	        var icons = Icons.icons;
	        var $rect = $elem.select('rect');
	        var $label = $elem.select('.label g');
	
	        if (!$rect[0][0] || !$elem[0][0]) {
	            return false;
	        }
	
	        var width = $rect.attr('width');
	        var height = $rect.attr('height');
	
	        if (!width || !height) {
	            return false;
	        }
	
	        if (clusterObj.cluster.isExpanded) {
	            $label.attr('transform', 'translate(' + -width / 2 + ',' + -height / 2 + ')');
	        } else {
	            $label.attr('transform', 'translate(' + -width / 2 + ',' + -height / 4 + ')');
	            $rect.attr('width', parseFloat(width) + 10);
	        }
	
	        if (clusterObj.cluster.isExpanded) {
	            $label.selectAll('*').remove();
	            $label.append('text').append('tspan').attr("xml:space", "preserve").attr("dy", "1em").attr("x", "1").text(clusterObj.properties.flowLabel);
	        }
	
	        $label.select('text').transition().attr('transform', 'translate(25, 0)').duration(300);
	
	        var $togglePlusLink = $label.insert('path', ':first-child');
	        $togglePlusLink.attr('d', function (d) {
	            return clusterObj.cluster.isExpanded ? icons.minus : icons.plus;
	        }).attr('transform', 'translate(0, -4) scale(0.8)').attr('class', function (d) {
	            return clusterObj.cluster.isExpanded ? 'toggle-link expanded' : 'toggle-link collapsed';
	        });
	
	        $togglePlusLink.on('click', function (clusterId) {
	            if (clusterObj.cluster.isExpanded) {
	                collapseCluster(clusterId);
	            } else {
	                expandCluster(clusterId);
	            }
	        });
	    };
	
	    var findNodeElem = function findNodeElem(nodeId) {
	        var elems = svg.selectAll('.cluster,.node');
	        return elems.filter(function (id) {
	            return id === nodeId;
	        });
	    };
	
	    var collapseCluster = function collapseCluster(clusterId) {
	        GraphModel.collapseCluster(clusterId);
	        var nodes = GraphModel.getNodes();
	        var node = nodes[clusterId];
	        if (node.isCluster) {
	            var contents = node.cluster.contents;
	            var edges = node.cluster.edges;
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;
	
	            try {
	                for (var _iterator2 = Object.keys(contents)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var _id = _step2.value;
	
	                    graph.removeNode(_id);
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	                        _iterator2['return']();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }
	
	            edges.outer.input.forEach(function (edge) {
	                var link = edge.v;
	                if (edge.linkToCluster && !nodes[edge.linkToCluster].cluster.isExpanded) {
	                    link = edge.linkToCluster;
	                }
	                graph.setEdge(link, clusterId);
	            });
	            edges.outer.output.forEach(function (edge) {
	                var link = edge.w;
	                if (edge.linkToCluster && !nodes[edge.linkToCluster].cluster.isExpanded) {
	                    link = edge.linkToCluster;
	                }
	                graph.setEdge(clusterId, link);
	            });
	            // set label for node for right calc size of nodes in dagre-d3
	            graph._nodes[clusterId].label = graph._nodes[clusterId].flowLabel;
	        }
	        render();
	    };
	
	    var expandCluster = function expandCluster(clusterId) {
	        GraphModel.expandCluster(clusterId);
	        var nodes = GraphModel.getNodes();
	        var node = nodes[clusterId];
	        if (node.isCluster) {
	            var _iteratorNormalCompletion3;
	
	            var _didIteratorError3;
	
	            var _iteratorError3;
	
	            var _iterator3, _step3;
	
	            var _iteratorNormalCompletion4;
	
	            var _didIteratorError4;
	
	            var _iteratorError4;
	
	            var _iterator4, _step4;
	
	            var _iteratorNormalCompletion5;
	
	            var _didIteratorError5;
	
	            var _iteratorError5;
	
	            var _iterator5, _step5;
	
	            (function () {
	                graph.removeNode(clusterId);
	                graph.setNode(clusterId, node.properties);
	                var contents = node.cluster.contents;
	                var edges = node.cluster.edges;
	                var contentsNodes = [];
	                var contentsClusters = [];
	                Object.keys(contents).forEach(function (_id) {
	                    if (nodes[_id].isCluster) {
	                        contentsClusters.push(_id);
	                    } else {
	                        contentsNodes.push(_id);
	                    }
	                });
	
	                _iteratorNormalCompletion3 = true;
	                _didIteratorError3 = false;
	                _iteratorError3 = undefined;
	
	                try {
	                    for (_iterator3 = contentsNodes[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                        var _id = _step3.value;
	
	                        graph.setNode(_id, nodes[_id].properties);
	                        graph.setParent(_id, clusterId);
	                    }
	                } catch (err) {
	                    _didIteratorError3 = true;
	                    _iteratorError3 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
	                            _iterator3['return']();
	                        }
	                    } finally {
	                        if (_didIteratorError3) {
	                            throw _iteratorError3;
	                        }
	                    }
	                }
	
	                _iteratorNormalCompletion4 = true;
	                _didIteratorError4 = false;
	                _iteratorError4 = undefined;
	
	                try {
	                    for (_iterator4 = contentsClusters[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                        var _id = _step4.value;
	
	                        graph.setNode(_id, nodes[_id].properties);
	                        graph.setParent(_id, clusterId);
	                        GraphModel.expandCluster(_id);
	                        for (var contentId in nodes[_id].cluster.contents) {
	                            graph.setParent(contentId, _id);
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError4 = true;
	                    _iteratorError4 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion4 && _iterator4['return']) {
	                            _iterator4['return']();
	                        }
	                    } finally {
	                        if (_didIteratorError4) {
	                            throw _iteratorError4;
	                        }
	                    }
	                }
	
	                _iteratorNormalCompletion5 = true;
	                _didIteratorError5 = false;
	                _iteratorError5 = undefined;
	
	                try {
	                    for (_iterator5 = Object.keys(node.parents)[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                        var parentId = _step5.value;
	
	                        graph.setParent(clusterId, parentId);
	                    }
	                } catch (err) {
	                    _didIteratorError5 = true;
	                    _iteratorError5 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion5 && _iterator5['return']) {
	                            _iterator5['return']();
	                        }
	                    } finally {
	                        if (_didIteratorError5) {
	                            throw _iteratorError5;
	                        }
	                    }
	                }
	
	                edges.inner.forEach(function (edge) {
	                    graph.setEdge(edge.v, edge.w);
	                });
	                edges.outer.input.forEach(function (edge) {
	                    var link = edge.v;
	                    if (edge.linkToCluster && !nodes[edge.linkToCluster].cluster.isExpanded) {
	                        link = edge.linkToCluster;
	                    }
	                    graph.setEdge(link, edge.w);
	                });
	                edges.outer.output.forEach(function (edge) {
	                    var link = edge.w;
	                    if (edge.linkToCluster && !nodes[edge.linkToCluster].cluster.isExpanded) {
	                        link = edge.linkToCluster;
	                    }
	                    graph.setEdge(edge.v, link);
	                });
	
	                graph._nodes[clusterId].label = '';
	            })();
	        }
	        render();
	    };
	
	    module.exports = {
	        init: init,
	        render: render,
	        setNodeStatus: setNodeStatus
	    };
	})();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	(function () {
	    "use strict";
	
	    var flow = {};
	
	    var getFlow = function getFlow() {
	        return flow;
	    };
	
	    var getNodes = function getNodes() {
	        return flow.nodes;
	    };
	
	    var getClusters = function getClusters() {
	        var clusters = [];
	        Object.keys(flow.nodes).forEach(function (nodeId) {
	            if (flow.nodes[nodeId].isCluster) {
	                clusters.push(flow.nodes[nodeId]);
	            }
	        });
	        return clusters;
	    };
	
	    var create = function create(graph) {
	        flow.nodes = {};
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;
	
	        try {
	            for (var _iterator = Object.keys(graph._nodes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var _nodeId = _step.value;
	
	                flow.nodes[_nodeId] = {};
	                var flowNode = flow.nodes[_nodeId];
	                flowNode.id = _nodeId;
	                flowNode.properties = setProperties(graph, _nodeId);
	
	                flowNode.children = getChildren(graph, _nodeId);
	                flowNode.parents = getParent(graph, _nodeId);
	
	                flowNode.isCluster = isCluster(graph, _nodeId);
	                if (flowNode.isCluster) {
	                    flowNode.cluster = setCluster(graph, _nodeId);
	                }
	            }
	        } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion && _iterator["return"]) {
	                    _iterator["return"]();
	                }
	            } finally {
	                if (_didIteratorError) {
	                    throw _iteratorError;
	                }
	            }
	        }
	
	        setClustersLinks();
	        setClustersParents(graph);
	        graph._flow = flow;
	    };
	
	    var setProperties = function setProperties(graph, _nodeId) {
	        var node = graph._nodes[_nodeId];
	        if (isCluster(graph, _nodeId)) {
	            var label = node.label;
	            node.label = '';
	            node.flowLabel = label;
	        }
	        return node;
	    };
	
	    var getChildren = function getChildren(graph, _nodeId) {
	        var _out = graph._out[_nodeId];
	        var children = {};
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;
	
	        try {
	            for (var _iterator2 = Object.keys(_out)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var child = _step2.value;
	
	                children[_out[child].w] = true;
	            }
	        } catch (err) {
	            _didIteratorError2 = true;
	            _iteratorError2 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
	                    _iterator2["return"]();
	                }
	            } finally {
	                if (_didIteratorError2) {
	                    throw _iteratorError2;
	                }
	            }
	        }
	
	        return children;
	    };
	
	    var getParent = function getParent(graph, _nodeId) {
	        var parents = {};
	        var _in = graph._in[_nodeId];
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;
	
	        try {
	            for (var _iterator3 = Object.keys(_in)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var _parent = _step3.value;
	
	                parents[_in[_parent].v] = true;
	            }
	        } catch (err) {
	            _didIteratorError3 = true;
	            _iteratorError3 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
	                    _iterator3["return"]();
	                }
	            } finally {
	                if (_didIteratorError3) {
	                    throw _iteratorError3;
	                }
	            }
	        }
	
	        return parents;
	    };
	
	    var setCluster = function setCluster(graph, _nodeId) {
	        var cluster = {
	            isExpanded: true,
	            contents: {}
	        };
	        var graphCluster = graph._children[_nodeId];
	        cluster.contents = setClusterContent(graph, graphCluster);
	        cluster.edges = setClusterEdges(graph, Object.keys(cluster.contents));
	        return cluster;
	    };
	
	    var setClusterContent = function setClusterContent(graph, cluster) {
	        var contents = {};
	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;
	
	        try {
	            for (var _iterator4 = Object.keys(cluster)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                var child = _step4.value;
	
	                contents[child] = true;
	                if (isCluster(graph, child)) {
	                    var innerContent = setClusterContent(graph, graph._children[child]);
	                    Object.assign(contents, innerContent);
	                }
	            }
	        } catch (err) {
	            _didIteratorError4 = true;
	            _iteratorError4 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
	                    _iterator4["return"]();
	                }
	            } finally {
	                if (_didIteratorError4) {
	                    throw _iteratorError4;
	                }
	            }
	        }
	
	        return contents;
	    };
	
	    var setClusterEdges = function setClusterEdges(graph, clusterNodes) {
	        var edges = {
	            inner: [],
	            outer: {
	                input: [],
	                output: []
	            }
	        };
	
	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;
	
	        try {
	            for (var _iterator5 = clusterNodes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var nodeId = _step5.value;
	
	                var outEdges = graph._out[nodeId];
	                var _iteratorNormalCompletion6 = true;
	                var _didIteratorError6 = false;
	                var _iteratorError6 = undefined;
	
	                try {
	                    var _loop = function () {
	                        var edgeKey = _step6.value;
	
	                        var _edge = outEdges[edgeKey];
	                        var nodes = clusterNodes.filter(function (_node) {
	                            return _node === _edge.w;
	                        });
	                        if (nodes.length > 0) {
	                            edges.inner.push({ v: _edge.v, w: _edge.w });
	                        } else {
	                            edges.outer.output.push({ v: _edge.v, w: _edge.w });
	                        }
	                    };
	
	                    for (var _iterator6 = Object.keys(outEdges)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                        _loop();
	                    }
	                } catch (err) {
	                    _didIteratorError6 = true;
	                    _iteratorError6 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
	                            _iterator6["return"]();
	                        }
	                    } finally {
	                        if (_didIteratorError6) {
	                            throw _iteratorError6;
	                        }
	                    }
	                }
	
	                var inEdges = graph._in[nodeId];
	                var _iteratorNormalCompletion7 = true;
	                var _didIteratorError7 = false;
	                var _iteratorError7 = undefined;
	
	                try {
	                    var _loop2 = function () {
	                        var edgeKey = _step7.value;
	
	                        var _edge = inEdges[edgeKey];
	                        var nodes = clusterNodes.filter(function (_node) {
	                            return _node === _edge.v;
	                        });
	                        if (nodes.length === 0) {
	                            edges.outer.input.push({ v: _edge.v, w: _edge.w });
	                        }
	                    };
	
	                    for (var _iterator7 = Object.keys(inEdges)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                        _loop2();
	                    }
	                } catch (err) {
	                    _didIteratorError7 = true;
	                    _iteratorError7 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
	                            _iterator7["return"]();
	                        }
	                    } finally {
	                        if (_didIteratorError7) {
	                            throw _iteratorError7;
	                        }
	                    }
	                }
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
	                    _iterator5["return"]();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }
	
	        return edges;
	    };
	
	    var setClustersLinks = function setClustersLinks() {
	        var clusters = getClusters();
	        var _iteratorNormalCompletion8 = true;
	        var _didIteratorError8 = false;
	        var _iteratorError8 = undefined;
	
	        try {
	            for (var _iterator8 = clusters[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	                var clusterNode = _step8.value;
	
	                var outputEdges = clusterNode.cluster.edges.outer.output;
	                var _iteratorNormalCompletion9 = true;
	                var _didIteratorError9 = false;
	                var _iteratorError9 = undefined;
	
	                try {
	                    for (var _iterator9 = outputEdges[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	                        var edge = _step9.value;
	
	                        var linkCluster = findClusterByInnerEdge(edge, clusterNode.id);
	                        if (linkCluster) {
	                            edge.linkToCluster = linkCluster.id;
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError9 = true;
	                    _iteratorError9 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion9 && _iterator9["return"]) {
	                            _iterator9["return"]();
	                        }
	                    } finally {
	                        if (_didIteratorError9) {
	                            throw _iteratorError9;
	                        }
	                    }
	                }
	            }
	        } catch (err) {
	            _didIteratorError8 = true;
	            _iteratorError8 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
	                    _iterator8["return"]();
	                }
	            } finally {
	                if (_didIteratorError8) {
	                    throw _iteratorError8;
	                }
	            }
	        }
	    };
	
	    var setClustersParents = function setClustersParents(graph) {
	        var clusters = getClusters();
	        var _iteratorNormalCompletion10 = true;
	        var _didIteratorError10 = false;
	        var _iteratorError10 = undefined;
	
	        try {
	            for (var _iterator10 = clusters[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
	                var clusterNode = _step10.value;
	
	                var id = clusterNode.id;
	
	                var _iteratorNormalCompletion11 = true;
	                var _didIteratorError11 = false;
	                var _iteratorError11 = undefined;
	
	                try {
	                    for (var _iterator11 = clusters[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
	                        var _node = _step11.value;
	
	                        if (graph._children[_node.id][id]) {
	                            clusterNode.parents[_node.id] = true;
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError11 = true;
	                    _iteratorError11 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion11 && _iterator11["return"]) {
	                            _iterator11["return"]();
	                        }
	                    } finally {
	                        if (_didIteratorError11) {
	                            throw _iteratorError11;
	                        }
	                    }
	                }
	            }
	        } catch (err) {
	            _didIteratorError10 = true;
	            _iteratorError10 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion10 && _iterator10["return"]) {
	                    _iterator10["return"]();
	                }
	            } finally {
	                if (_didIteratorError10) {
	                    throw _iteratorError10;
	                }
	            }
	        }
	    };
	
	    var findClusterByInnerEdge = function findClusterByInnerEdge(edge, linkId) {
	        var clusters = getClusters();
	        var resCluster = null;
	        var _iteratorNormalCompletion12 = true;
	        var _didIteratorError12 = false;
	        var _iteratorError12 = undefined;
	
	        try {
	            for (var _iterator12 = clusters[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
	                var clusterNode = _step12.value;
	
	                var edges = clusterNode.cluster.edges.outer.input;
	                var res = edges.filter(function (_edge) {
	                    return JSON.stringify(edge) === JSON.stringify(_edge);
	                });
	                if (res.length > 0) {
	                    res[0].linkToCluster = linkId;
	                    resCluster = clusterNode;
	                    break;
	                }
	            }
	        } catch (err) {
	            _didIteratorError12 = true;
	            _iteratorError12 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion12 && _iterator12["return"]) {
	                    _iterator12["return"]();
	                }
	            } finally {
	                if (_didIteratorError12) {
	                    throw _iteratorError12;
	                }
	            }
	        }
	
	        return resCluster;
	    };
	
	    var isCluster = function isCluster(graph, _nodeId) {
	        return Object.keys(graph._children[_nodeId]).length > 0;
	    };
	
	    var expandCluster = function expandCluster(clusterId) {
	        if (flow.nodes[clusterId] && flow.nodes[clusterId].cluster) {
	            flow.nodes[clusterId].cluster.isExpanded = true;
	        }
	    };
	
	    var collapseCluster = function collapseCluster(clusterId) {
	        if (flow.nodes[clusterId] && flow.nodes[clusterId].cluster) {
	            flow.nodes[clusterId].cluster.isExpanded = false;
	        }
	    };
	
	    var setNodeStatus = function setNodeStatus(nodeId, status) {
	        flow.nodes[nodeId].properties.status = status;
	    };
	
	    module.exports = {
	        create: create,
	        getFlow: getFlow,
	        getNodes: getNodes,
	        getClusters: getClusters,
	        expandCluster: expandCluster,
	        collapseCluster: collapseCluster,
	        setNodeStatus: setNodeStatus
	    };
	})();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	(function () {
	    "use strict";
	
	    var icons = {
	        plus: 'M25.979,12.896 19.312,12.896 19.312,6.229 12.647,6.229 12.647,12.896 5.979,12.896 5.979,19.562 12.647,19.562 12.647,26.229 19.312,26.229 19.312,19.562 25.979,19.562z',
	        minus: 'M25.979,12.896,5.979,12.896,5.979,19.562,25.979,19.562z'
	    };
	
	    module.exports = {
	        icons: icons
	    };
	})();

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	(function () {
	    "use strict";
	
	    var currentScale = 1;
	
	    var setZoom = function setZoom(svg, svgGroup, graph) {
	        var zoom = d3.behavior.zoom().on("zoom", function () {
	            currentScale = d3.event.scale;
	            svgGroup.attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + currentScale + ")");
	        });
	        svg.call(zoom);
	
	        centerGraph(svg, graph, zoom);
	    };
	
	    var centerGraph = function centerGraph(svg, graph, zoom) {
	        zoom.translate([(parseInt(svg.attr("width")) - graph.graph().width * currentScale) / 2, 20]).scale(currentScale).event(svg);
	        svg.attr('height', graph.graph().height * currentScale + 40);
	    };
	
	    module.exports = {
	        setZoom: setZoom
	    };
	})();

/***/ }
/******/ ]);
//# sourceMappingURL=dagre-flow.map