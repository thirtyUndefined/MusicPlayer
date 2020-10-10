(function (root) {
    function listControl(data, warp) {
        let list = document.createElement('div'),
            dl = document.createElement("dl"),
            dt = document.createElement("dt"),
            close = document.createElement("div"),
            musicList = []; // 存储所有歌曲对应的dom

        list.className = "list";
        dt.innerHTML = "播放列表";
        close.className = "close";
        close.innerHTML = "关闭";

        dl.appendChild(dt);
        data.forEach(function(items, index) {
            let dd = document.createElement("dd");
            dd.innerHTML = items.name;

            dd.addEventListener('touchend', function () {
                changeActive(index);
            })

            dl.appendChild(dd);
            musicList.push(dd);
        })


        list.appendChild(dl);
        list.appendChild(close);
        warp.appendChild(list);

        // 隐藏列表
        let disY = list.offsetHeight;
        list.style.transform = `translateY(${disY}px)`;

        // 列表滑动显示
        function listUp() {
            list.style.transition = '.2s';
            list.style.transform = `translateY(0)`;
        }

        function listDown() {
            list.style.transition = '.2s';
            list.style.transform = `translateY(${disY}px)`;
        }

        // 列表影藏
        close.addEventListener("touchend", function () {
            listDown();
        })

        // 列表歌曲状态切换
        function changeActive(index) {
            for (let i = 0; i < musicList.length; i++) {
                musicList[i].className = "";
            }
            musicList[index].className = "active";
        }
        // 默认选中
        changeActive(0);

        return {
            musicList: musicList,
            listUp: listUp,
            listDown: listDown,
            changeActive : changeActive
        }
    };


    // 暴露listControl
    root.listControl = listControl;
})(window.player || (window.player = {}));