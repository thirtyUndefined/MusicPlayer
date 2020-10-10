(function (root) {
    class Music {
        constructor() {
            this.audio = new Audio(); // 创建audio实例
            this.status = "pause"; // 当前歌曲的状态
        }
        load(src) { // 加载歌曲
            this.audio.src = src;
            this.audio.load();
        }
        play() { // 播放歌曲
            this.audio.play();
            this.status = "play";
        }
        pause() { // 暂停音乐
            this.audio.pause();
            this.status = "pause";
        }
        end(fn) { // 音乐播放完成事件
            this.audio.onended = fn;
        }
        playto(time) { // 拖拽时间时间
            this.audio.currentTime = time;
        }
    };

    // 对外暴露
    root.music = new Music();
})(window.player || (window.player = {}));