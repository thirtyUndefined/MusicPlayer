(function(root) {
    // 进度条对象
    function Progress() {
        this.durTime = 0; // 总时间
        this.Timer = null; // 计时器
        this.startTime = 0; // 开始时间

        this.lastPacuse = 0; // 上一次暂停的时间

        this.init();
    }
    Progress.prototype = {
        init() {
            //console.log('init');
            this.getDom();

            //console.log(this.initTime(246));
        },
        // 获取DON元素
        getDom() {
            this.curtTime = document.querySelector(".startTime");
            this.circle = document.querySelector(".circle");
            this.backBg = document.querySelector(".backBg");
            this.totalTime = document.querySelector(".totalTime"); 
        },
        // 初始化 歌曲时间
        initTime(time) {
            time = Math.round(time);
            let m = Math.floor(time / 60);
            let s = time % 60;

            m = m >= 10 ? m : "0" + m;
            s =  s >= 10 ? s : "0" + s;

            T = m + ":" + s;
            return T;
        },
        // 渲染总时间
        renderTotTime(time) {
            this.durTime = time; // 存储总时间
            let lastTime = this.initTime(this.durTime);
            this.totalTime.innerHTML = lastTime;
        },

        // 进度条移动
        move(pre) { // 传参 pre 解决 切歌后时间仍然接着走的问题

            let _this = this;

            cancelAnimationFrame(this.Timer); // 解决切歌暂停后左边时间还在走的问题

            this.lastPacuse = pre === undefined ? this.lastPacuse : pre;

            this.startTime = new Date().getTime(); // 记录按下的时间
            function walk() {
                let curTime = new Date().getTime(); // 走了一段之后的时间
                let pre = _this.lastPacuse + (curTime - _this.startTime) / (_this.durTime * 1000); // 时间走过的百分比

                if( pre <= 1 ) {
                    //console.log("update")
                    _this.updata(pre)
                }else {
                    cancelAnimationFrame(_this.Timer);
                }

                _this.Timer = requestAnimationFrame(walk); // h5 新增定时器，自己调自己
            }
            walk();
        },
        
        // 更新进度条
        updata(pre) {
            // 更新左边的时间
            let time = this.initTime(pre * this.durTime);
            this.curtTime.innerHTML = time;

            // 更新进度条位置
            this.backBg.style.width = pre * 100 + "%";

            // 更新原点位置
            let l = pre * this.circle.parentNode.offsetWidth;
            this.circle.style.transform = `translateX(${l}px)`;
        },

        // 暂停进度条 
        stop() {
            cancelAnimationFrame(this.Timer);

            let stopTime = new Date().getTime();
            this.lastPacuse += (stopTime - this.startTime) / (this.durTime * 1000);
        }
    }

    // 返回实例 Progress
    function instancePro() {
        return new Progress();
    }

    // 拖拽对象
    function Drag(obj) {
        this.obj = obj;
        this.startPointX = 0;
        this.startLeft = 0;
        this.percent = 0;

        this.init();
    }
    Drag.prototype = {
        init() {
            let _this = this;
            this.obj.style.transform = `translateX(0)`; // 初始值

            // 手指按下事件
            this.obj.addEventListener("touchstart", function(ev){
                _this.startPointX = ev.changedTouches[0].pageX; // 第1个手指按下是的左边距
                _this.startLeft = parseFloat(this.style.transform.split("(")[1]);

                _this.start && _this.start();
            });

            // 手指移动事件
            this.obj.addEventListener("touchmove", function(ev) {
                console.log(_this.startLeft)
                _this.disPointX = ev.changedTouches[0].pageX - _this.startPointX;

                // 盒子移动距离
                let l = _this.disPointX + _this.startLeft;
                // 限制拖拽距离
                if(l < 0 ) {
                    l = 0;
                }else if(l > this.offsetParent.offsetWidth) {
                    l = this.offsetParent.offsetWidth;
                }
                //console.log(l)
                this.style.transform = "translateX("+ l +"px)";

                _this.percent = l / this.offsetParent.offsetWidth;

                _this.move && _this.move(_this.percent);

                ev.preventDefault();
            });

            // 拖拽结束事件

            this.obj.addEventListener("touchend", function(ev) {
                _this.end && _this.end(_this.percent);
            });

            // if( this.percent == 1 ) {
            //     this.lastM && this.lastM();
            // }

        }
    }
    
    // 返回实例 drag
    function instanceDra(obj) {
        return new Drag(obj);
    }
    // 暴露接口
    root.progress = {
        pro : instancePro,
        drag : instanceDra
    }
})(window.player || (window.player = {}))