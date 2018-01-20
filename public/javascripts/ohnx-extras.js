const IMGUR_API_ID = 'de157a25135a98a';
(function() {
    /* clipboard copying tweaks */
    var modifyCopy = function(e) {
        /* text copying */
        var data = window.getSelection().toString();
        console.log(data);
        data = data.replace(/,?([0-9:]+)\t(.*)\t(.*)\n?/g, "[$1] <$2> $3\r\n");
        e.clipboardData.setData('text/plain', data);
        e.preventDefault();
    };

    var mkstr = function(len = 5) {
          var r = "";
          var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

          for (var i = 0; i < len; i++)
                r += p.charAt(Math.floor(Math.random() * p.length));

          return r;
    }

    var up2imgur = function(img, id) {
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        fd.append('image', img);
        xhr.open("POST", 'https://api.imgur.com/3/image');
        xhr.addEventListener('load', function() {
            var resp = JSON.parse(xhr.responseText);
            if (resp.status == 200) {
                var url = resp.data.link;
                console.log("Uploaded image to " + url);
                console.log("Delete link: " + resp.data.deletehash);
                var str = document.getElementById('messagebox').innerHTML;
                str = str.replace("(uploading-"+id+")", url);
                document.getElementById('messagebox').innerHTML = str;
            } else {
                console.log("Failed to upload image: ");
                console.log(xhr.responseText);
                var str = document.getElementById('messagebox').innerHTML;
                str.replace("(uploading-"+id+")", "(upload failed, please check console for details)");
                document.getElementById('messagebox').innerHTML = str;
            }
        });
        xhr.setRequestHeader('Authorization', 'Client-ID ' + IMGUR_API_ID);
        xhr.send(fd);
    };

    var checkImages = function(e) {
        var items = (e.clipboardData || e.originalEvent.clipboardData).items;
        /* debug */
        console.log(items);
        /* find the image in the clipboard */
        var img = null;
        for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') == 0) {
                img = items[i].getAsFile();
                /* only do 1st image */
                break;
            }
        }
        /* upload if image was found */
        if (img !== null) {
            var id = mkstr();
            e.preventDefault();
            document.getElementById('messagebox').innerHTML += " (uploading-"+id+") ";
            up2imgur(img, id);
        }
    };
    document.addEventListener('copy', modifyCopy);
    document.getElementById('messagebox').addEventListener('paste', checkImages);
})();
