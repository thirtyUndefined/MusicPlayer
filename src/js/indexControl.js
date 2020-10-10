(function (root) {
    class IndexCon {
        constructor(len) {
            this.index = 0; // 当前索引值
            this.len = len;
        }
        // 前一首
        prev() {
            return this.get(-1);
        }
        // 下一首
        next() {
            return this.get(1);
        }
        // 获取当前索引
        get(val) {
            this.index = (this.index + val + this.len) % this.len;
            return this.index;
        }
    }
    root.indexCon = IndexCon;
})(window.player || (window.player = {}));