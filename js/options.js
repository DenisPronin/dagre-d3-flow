(function () {
    "use strict";

    var options = {
        shortLabels: false,
        shortLabelLength: 4
    };

    var init = function (_options) {
        options = _.extend(options, _options);
    };

    var get = function (name) {
        return options[name];
    };

    module.exports = {
        init: init,
        get: get
    };
})();