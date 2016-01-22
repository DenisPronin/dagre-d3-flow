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
	
	    __webpack_require__(1);
	    __webpack_require__(2);
	    var Options = __webpack_require__(3);
	    var Render = __webpack_require__(4);
	    var GraphModel = __webpack_require__(5);
	
	    var init = function init(_options) {
	        Options.init(_options);
	        Render.init();
	    };
	
	    var render = function render() {
	        Render.render();
	    };
	
	    var setNodeStatus = function setNodeStatus(nodeId, status) {
	        Render.setNodeStatus(nodeId, status);
	    };
	
	    var setNodeLabel = function setNodeLabel(nodeId, label) {
	        Render.setNodeLabel(nodeId, label);
	    };
	
	    var getFlow = function getFlow() {
	        return GraphModel.getNodes();
	    };
	
	    module.exports = {
	        init: init,
	        render: render,
	        setNodeStatus: setNodeStatus,
	        setNodeLabel: setNodeLabel,
	        getFlow: getFlow
	    };
	})();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	(function () {
	  "use strict";
	
	  window.SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function (elem) {
	    return elem.getScreenCTM().inverse().multiply(this.getScreenCTM());
	  };
	})();

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	// SVGPathSeg API polyfill
	// https://github.com/progers/pathseg
	//
	// This is a drop-in replacement for the SVGPathSeg and SVGPathSegList APIs that were removed from
	// SVG2 (https://lists.w3.org/Archives/Public/www-svg/2015Jun/0044.html), including the latest spec
	// changes which were implemented in Firefox 43 and Chrome 46.
	
	(function () {
	    "use strict";
	
	    if (!("SVGPathSeg" in window)) {
	        // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGPathSeg
	        window.SVGPathSeg = function (type, typeAsLetter, owningPathSegList) {
	            this.pathSegType = type;
	            this.pathSegTypeAsLetter = typeAsLetter;
	            this._owningPathSegList = owningPathSegList;
	        };
	
	        SVGPathSeg.PATHSEG_UNKNOWN = 0;
	        SVGPathSeg.PATHSEG_CLOSEPATH = 1;
	        SVGPathSeg.PATHSEG_MOVETO_ABS = 2;
	        SVGPathSeg.PATHSEG_MOVETO_REL = 3;
	        SVGPathSeg.PATHSEG_LINETO_ABS = 4;
	        SVGPathSeg.PATHSEG_LINETO_REL = 5;
	        SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS = 6;
	        SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL = 7;
	        SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS = 8;
	        SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL = 9;
	        SVGPathSeg.PATHSEG_ARC_ABS = 10;
	        SVGPathSeg.PATHSEG_ARC_REL = 11;
	        SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS = 12;
	        SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL = 13;
	        SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS = 14;
	        SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL = 15;
	        SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS = 16;
	        SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL = 17;
	        SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS = 18;
	        SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL = 19;
	
	        // Notify owning PathSegList on any changes so they can be synchronized back to the path element.
	        SVGPathSeg.prototype._segmentChanged = function () {
	            if (this._owningPathSegList) this._owningPathSegList.segmentChanged(this);
	        };
	
	        window.SVGPathSegClosePath = function (owningPathSegList) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CLOSEPATH, "z", owningPathSegList);
	        };
	        SVGPathSegClosePath.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegClosePath.prototype.toString = function () {
	            return "[object SVGPathSegClosePath]";
	        };
	        SVGPathSegClosePath.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter;
	        };
	        SVGPathSegClosePath.prototype.clone = function () {
	            return new SVGPathSegClosePath(undefined);
	        };
	
	        window.SVGPathSegMovetoAbs = function (owningPathSegList, x, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_MOVETO_ABS, "M", owningPathSegList);
	            this._x = x;
	            this._y = y;
	        };
	        SVGPathSegMovetoAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegMovetoAbs.prototype.toString = function () {
	            return "[object SVGPathSegMovetoAbs]";
	        };
	        SVGPathSegMovetoAbs.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._x + " " + this._y;
	        };
	        SVGPathSegMovetoAbs.prototype.clone = function () {
	            return new SVGPathSegMovetoAbs(undefined, this._x, this._y);
	        };
	        Object.defineProperty(SVGPathSegMovetoAbs.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegMovetoAbs.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegMovetoRel = function (owningPathSegList, x, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_MOVETO_REL, "m", owningPathSegList);
	            this._x = x;
	            this._y = y;
	        };
	        SVGPathSegMovetoRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegMovetoRel.prototype.toString = function () {
	            return "[object SVGPathSegMovetoRel]";
	        };
	        SVGPathSegMovetoRel.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._x + " " + this._y;
	        };
	        SVGPathSegMovetoRel.prototype.clone = function () {
	            return new SVGPathSegMovetoRel(undefined, this._x, this._y);
	        };
	        Object.defineProperty(SVGPathSegMovetoRel.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegMovetoRel.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegLinetoAbs = function (owningPathSegList, x, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_ABS, "L", owningPathSegList);
	            this._x = x;
	            this._y = y;
	        };
	        SVGPathSegLinetoAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegLinetoAbs.prototype.toString = function () {
	            return "[object SVGPathSegLinetoAbs]";
	        };
	        SVGPathSegLinetoAbs.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._x + " " + this._y;
	        };
	        SVGPathSegLinetoAbs.prototype.clone = function () {
	            return new SVGPathSegLinetoAbs(undefined, this._x, this._y);
	        };
	        Object.defineProperty(SVGPathSegLinetoAbs.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegLinetoAbs.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegLinetoRel = function (owningPathSegList, x, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_REL, "l", owningPathSegList);
	            this._x = x;
	            this._y = y;
	        };
	        SVGPathSegLinetoRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegLinetoRel.prototype.toString = function () {
	            return "[object SVGPathSegLinetoRel]";
	        };
	        SVGPathSegLinetoRel.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._x + " " + this._y;
	        };
	        SVGPathSegLinetoRel.prototype.clone = function () {
	            return new SVGPathSegLinetoRel(undefined, this._x, this._y);
	        };
	        Object.defineProperty(SVGPathSegLinetoRel.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegLinetoRel.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegCurvetoCubicAbs = function (owningPathSegList, x, y, x1, y1, x2, y2) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS, "C", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._x1 = x1;
	            this._y1 = y1;
	            this._x2 = x2;
	            this._y2 = y2;
	        };
	        SVGPathSegCurvetoCubicAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoCubicAbs.prototype.toString = function () {
	            return "[object SVGPathSegCurvetoCubicAbs]";
	        };
	        SVGPathSegCurvetoCubicAbs.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._x1 + " " + this._y1 + " " + this._x2 + " " + this._y2 + " " + this._x + " " + this._y;
	        };
	        SVGPathSegCurvetoCubicAbs.prototype.clone = function () {
	            return new SVGPathSegCurvetoCubicAbs(undefined, this._x, this._y, this._x1, this._y1, this._x2, this._y2);
	        };
	        Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "x1", { get: function get() {
	                return this._x1;
	            }, set: function set(x1) {
	                this._x1 = x1;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "y1", { get: function get() {
	                return this._y1;
	            }, set: function set(y1) {
	                this._y1 = y1;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "x2", { get: function get() {
	                return this._x2;
	            }, set: function set(x2) {
	                this._x2 = x2;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicAbs.prototype, "y2", { get: function get() {
	                return this._y2;
	            }, set: function set(y2) {
	                this._y2 = y2;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegCurvetoCubicRel = function (owningPathSegList, x, y, x1, y1, x2, y2) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL, "c", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._x1 = x1;
	            this._y1 = y1;
	            this._x2 = x2;
	            this._y2 = y2;
	        };
	        SVGPathSegCurvetoCubicRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoCubicRel.prototype.toString = function () {
	            return "[object SVGPathSegCurvetoCubicRel]";
	        };
	        SVGPathSegCurvetoCubicRel.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._x1 + " " + this._y1 + " " + this._x2 + " " + this._y2 + " " + this._x + " " + this._y;
	        };
	        SVGPathSegCurvetoCubicRel.prototype.clone = function () {
	            return new SVGPathSegCurvetoCubicRel(undefined, this._x, this._y, this._x1, this._y1, this._x2, this._y2);
	        };
	        Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "x1", { get: function get() {
	                return this._x1;
	            }, set: function set(x1) {
	                this._x1 = x1;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "y1", { get: function get() {
	                return this._y1;
	            }, set: function set(y1) {
	                this._y1 = y1;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "x2", { get: function get() {
	                return this._x2;
	            }, set: function set(x2) {
	                this._x2 = x2;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicRel.prototype, "y2", { get: function get() {
	                return this._y2;
	            }, set: function set(y2) {
	                this._y2 = y2;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegCurvetoQuadraticAbs = function (owningPathSegList, x, y, x1, y1) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS, "Q", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._x1 = x1;
	            this._y1 = y1;
	        };
	        SVGPathSegCurvetoQuadraticAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoQuadraticAbs.prototype.toString = function () {
	            return "[object SVGPathSegCurvetoQuadraticAbs]";
	        };
	        SVGPathSegCurvetoQuadraticAbs.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._x1 + " " + this._y1 + " " + this._x + " " + this._y;
	        };
	        SVGPathSegCurvetoQuadraticAbs.prototype.clone = function () {
	            return new SVGPathSegCurvetoQuadraticAbs(undefined, this._x, this._y, this._x1, this._y1);
	        };
	        Object.defineProperty(SVGPathSegCurvetoQuadraticAbs.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticAbs.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticAbs.prototype, "x1", { get: function get() {
	                return this._x1;
	            }, set: function set(x1) {
	                this._x1 = x1;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticAbs.prototype, "y1", { get: function get() {
	                return this._y1;
	            }, set: function set(y1) {
	                this._y1 = y1;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegCurvetoQuadraticRel = function (owningPathSegList, x, y, x1, y1) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL, "q", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._x1 = x1;
	            this._y1 = y1;
	        };
	        SVGPathSegCurvetoQuadraticRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoQuadraticRel.prototype.toString = function () {
	            return "[object SVGPathSegCurvetoQuadraticRel]";
	        };
	        SVGPathSegCurvetoQuadraticRel.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._x1 + " " + this._y1 + " " + this._x + " " + this._y;
	        };
	        SVGPathSegCurvetoQuadraticRel.prototype.clone = function () {
	            return new SVGPathSegCurvetoQuadraticRel(undefined, this._x, this._y, this._x1, this._y1);
	        };
	        Object.defineProperty(SVGPathSegCurvetoQuadraticRel.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticRel.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticRel.prototype, "x1", { get: function get() {
	                return this._x1;
	            }, set: function set(x1) {
	                this._x1 = x1;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticRel.prototype, "y1", { get: function get() {
	                return this._y1;
	            }, set: function set(y1) {
	                this._y1 = y1;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegArcAbs = function (owningPathSegList, x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_ARC_ABS, "A", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._r1 = r1;
	            this._r2 = r2;
	            this._angle = angle;
	            this._largeArcFlag = largeArcFlag;
	            this._sweepFlag = sweepFlag;
	        };
	        SVGPathSegArcAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegArcAbs.prototype.toString = function () {
	            return "[object SVGPathSegArcAbs]";
	        };
	        SVGPathSegArcAbs.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._r1 + " " + this._r2 + " " + this._angle + " " + (this._largeArcFlag ? "1" : "0") + " " + (this._sweepFlag ? "1" : "0") + " " + this._x + " " + this._y;
	        };
	        SVGPathSegArcAbs.prototype.clone = function () {
	            return new SVGPathSegArcAbs(undefined, this._x, this._y, this._r1, this._r2, this._angle, this._largeArcFlag, this._sweepFlag);
	        };
	        Object.defineProperty(SVGPathSegArcAbs.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcAbs.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcAbs.prototype, "r1", { get: function get() {
	                return this._r1;
	            }, set: function set(r1) {
	                this._r1 = r1;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcAbs.prototype, "r2", { get: function get() {
	                return this._r2;
	            }, set: function set(r2) {
	                this._r2 = r2;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcAbs.prototype, "angle", { get: function get() {
	                return this._angle;
	            }, set: function set(angle) {
	                this._angle = angle;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcAbs.prototype, "largeArcFlag", { get: function get() {
	                return this._largeArcFlag;
	            }, set: function set(largeArcFlag) {
	                this._largeArcFlag = largeArcFlag;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcAbs.prototype, "sweepFlag", { get: function get() {
	                return this._sweepFlag;
	            }, set: function set(sweepFlag) {
	                this._sweepFlag = sweepFlag;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegArcRel = function (owningPathSegList, x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_ARC_REL, "a", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._r1 = r1;
	            this._r2 = r2;
	            this._angle = angle;
	            this._largeArcFlag = largeArcFlag;
	            this._sweepFlag = sweepFlag;
	        };
	        SVGPathSegArcRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegArcRel.prototype.toString = function () {
	            return "[object SVGPathSegArcRel]";
	        };
	        SVGPathSegArcRel.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._r1 + " " + this._r2 + " " + this._angle + " " + (this._largeArcFlag ? "1" : "0") + " " + (this._sweepFlag ? "1" : "0") + " " + this._x + " " + this._y;
	        };
	        SVGPathSegArcRel.prototype.clone = function () {
	            return new SVGPathSegArcRel(undefined, this._x, this._y, this._r1, this._r2, this._angle, this._largeArcFlag, this._sweepFlag);
	        };
	        Object.defineProperty(SVGPathSegArcRel.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcRel.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcRel.prototype, "r1", { get: function get() {
	                return this._r1;
	            }, set: function set(r1) {
	                this._r1 = r1;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcRel.prototype, "r2", { get: function get() {
	                return this._r2;
	            }, set: function set(r2) {
	                this._r2 = r2;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcRel.prototype, "angle", { get: function get() {
	                return this._angle;
	            }, set: function set(angle) {
	                this._angle = angle;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcRel.prototype, "largeArcFlag", { get: function get() {
	                return this._largeArcFlag;
	            }, set: function set(largeArcFlag) {
	                this._largeArcFlag = largeArcFlag;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegArcRel.prototype, "sweepFlag", { get: function get() {
	                return this._sweepFlag;
	            }, set: function set(sweepFlag) {
	                this._sweepFlag = sweepFlag;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegLinetoHorizontalAbs = function (owningPathSegList, x) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS, "H", owningPathSegList);
	            this._x = x;
	        };
	        SVGPathSegLinetoHorizontalAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegLinetoHorizontalAbs.prototype.toString = function () {
	            return "[object SVGPathSegLinetoHorizontalAbs]";
	        };
	        SVGPathSegLinetoHorizontalAbs.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._x;
	        };
	        SVGPathSegLinetoHorizontalAbs.prototype.clone = function () {
	            return new SVGPathSegLinetoHorizontalAbs(undefined, this._x);
	        };
	        Object.defineProperty(SVGPathSegLinetoHorizontalAbs.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegLinetoHorizontalRel = function (owningPathSegList, x) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL, "h", owningPathSegList);
	            this._x = x;
	        };
	        SVGPathSegLinetoHorizontalRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegLinetoHorizontalRel.prototype.toString = function () {
	            return "[object SVGPathSegLinetoHorizontalRel]";
	        };
	        SVGPathSegLinetoHorizontalRel.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._x;
	        };
	        SVGPathSegLinetoHorizontalRel.prototype.clone = function () {
	            return new SVGPathSegLinetoHorizontalRel(undefined, this._x);
	        };
	        Object.defineProperty(SVGPathSegLinetoHorizontalRel.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegLinetoVerticalAbs = function (owningPathSegList, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS, "V", owningPathSegList);
	            this._y = y;
	        };
	        SVGPathSegLinetoVerticalAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegLinetoVerticalAbs.prototype.toString = function () {
	            return "[object SVGPathSegLinetoVerticalAbs]";
	        };
	        SVGPathSegLinetoVerticalAbs.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._y;
	        };
	        SVGPathSegLinetoVerticalAbs.prototype.clone = function () {
	            return new SVGPathSegLinetoVerticalAbs(undefined, this._y);
	        };
	        Object.defineProperty(SVGPathSegLinetoVerticalAbs.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegLinetoVerticalRel = function (owningPathSegList, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL, "v", owningPathSegList);
	            this._y = y;
	        };
	        SVGPathSegLinetoVerticalRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegLinetoVerticalRel.prototype.toString = function () {
	            return "[object SVGPathSegLinetoVerticalRel]";
	        };
	        SVGPathSegLinetoVerticalRel.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._y;
	        };
	        SVGPathSegLinetoVerticalRel.prototype.clone = function () {
	            return new SVGPathSegLinetoVerticalRel(undefined, this._y);
	        };
	        Object.defineProperty(SVGPathSegLinetoVerticalRel.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegCurvetoCubicSmoothAbs = function (owningPathSegList, x, y, x2, y2) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS, "S", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._x2 = x2;
	            this._y2 = y2;
	        };
	        SVGPathSegCurvetoCubicSmoothAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoCubicSmoothAbs.prototype.toString = function () {
	            return "[object SVGPathSegCurvetoCubicSmoothAbs]";
	        };
	        SVGPathSegCurvetoCubicSmoothAbs.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._x2 + " " + this._y2 + " " + this._x + " " + this._y;
	        };
	        SVGPathSegCurvetoCubicSmoothAbs.prototype.clone = function () {
	            return new SVGPathSegCurvetoCubicSmoothAbs(undefined, this._x, this._y, this._x2, this._y2);
	        };
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothAbs.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothAbs.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothAbs.prototype, "x2", { get: function get() {
	                return this._x2;
	            }, set: function set(x2) {
	                this._x2 = x2;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothAbs.prototype, "y2", { get: function get() {
	                return this._y2;
	            }, set: function set(y2) {
	                this._y2 = y2;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegCurvetoCubicSmoothRel = function (owningPathSegList, x, y, x2, y2) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL, "s", owningPathSegList);
	            this._x = x;
	            this._y = y;
	            this._x2 = x2;
	            this._y2 = y2;
	        };
	        SVGPathSegCurvetoCubicSmoothRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoCubicSmoothRel.prototype.toString = function () {
	            return "[object SVGPathSegCurvetoCubicSmoothRel]";
	        };
	        SVGPathSegCurvetoCubicSmoothRel.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._x2 + " " + this._y2 + " " + this._x + " " + this._y;
	        };
	        SVGPathSegCurvetoCubicSmoothRel.prototype.clone = function () {
	            return new SVGPathSegCurvetoCubicSmoothRel(undefined, this._x, this._y, this._x2, this._y2);
	        };
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothRel.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothRel.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothRel.prototype, "x2", { get: function get() {
	                return this._x2;
	            }, set: function set(x2) {
	                this._x2 = x2;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoCubicSmoothRel.prototype, "y2", { get: function get() {
	                return this._y2;
	            }, set: function set(y2) {
	                this._y2 = y2;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegCurvetoQuadraticSmoothAbs = function (owningPathSegList, x, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS, "T", owningPathSegList);
	            this._x = x;
	            this._y = y;
	        };
	        SVGPathSegCurvetoQuadraticSmoothAbs.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoQuadraticSmoothAbs.prototype.toString = function () {
	            return "[object SVGPathSegCurvetoQuadraticSmoothAbs]";
	        };
	        SVGPathSegCurvetoQuadraticSmoothAbs.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._x + " " + this._y;
	        };
	        SVGPathSegCurvetoQuadraticSmoothAbs.prototype.clone = function () {
	            return new SVGPathSegCurvetoQuadraticSmoothAbs(undefined, this._x, this._y);
	        };
	        Object.defineProperty(SVGPathSegCurvetoQuadraticSmoothAbs.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticSmoothAbs.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	
	        window.SVGPathSegCurvetoQuadraticSmoothRel = function (owningPathSegList, x, y) {
	            SVGPathSeg.call(this, SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL, "t", owningPathSegList);
	            this._x = x;
	            this._y = y;
	        };
	        SVGPathSegCurvetoQuadraticSmoothRel.prototype = Object.create(SVGPathSeg.prototype);
	        SVGPathSegCurvetoQuadraticSmoothRel.prototype.toString = function () {
	            return "[object SVGPathSegCurvetoQuadraticSmoothRel]";
	        };
	        SVGPathSegCurvetoQuadraticSmoothRel.prototype._asPathString = function () {
	            return this.pathSegTypeAsLetter + " " + this._x + " " + this._y;
	        };
	        SVGPathSegCurvetoQuadraticSmoothRel.prototype.clone = function () {
	            return new SVGPathSegCurvetoQuadraticSmoothRel(undefined, this._x, this._y);
	        };
	        Object.defineProperty(SVGPathSegCurvetoQuadraticSmoothRel.prototype, "x", { get: function get() {
	                return this._x;
	            }, set: function set(x) {
	                this._x = x;this._segmentChanged();
	            }, enumerable: true });
	        Object.defineProperty(SVGPathSegCurvetoQuadraticSmoothRel.prototype, "y", { get: function get() {
	                return this._y;
	            }, set: function set(y) {
	                this._y = y;this._segmentChanged();
	            }, enumerable: true });
	
	        // Add createSVGPathSeg* functions to SVGPathElement.
	        // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGPathElement.
	        SVGPathElement.prototype.createSVGPathSegClosePath = function () {
	            return new SVGPathSegClosePath(undefined);
	        };
	        SVGPathElement.prototype.createSVGPathSegMovetoAbs = function (x, y) {
	            return new SVGPathSegMovetoAbs(undefined, x, y);
	        };
	        SVGPathElement.prototype.createSVGPathSegMovetoRel = function (x, y) {
	            return new SVGPathSegMovetoRel(undefined, x, y);
	        };
	        SVGPathElement.prototype.createSVGPathSegLinetoAbs = function (x, y) {
	            return new SVGPathSegLinetoAbs(undefined, x, y);
	        };
	        SVGPathElement.prototype.createSVGPathSegLinetoRel = function (x, y) {
	            return new SVGPathSegLinetoRel(undefined, x, y);
	        };
	        SVGPathElement.prototype.createSVGPathSegCurvetoCubicAbs = function (x, y, x1, y1, x2, y2) {
	            return new SVGPathSegCurvetoCubicAbs(undefined, x, y, x1, y1, x2, y2);
	        };
	        SVGPathElement.prototype.createSVGPathSegCurvetoCubicRel = function (x, y, x1, y1, x2, y2) {
	            return new SVGPathSegCurvetoCubicRel(undefined, x, y, x1, y1, x2, y2);
	        };
	        SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticAbs = function (x, y, x1, y1) {
	            return new SVGPathSegCurvetoQuadraticAbs(undefined, x, y, x1, y1);
	        };
	        SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticRel = function (x, y, x1, y1) {
	            return new SVGPathSegCurvetoQuadraticRel(undefined, x, y, x1, y1);
	        };
	        SVGPathElement.prototype.createSVGPathSegArcAbs = function (x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
	            return new SVGPathSegArcAbs(undefined, x, y, r1, r2, angle, largeArcFlag, sweepFlag);
	        };
	        SVGPathElement.prototype.createSVGPathSegArcRel = function (x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
	            return new SVGPathSegArcRel(undefined, x, y, r1, r2, angle, largeArcFlag, sweepFlag);
	        };
	        SVGPathElement.prototype.createSVGPathSegLinetoHorizontalAbs = function (x) {
	            return new SVGPathSegLinetoHorizontalAbs(undefined, x);
	        };
	        SVGPathElement.prototype.createSVGPathSegLinetoHorizontalRel = function (x) {
	            return new SVGPathSegLinetoHorizontalRel(undefined, x);
	        };
	        SVGPathElement.prototype.createSVGPathSegLinetoVerticalAbs = function (y) {
	            return new SVGPathSegLinetoVerticalAbs(undefined, y);
	        };
	        SVGPathElement.prototype.createSVGPathSegLinetoVerticalRel = function (y) {
	            return new SVGPathSegLinetoVerticalRel(undefined, y);
	        };
	        SVGPathElement.prototype.createSVGPathSegCurvetoCubicSmoothAbs = function (x, y, x2, y2) {
	            return new SVGPathSegCurvetoCubicSmoothAbs(undefined, x, y, x2, y2);
	        };
	        SVGPathElement.prototype.createSVGPathSegCurvetoCubicSmoothRel = function (x, y, x2, y2) {
	            return new SVGPathSegCurvetoCubicSmoothRel(undefined, x, y, x2, y2);
	        };
	        SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticSmoothAbs = function (x, y) {
	            return new SVGPathSegCurvetoQuadraticSmoothAbs(undefined, x, y);
	        };
	        SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticSmoothRel = function (x, y) {
	            return new SVGPathSegCurvetoQuadraticSmoothRel(undefined, x, y);
	        };
	    }
	
	    if (!("SVGPathSegList" in window)) {
	        // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGPathSegList
	        window.SVGPathSegList = function (pathElement) {
	            this._pathElement = pathElement;
	            this._list = this._parsePath(this._pathElement.getAttribute("d"));
	
	            // Use a MutationObserver to catch changes to the path's "d" attribute.
	            this._mutationObserverConfig = { "attributes": true, "attributeFilter": ["d"] };
	            this._pathElementMutationObserver = new MutationObserver(this._updateListFromPathMutations.bind(this));
	            this._pathElementMutationObserver.observe(this._pathElement, this._mutationObserverConfig);
	        };
	
	        Object.defineProperty(SVGPathSegList.prototype, "numberOfItems", {
	            get: function get() {
	                this._checkPathSynchronizedToList();
	                return this._list.length;
	            },
	            enumerable: true
	        });
	
	        // Add the pathSegList accessors to SVGPathElement.
	        // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGAnimatedPathData
	        Object.defineProperty(SVGPathElement.prototype, "pathSegList", {
	            get: function get() {
	                if (!this._pathSegList) this._pathSegList = new SVGPathSegList(this);
	                return this._pathSegList;
	            },
	            enumerable: true
	        });
	        // FIXME: The following are not implemented and simply return SVGPathElement.pathSegList.
	        Object.defineProperty(SVGPathElement.prototype, "normalizedPathSegList", { get: function get() {
	                return this.pathSegList;
	            }, enumerable: true });
	        Object.defineProperty(SVGPathElement.prototype, "animatedPathSegList", { get: function get() {
	                return this.pathSegList;
	            }, enumerable: true });
	        Object.defineProperty(SVGPathElement.prototype, "animatedNormalizedPathSegList", { get: function get() {
	                return this.pathSegList;
	            }, enumerable: true });
	
	        // Process any pending mutations to the path element and update the list as needed.
	        // This should be the first call of all public functions and is needed because
	        // MutationObservers are not synchronous so we can have pending asynchronous mutations.
	        SVGPathSegList.prototype._checkPathSynchronizedToList = function () {
	            this._updateListFromPathMutations(this._pathElementMutationObserver.takeRecords());
	        };
	
	        SVGPathSegList.prototype._updateListFromPathMutations = function (mutationRecords) {
	            if (!this._pathElement) return;
	            var hasPathMutations = false;
	            mutationRecords.forEach(function (record) {
	                if (record.attributeName == "d") hasPathMutations = true;
	            });
	            if (hasPathMutations) this._list = this._parsePath(this._pathElement.getAttribute("d"));
	        };
	
	        // Serialize the list and update the path's 'd' attribute.
	        SVGPathSegList.prototype._writeListToPath = function () {
	            this._pathElementMutationObserver.disconnect();
	            this._pathElement.setAttribute("d", SVGPathSegList._pathSegArrayAsString(this._list));
	            this._pathElementMutationObserver.observe(this._pathElement, this._mutationObserverConfig);
	        };
	
	        // When a path segment changes the list needs to be synchronized back to the path element.
	        SVGPathSegList.prototype.segmentChanged = function (pathSeg) {
	            this._writeListToPath();
	        };
	
	        SVGPathSegList.prototype.clear = function () {
	            this._checkPathSynchronizedToList();
	
	            this._list.forEach(function (pathSeg) {
	                pathSeg._owningPathSegList = null;
	            });
	            this._list = [];
	            this._writeListToPath();
	        };
	
	        SVGPathSegList.prototype.initialize = function (newItem) {
	            this._checkPathSynchronizedToList();
	
	            this._list = [newItem];
	            newItem._owningPathSegList = this;
	            this._writeListToPath();
	            return newItem;
	        };
	
	        SVGPathSegList.prototype._checkValidIndex = function (index) {
	            if (isNaN(index) || index < 0 || index >= this.numberOfItems) throw "INDEX_SIZE_ERR";
	        };
	
	        SVGPathSegList.prototype.getItem = function (index) {
	            this._checkPathSynchronizedToList();
	
	            this._checkValidIndex(index);
	            return this._list[index];
	        };
	
	        SVGPathSegList.prototype.insertItemBefore = function (newItem, index) {
	            this._checkPathSynchronizedToList();
	
	            // Spec: If the index is greater than or equal to numberOfItems, then the new item is appended to the end of the list.
	            if (index > this.numberOfItems) index = this.numberOfItems;
	            if (newItem._owningPathSegList) {
	                // SVG2 spec says to make a copy.
	                newItem = newItem.clone();
	            }
	            this._list.splice(index, 0, newItem);
	            newItem._owningPathSegList = this;
	            this._writeListToPath();
	            return newItem;
	        };
	
	        SVGPathSegList.prototype.replaceItem = function (newItem, index) {
	            this._checkPathSynchronizedToList();
	
	            if (newItem._owningPathSegList) {
	                // SVG2 spec says to make a copy.
	                newItem = newItem.clone();
	            }
	            this._checkValidIndex(index);
	            this._list[index] = newItem;
	            newItem._owningPathSegList = this;
	            this._writeListToPath();
	            return newItem;
	        };
	
	        SVGPathSegList.prototype.removeItem = function (index) {
	            this._checkPathSynchronizedToList();
	
	            this._checkValidIndex(index);
	            var item = this._list[index];
	            this._list.splice(index, 1);
	            this._writeListToPath();
	            return item;
	        };
	
	        SVGPathSegList.prototype.appendItem = function (newItem) {
	            this._checkPathSynchronizedToList();
	
	            if (newItem._owningPathSegList) {
	                // SVG2 spec says to make a copy.
	                newItem = newItem.clone();
	            }
	            this._list.push(newItem);
	            newItem._owningPathSegList = this;
	            // TODO: Optimize this to just append to the existing attribute.
	            this._writeListToPath();
	            return newItem;
	        };
	
	        SVGPathSegList._pathSegArrayAsString = function (pathSegArray) {
	            var string = "";
	            var first = true;
	            pathSegArray.forEach(function (pathSeg) {
	                if (first) {
	                    first = false;
	                    string += pathSeg._asPathString();
	                } else {
	                    string += " " + pathSeg._asPathString();
	                }
	            });
	            return string;
	        };
	
	        // This closely follows SVGPathParser::parsePath from Source/core/svg/SVGPathParser.cpp.
	        SVGPathSegList.prototype._parsePath = function (string) {
	            if (!string || string.length == 0) return [];
	
	            var owningPathSegList = this;
	
	            var Builder = function Builder() {
	                this.pathSegList = [];
	            };
	
	            Builder.prototype.appendSegment = function (pathSeg) {
	                this.pathSegList.push(pathSeg);
	            };
	
	            var Source = function Source(string) {
	                this._string = string;
	                this._currentIndex = 0;
	                this._endIndex = this._string.length;
	                this._previousCommand = SVGPathSeg.PATHSEG_UNKNOWN;
	
	                this._skipOptionalSpaces();
	            };
	
	            Source.prototype._isCurrentSpace = function () {
	                var character = this._string[this._currentIndex];
	                return character <= " " && (character == " " || character == "\n" || character == "\t" || character == "\r" || character == "\f");
	            };
	
	            Source.prototype._skipOptionalSpaces = function () {
	                while (this._currentIndex < this._endIndex && this._isCurrentSpace()) {
	                    this._currentIndex++;
	                }return this._currentIndex < this._endIndex;
	            };
	
	            Source.prototype._skipOptionalSpacesOrDelimiter = function () {
	                if (this._currentIndex < this._endIndex && !this._isCurrentSpace() && this._string.charAt(this._currentIndex) != ",") return false;
	                if (this._skipOptionalSpaces()) {
	                    if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == ",") {
	                        this._currentIndex++;
	                        this._skipOptionalSpaces();
	                    }
	                }
	                return this._currentIndex < this._endIndex;
	            };
	
	            Source.prototype.hasMoreData = function () {
	                return this._currentIndex < this._endIndex;
	            };
	
	            Source.prototype.peekSegmentType = function () {
	                var lookahead = this._string[this._currentIndex];
	                return this._pathSegTypeFromChar(lookahead);
	            };
	
	            Source.prototype._pathSegTypeFromChar = function (lookahead) {
	                switch (lookahead) {
	                    case "Z":
	                    case "z":
	                        return SVGPathSeg.PATHSEG_CLOSEPATH;
	                    case "M":
	                        return SVGPathSeg.PATHSEG_MOVETO_ABS;
	                    case "m":
	                        return SVGPathSeg.PATHSEG_MOVETO_REL;
	                    case "L":
	                        return SVGPathSeg.PATHSEG_LINETO_ABS;
	                    case "l":
	                        return SVGPathSeg.PATHSEG_LINETO_REL;
	                    case "C":
	                        return SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS;
	                    case "c":
	                        return SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL;
	                    case "Q":
	                        return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS;
	                    case "q":
	                        return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL;
	                    case "A":
	                        return SVGPathSeg.PATHSEG_ARC_ABS;
	                    case "a":
	                        return SVGPathSeg.PATHSEG_ARC_REL;
	                    case "H":
	                        return SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS;
	                    case "h":
	                        return SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL;
	                    case "V":
	                        return SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS;
	                    case "v":
	                        return SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL;
	                    case "S":
	                        return SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS;
	                    case "s":
	                        return SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL;
	                    case "T":
	                        return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS;
	                    case "t":
	                        return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL;
	                    default:
	                        return SVGPathSeg.PATHSEG_UNKNOWN;
	                }
	            };
	
	            Source.prototype._nextCommandHelper = function (lookahead, previousCommand) {
	                // Check for remaining coordinates in the current command.
	                if ((lookahead == "+" || lookahead == "-" || lookahead == "." || lookahead >= "0" && lookahead <= "9") && previousCommand != SVGPathSeg.PATHSEG_CLOSEPATH) {
	                    if (previousCommand == SVGPathSeg.PATHSEG_MOVETO_ABS) return SVGPathSeg.PATHSEG_LINETO_ABS;
	                    if (previousCommand == SVGPathSeg.PATHSEG_MOVETO_REL) return SVGPathSeg.PATHSEG_LINETO_REL;
	                    return previousCommand;
	                }
	                return SVGPathSeg.PATHSEG_UNKNOWN;
	            };
	
	            Source.prototype.initialCommandIsMoveTo = function () {
	                // If the path is empty it is still valid, so return true.
	                if (!this.hasMoreData()) return true;
	                var command = this.peekSegmentType();
	                // Path must start with moveTo.
	                return command == SVGPathSeg.PATHSEG_MOVETO_ABS || command == SVGPathSeg.PATHSEG_MOVETO_REL;
	            };
	
	            // Parse a number from an SVG path. This very closely follows genericParseNumber(...) from Source/core/svg/SVGParserUtilities.cpp.
	            // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-PathDataBNF
	            Source.prototype._parseNumber = function () {
	                var exponent = 0;
	                var integer = 0;
	                var frac = 1;
	                var decimal = 0;
	                var sign = 1;
	                var expsign = 1;
	
	                var startIndex = this._currentIndex;
	
	                this._skipOptionalSpaces();
	
	                // Read the sign.
	                if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == "+") this._currentIndex++;else if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == "-") {
	                    this._currentIndex++;
	                    sign = -1;
	                }
	
	                if (this._currentIndex == this._endIndex || (this._string.charAt(this._currentIndex) < "0" || this._string.charAt(this._currentIndex) > "9") && this._string.charAt(this._currentIndex) != ".")
	                    // The first character of a number must be one of [0-9+-.].
	                    return undefined;
	
	                // Read the integer part, build right-to-left.
	                var startIntPartIndex = this._currentIndex;
	                while (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= "0" && this._string.charAt(this._currentIndex) <= "9") {
	                    this._currentIndex++;
	                } // Advance to first non-digit.
	
	                if (this._currentIndex != startIntPartIndex) {
	                    var scanIntPartIndex = this._currentIndex - 1;
	                    var multiplier = 1;
	                    while (scanIntPartIndex >= startIntPartIndex) {
	                        integer += multiplier * (this._string.charAt(scanIntPartIndex--) - "0");
	                        multiplier *= 10;
	                    }
	                }
	
	                // Read the decimals.
	                if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == ".") {
	                    this._currentIndex++;
	
	                    // There must be a least one digit following the .
	                    if (this._currentIndex >= this._endIndex || this._string.charAt(this._currentIndex) < "0" || this._string.charAt(this._currentIndex) > "9") return undefined;
	                    while (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= "0" && this._string.charAt(this._currentIndex) <= "9") {
	                        decimal += (this._string.charAt(this._currentIndex++) - "0") * (frac *= 0.1);
	                    }
	                }
	
	                // Read the exponent part.
	                if (this._currentIndex != startIndex && this._currentIndex + 1 < this._endIndex && (this._string.charAt(this._currentIndex) == "e" || this._string.charAt(this._currentIndex) == "E") && this._string.charAt(this._currentIndex + 1) != "x" && this._string.charAt(this._currentIndex + 1) != "m") {
	                    this._currentIndex++;
	
	                    // Read the sign of the exponent.
	                    if (this._string.charAt(this._currentIndex) == "+") {
	                        this._currentIndex++;
	                    } else if (this._string.charAt(this._currentIndex) == "-") {
	                        this._currentIndex++;
	                        expsign = -1;
	                    }
	
	                    // There must be an exponent.
	                    if (this._currentIndex >= this._endIndex || this._string.charAt(this._currentIndex) < "0" || this._string.charAt(this._currentIndex) > "9") return undefined;
	
	                    while (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= "0" && this._string.charAt(this._currentIndex) <= "9") {
	                        exponent *= 10;
	                        exponent += this._string.charAt(this._currentIndex) - "0";
	                        this._currentIndex++;
	                    }
	                }
	
	                var number = integer + decimal;
	                number *= sign;
	
	                if (exponent) number *= Math.pow(10, expsign * exponent);
	
	                if (startIndex == this._currentIndex) return undefined;
	
	                this._skipOptionalSpacesOrDelimiter();
	
	                return number;
	            };
	
	            Source.prototype._parseArcFlag = function () {
	                if (this._currentIndex >= this._endIndex) return undefined;
	                var flag = false;
	                var flagChar = this._string.charAt(this._currentIndex++);
	                if (flagChar == "0") flag = false;else if (flagChar == "1") flag = true;else return undefined;
	
	                this._skipOptionalSpacesOrDelimiter();
	                return flag;
	            };
	
	            Source.prototype.parseSegment = function () {
	                var lookahead = this._string[this._currentIndex];
	                var command = this._pathSegTypeFromChar(lookahead);
	                if (command == SVGPathSeg.PATHSEG_UNKNOWN) {
	                    // Possibly an implicit command. Not allowed if this is the first command.
	                    if (this._previousCommand == SVGPathSeg.PATHSEG_UNKNOWN) return null;
	                    command = this._nextCommandHelper(lookahead, this._previousCommand);
	                    if (command == SVGPathSeg.PATHSEG_UNKNOWN) return null;
	                } else {
	                    this._currentIndex++;
	                }
	
	                this._previousCommand = command;
	
	                switch (command) {
	                    case SVGPathSeg.PATHSEG_MOVETO_REL:
	                        return new SVGPathSegMovetoRel(owningPathSegList, this._parseNumber(), this._parseNumber());
	                    case SVGPathSeg.PATHSEG_MOVETO_ABS:
	                        return new SVGPathSegMovetoAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
	                    case SVGPathSeg.PATHSEG_LINETO_REL:
	                        return new SVGPathSegLinetoRel(owningPathSegList, this._parseNumber(), this._parseNumber());
	                    case SVGPathSeg.PATHSEG_LINETO_ABS:
	                        return new SVGPathSegLinetoAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
	                    case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
	                        return new SVGPathSegLinetoHorizontalRel(owningPathSegList, this._parseNumber());
	                    case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
	                        return new SVGPathSegLinetoHorizontalAbs(owningPathSegList, this._parseNumber());
	                    case SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL:
	                        return new SVGPathSegLinetoVerticalRel(owningPathSegList, this._parseNumber());
	                    case SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
	                        return new SVGPathSegLinetoVerticalAbs(owningPathSegList, this._parseNumber());
	                    case SVGPathSeg.PATHSEG_CLOSEPATH:
	                        this._skipOptionalSpaces();
	                        return new SVGPathSegClosePath(owningPathSegList);
	                    case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
	                        var points = { x1: this._parseNumber(), y1: this._parseNumber(), x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber() };
	                        return new SVGPathSegCurvetoCubicRel(owningPathSegList, points.x, points.y, points.x1, points.y1, points.x2, points.y2);
	                    case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
	                        var points = { x1: this._parseNumber(), y1: this._parseNumber(), x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber() };
	                        return new SVGPathSegCurvetoCubicAbs(owningPathSegList, points.x, points.y, points.x1, points.y1, points.x2, points.y2);
	                    case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL:
	                        var points = { x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber() };
	                        return new SVGPathSegCurvetoCubicSmoothRel(owningPathSegList, points.x, points.y, points.x2, points.y2);
	                    case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS:
	                        var points = { x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber() };
	                        return new SVGPathSegCurvetoCubicSmoothAbs(owningPathSegList, points.x, points.y, points.x2, points.y2);
	                    case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL:
	                        var points = { x1: this._parseNumber(), y1: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber() };
	                        return new SVGPathSegCurvetoQuadraticRel(owningPathSegList, points.x, points.y, points.x1, points.y1);
	                    case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS:
	                        var points = { x1: this._parseNumber(), y1: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber() };
	                        return new SVGPathSegCurvetoQuadraticAbs(owningPathSegList, points.x, points.y, points.x1, points.y1);
	                    case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL:
	                        return new SVGPathSegCurvetoQuadraticSmoothRel(owningPathSegList, this._parseNumber(), this._parseNumber());
	                    case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS:
	                        return new SVGPathSegCurvetoQuadraticSmoothAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
	                    case SVGPathSeg.PATHSEG_ARC_REL:
	                        var points = { x1: this._parseNumber(), y1: this._parseNumber(), arcAngle: this._parseNumber(), arcLarge: this._parseArcFlag(), arcSweep: this._parseArcFlag(), x: this._parseNumber(), y: this._parseNumber() };
	                        return new SVGPathSegArcRel(owningPathSegList, points.x, points.y, points.x1, points.y1, points.arcAngle, points.arcLarge, points.arcSweep);
	                    case SVGPathSeg.PATHSEG_ARC_ABS:
	                        var points = { x1: this._parseNumber(), y1: this._parseNumber(), arcAngle: this._parseNumber(), arcLarge: this._parseArcFlag(), arcSweep: this._parseArcFlag(), x: this._parseNumber(), y: this._parseNumber() };
	                        return new SVGPathSegArcAbs(owningPathSegList, points.x, points.y, points.x1, points.y1, points.arcAngle, points.arcLarge, points.arcSweep);
	                    default:
	                        throw "Unknown path seg type.";
	                }
	            };
	
	            var builder = new Builder();
	            var source = new Source(string);
	
	            if (!source.initialCommandIsMoveTo()) return [];
	            while (source.hasMoreData()) {
	                var pathSeg = source.parseSegment();
	                if (!pathSeg) return [];
	                builder.appendSegment(pathSeg);
	            }
	
	            return builder.pathSegList;
	        };
	    }
	})();

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	(function () {
	    "use strict";
	
	    var options = {
	        shortLabels: false,
	        shortLabelLength: 4,
	        statuses: ['SUCCESS', 'FAILED', 'PENDING', 'RUNNING']
	    };
	
	    var init = function init(_options) {
	        options = _.extend(options, _options);
	    };
	
	    var get = function get(name) {
	        return options[name];
	    };
	
	    module.exports = {
	        init: init,
	        get: get
	    };
	})();

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	(function () {
	    "use strict";
	
	    var Options = __webpack_require__(3);
	    var GraphModel = __webpack_require__(5);
	    var Icons = __webpack_require__(6);
	    var Zoom = __webpack_require__(7);
	
	    var svg;
	    var svgGroup;
	    var graph;
	    var renderer;
	
	    var init = function init() {
	        svg = Options.get('svg');
	        svgGroup = svg.select('g');
	        graph = Options.get('graph');
	        renderer = new dagreD3.render();
	
	        GraphModel.create(graph);
	    };
	
	    var render = function render() {
	        setEdgesInterpolation();
	        var durationVal = 400;
	        graph.graph().transition = function (selection) {
	            return selection.transition().duration(durationVal);
	        };
	        renderer(svgGroup, graph);
	
	        setTimeout(function () {
	            addLinks();
	            renderTooltips();
	        }, durationVal + 100);
	
	        renderStatus();
	        Zoom.setZoom(svg, svgGroup, graph);
	    };
	
	    var renderTooltips = function renderTooltips() {
	        var shortLabels = Options.get('shortLabels');
	        if (!shortLabels) {
	            return false;
	        }
	
	        var styleTooltip = function styleTooltip(name, description) {
	            return "<div class='description'>" + description + "</div>";
	        };
	
	        svg.selectAll("g.node").attr("title", function (v) {
	            var description = graph.node(v).description;
	            return description ? styleTooltip(v, description) : '';
	        }).each(function (v) {
	            var description = graph.node(v).description;
	            if (description) {
	                jQuery(this).tipsy({ gravity: "n", opacity: 1, html: true });
	            }
	        });
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
	                if (!_iteratorNormalCompletion && _iterator.return) {
	                    _iterator.return();
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
	        var statuses = Options.get('statuses');
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;
	
	        try {
	            for (var _iterator2 = statuses[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var statusName = _step2.value;
	
	                $nodeElem.classed(statusName, false);
	            }
	        } catch (err) {
	            _didIteratorError2 = true;
	            _iteratorError2 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                    _iterator2.return();
	                }
	            } finally {
	                if (_didIteratorError2) {
	                    throw _iteratorError2;
	                }
	            }
	        }
	
	        $nodeElem.classed(status, true);
	    };
	
	    var setNodeLabel = function setNodeLabel(nodeId, label) {
	        var $nodeElem = findNodeElem(nodeId);
	        $nodeElem.select('tspan').text(label);
	    };
	
	    var setEdgesInterpolation = function setEdgesInterpolation() {
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;
	
	        try {
	            for (var _iterator3 = Object.keys(graph._edgeLabels)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var key = _step3.value;
	
	                var edgeLabel = graph._edgeLabels[key];
	                edgeLabel.lineInterpolate = 'bundle';
	            }
	        } catch (err) {
	            _didIteratorError3 = true;
	            _iteratorError3 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                    _iterator3.return();
	                }
	            } finally {
	                if (_didIteratorError3) {
	                    throw _iteratorError3;
	                }
	            }
	        }
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
	            $label.attr('transform', 'translate(' + -width / 2 + ',' + -height / 2 + ')').classed('toggle-link expanded', true);
	        } else {
	            $label.attr('transform', 'translate(' + -width / 2 + ',' + -height / 4 + ')').classed('toggle-link collapsed', true);
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
	        }).attr('transform', 'translate(0, -4) scale(0.8)');
	
	        $label.on('click', function (clusterId) {
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
	            var _iteratorNormalCompletion4 = true;
	            var _didIteratorError4 = false;
	            var _iteratorError4 = undefined;
	
	            try {
	                for (var _iterator4 = Object.keys(contents)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                    var _id = _step4.value;
	
	                    graph.removeNode(_id);
	                }
	            } catch (err) {
	                _didIteratorError4 = true;
	                _iteratorError4 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                        _iterator4.return();
	                    }
	                } finally {
	                    if (_didIteratorError4) {
	                        throw _iteratorError4;
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
	
	                var _iteratorNormalCompletion5 = true;
	                var _didIteratorError5 = false;
	                var _iteratorError5 = undefined;
	
	                try {
	                    for (var _iterator5 = contentsNodes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                        var _id = _step5.value;
	
	                        graph.setNode(_id, nodes[_id].properties);
	                        graph.setParent(_id, clusterId);
	                    }
	                } catch (err) {
	                    _didIteratorError5 = true;
	                    _iteratorError5 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                            _iterator5.return();
	                        }
	                    } finally {
	                        if (_didIteratorError5) {
	                            throw _iteratorError5;
	                        }
	                    }
	                }
	
	                var _iteratorNormalCompletion6 = true;
	                var _didIteratorError6 = false;
	                var _iteratorError6 = undefined;
	
	                try {
	                    for (var _iterator6 = contentsClusters[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                        var _id = _step6.value;
	
	                        graph.setNode(_id, nodes[_id].properties);
	                        graph.setParent(_id, clusterId);
	                        GraphModel.expandCluster(_id);
	                        for (var contentId in nodes[_id].cluster.contents) {
	                            graph.setParent(contentId, _id);
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError6 = true;
	                    _iteratorError6 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                            _iterator6.return();
	                        }
	                    } finally {
	                        if (_didIteratorError6) {
	                            throw _iteratorError6;
	                        }
	                    }
	                }
	
	                var _iteratorNormalCompletion7 = true;
	                var _didIteratorError7 = false;
	                var _iteratorError7 = undefined;
	
	                try {
	                    for (var _iterator7 = Object.keys(node.parents)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                        var parentId = _step7.value;
	
	                        graph.setParent(clusterId, parentId);
	                    }
	                } catch (err) {
	                    _didIteratorError7 = true;
	                    _iteratorError7 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
	                            _iterator7.return();
	                        }
	                    } finally {
	                        if (_didIteratorError7) {
	                            throw _iteratorError7;
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
	        setNodeLabel: setNodeLabel,
	        setNodeStatus: setNodeStatus
	    };
	})();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	(function () {
	    "use strict";
	
	    var Options = __webpack_require__(3);
	
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
	                if (!_iteratorNormalCompletion && _iterator.return) {
	                    _iterator.return();
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
	        } else {
	            var shortLabels = Options.get('shortLabels');
	            if (shortLabels && node.shortLabel) {
	                var shortLabelLength = Options.get('shortLabelLength');
	                if (node.label.length > shortLabelLength) {
	                    node.description = node.label;
	                    node.label = node.label.substring(0, shortLabelLength) + '...';
	                }
	            }
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
	                if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                    _iterator2.return();
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
	                var parent = _step3.value;
	
	                parents[_in[parent].v] = true;
	            }
	        } catch (err) {
	            _didIteratorError3 = true;
	            _iteratorError3 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                    _iterator3.return();
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
	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                    _iterator4.return();
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
	                    var _loop = function _loop() {
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
	                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                            _iterator6.return();
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
	                    var _loop2 = function _loop2() {
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
	                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
	                            _iterator7.return();
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
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
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
	                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
	                            _iterator9.return();
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
	                if (!_iteratorNormalCompletion8 && _iterator8.return) {
	                    _iterator8.return();
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
	                        if (!_iteratorNormalCompletion11 && _iterator11.return) {
	                            _iterator11.return();
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
	                if (!_iteratorNormalCompletion10 && _iterator10.return) {
	                    _iterator10.return();
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
	                if (!_iteratorNormalCompletion12 && _iterator12.return) {
	                    _iterator12.return();
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
/* 6 */
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
/* 7 */
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