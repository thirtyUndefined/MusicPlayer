(function ($, player) {
    class MusicPlayer {
        constructor(dom) {
            this.warp = dom; // 播放器容器（用于加载 listcontrol 模块）
            this.url = "../mock/data.json";
            this.dataList = []; //存储请求的数据

            //this.now = 0; // 当年前音乐的索引
            this.indexObj = null; // 索引值对象 用于切歌
            this.rotateImgTimer = null;

            this.conIndex = 0; // 当前播放音乐的索引
            this.list = null; // 在listCon方法中初始化

            this.progress = player.progress.pro(); // 进度条对象
        }

        init() { // 初始化
            this.getDom();
            this.getData(this.url);

        }
        getDom() { // 获取页面元素
            this.rotateImg = document.querySelector(".songImg img");
            this.controls = document.querySelectorAll(".control li");
        };
        getData(url) { // 获取数据
            $.ajax({
                url: url,
                method: "get",
                success: data => {
                    this.dataList = data;
                    this.listCon();
                    this.indexObj = new player.indexCon(data.length);
                    this.loadMusic(this.indexObj.index); // 加载音乐信息
                    this.controlMusic(); // 音乐操作功能
                    this.dragCon(); // 拖拽控制

                    //  console.log(data)
                },
                error: () => console.log("数据请求失败")
            });
        };
        loadMusic(index) { // 加载音乐
            player.render(this.dataList[index]);
            player.music.load(this.dataList[index].audioSrc);

            this.progress.renderTotTime(this.dataList[index].duration);

            if (player.music.status == "play") {
                player.music.play();
                this.controls[2].className = "playing";
                this.imgRotate(0);

                this.progress.move(0);
            };
            // console.log(index)
            this.conIndex = index;
            this.list.changeActive(index);
        };
        controlMusic() { // 控制音乐 
            // 上一首
            const _this = this;
            this.controls[1].addEventListener("touchend", () => {
                player.music.status = "play";
                0
                this.loadMusic(this.indexObj.prev());
                //console.log(this)
            });

            // 下一首
            this.controls[3].addEventListener("touchend", () => {
                player.music.status = "play";
                this.loadMusic(this.indexObj.next());
            });

            // 播放暂停
            this.controls[2].addEventListener("touchend", function () {
                if (player.music.status == "play") {
                    player.music.pause(); // 暂停
                    this.className = "";
                    //console.log(this)
                    _this.stopImgRotate();

                    _this.progress.stop();
                } else {
                    player.music.play(); // 播放
                    this.className = "playing";

                    // 容错处理  因为第一次加载音乐图片并没有旋转为undefined，因此会出错；
                    let deg = _this.rotateImg.dataset.rotate || 0;

                    _this.imgRotate(deg) // 旋转图片

                    // 播放后进度条 移动
                    _this.progress.move();

                }
            })
        };

        //旋转图片
        imgRotate(deg) {
            clearInterval(this.rotateImgTimer);
            this.rotateImgTimer = setInterval(() => {
                deg = +deg + 0.2;
                this.rotateImg.style.transform = `rotate(${deg}deg)`;

                // 将旋转角度存储在 img 标签上的一个属性中，方便存取；
                this.rotateImg.dataset.rotate = deg;
            }, 1000 / 60);
        };
        stopImgRotate() {
            clearInterval(this.rotateImgTimer);
        };

        listCon() {
            let _this = this;
            this.list = player.listControl(this.dataList, this.warp);
            // 列表点击显示事件
            this.controls[4].addEventListener("touchend", () => {
                this.list.listUp();
            });
            // 列表歌曲添加事件 
            this.list.musicList.forEach(function (items, index) {
                items.addEventListener("touchend", () => {
                    //console.log(_this.conIndex)
                    if (_this.conIndex == index) {
                        return;
                    }
                    player.music.status = "play"; // 歌曲变成播放状态
                    _this.indexObj.index = index; // 索引值对象上的索引值更新
                    _this.loadMusic(index);
                    _this.list.listDown();
                })
            });
            // 列表点击隐藏事件
        };

        // 拖拽控制
        dragCon() {
            let _this = this;
            let circleDom = this.progress.circle;
            let circle = player.progress.drag(circleDom);
           // console.log(circle)
            // console.log(circle.start);

            // 指头按下要做的事
            circle.start = function () {

            };

            // 指头移动的事件
            circle.move = function (pre) {
                _this.progress.updata(pre);
            }

            // 抬起事件
            circle.end = function (pre) {
                let cutT = pre * _this.dataList[_this.indexObj.index].duration;
                player.music.playto(cutT);
                player.music.play();

                _this.progress.move(pre);

                let deg = _this.rotateImg.dataset.rotate || 0;

                _this.imgRotate(deg) // 旋转图片

                _this.controls[2].className = "playing";
            }

            // circle.lastM = function () {
            //     _this.loadMusic(_this.dataList[2])
            // }
        };

        // 下一首歌曲



    }
    const warp = document.querySelector("#warp");
    const musicPlayer = new MusicPlayer(warp)
    musicPlayer.init();

})(window.Zepto, window.player);