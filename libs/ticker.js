"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var raf_1 = __importDefault(require("raf"));
var Ticker = (function () {
    function Ticker(interval) {
        var _this = this;
        this.tasks = [];
        this.frameId = 0;
        this.isRun = true;
        var useInterval = false;
        if (typeof interval === "number" && interval > 1000 / 60) {
            useInterval = true;
        }
        var exec = function () { return _this.tasks.forEach(function (item) { return item(); }); };
        var start = Date.now();
        var frame = function () {
            if (_this.isRun === false) {
                return;
            }
            _this.frameId = raf_1.default(frame);
            if (useInterval) {
                var current = Date.now();
                var diff = current - start;
                if (diff >= interval) {
                    exec();
                    start = current;
                }
            }
            else {
                exec();
            }
        };
        this.frameId = raf_1.default(frame);
    }
    Ticker.prototype.add = function (task) {
        if (typeof task === "function") {
            this.tasks.push(task);
        }
    };
    Ticker.prototype.remove = function (task) {
        if (typeof task === "function") {
            var findIndex = -1;
            for (var i = 0; i < this.tasks.length; i++) {
                if (this.tasks[i] === task) {
                    findIndex = i;
                    break;
                }
            }
            if (findIndex >= 0) {
                this.tasks.splice(findIndex, 1);
            }
        }
    };
    Ticker.prototype.destroy = function () {
        this.isRun = false;
        raf_1.default.cancel(this.frameId);
        this.tasks = [];
    };
    return Ticker;
}());
exports.default = Ticker;
