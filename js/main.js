(function () {
    'use strict';

    var Options = require('./options');
    var Render = require('./render');
    var GraphModel = require('./graph.model');

    var init = function (_options) {
        Options.init(_options);
        Render.init();
    };

    var render = function () {
        Render.render();
    };

    var setNodeStatus = function (nodeId, status) {
        Render.setNodeStatus(nodeId, status);
    };

    var getFlow = function () {
        return GraphModel.getNodes();
    };

    module.exports = {
        init: init,
        render: render,
        setNodeStatus: setNodeStatus,
        getFlow: getFlow
    };

})();