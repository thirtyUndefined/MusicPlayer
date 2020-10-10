(function(root) {
    function renderImage(src) {
        root.blurImg(src);
        const img = document.querySelector(".songImg img");
        img.src = src;
    }
    function renderInfo(data) {
        const songInfoChild = document.querySelector(".songInfo").children; 
        songInfoChild[0].innerHTML = data.name;
        songInfoChild[1].innerHTML = data.singer;
        songInfoChild[2].innerHTML = data.album;
        
    }
    function renderIsLike(isLike) {
        const control = document.querySelectorAll(".control li");
        control[0].className = isLike ? "liking" : "";

    }
    
    root.render = function (data) {
        renderImage(data.image);
        renderInfo(data);
        renderIsLike(data.isLike);
    }
 })(window.player || (window.player = {}));