define("ace/mode/psylab",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/custom_highlight_rules","ace/range","ace/worker/worker_client"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var CustomHighlightRules = require("./custom_highlight_rules").CustomHighlightRules;
var Range = require("../range").Range;
var WorkerClient = require("../worker/worker_client").WorkerClient;

var Mode = function() {
    this.HighlightRules = CustomHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "#";
    this.$id = "ace/mode/custom";
}).call(Mode.prototype);

exports.Mode = Mode;
});
