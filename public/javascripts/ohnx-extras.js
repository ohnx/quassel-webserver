(function() {
    /* clipboard copying tweaks */
    var modifyCopy = e => {
        var data = window.getSelection().toString();
        console.log(data);
        data = data.replace(/,?([0-9:]+)\t(.*)\t(.*)\n?/g, "[$1] <$2> $3\r\n");
        e.clipboardData.setData('text/plain', data);
        e.preventDefault();
    };

    document.addEventListener('copy', modifyCopy);
})();
