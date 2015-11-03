(function () {
    "use strict";

    var currentScale = 1;

    var setZoom = function (svg, svgGroup, graph) {
        let zoom = d3.behavior.zoom().on("zoom", function() {
            currentScale = d3.event.scale;
            svgGroup.attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + currentScale + ")");
        });
        svg.call(zoom);

        centerGraph(svg, graph, zoom);
    };

    var centerGraph = function (svg, graph, zoom) {
        zoom
            .translate([(parseInt(svg.attr("width")) - graph.graph().width * currentScale) / 2, 20])
            .scale(currentScale)
            .event(svg);
        svg.attr('height', graph.graph().height * currentScale + 40);
    };


    module.exports = {
        setZoom: setZoom
    };
})();