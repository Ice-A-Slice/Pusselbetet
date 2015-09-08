function parallax() {
	$('#things_container div[data-top]').each(function() {
		$this = $(this);
		$this.find('img').height();
		$this.css('top', $(window).height() / 2 - $this.find('img').height() / 2);
		if ($this.data('top'))
			$this.css('top', '+=' + (($(window).height() / 100) * parseInt($this.data('top'))) + 'px');
	});
	
	// Parallax lags on the older tablets... hard....
	/*$(window).bind('scroll', function() {
		var scroll = $(window).scrollLeft();
		var div_count = $('#things_container div').length;
		for (var i = div_count; i > 0; i--){
			$('#things_container div:eq(' + i + ')').css('left', scroll / (div_count - i + 3));
		}
	});*/

	// Stellar.js with iScroll.js
    /*(function(){
        var ua = navigator.userAgent,
        isMobileWebkit = /WebKit/.test(ua) && /Mobile/.test(ua);
        if (isMobileWebkit) {
            $('html').addClass('mobile');
        }
        $(function(){
            var iScrollInstance;
            if (isMobileWebkit) {
                var b = document.getElementsByTagName('body')[0];
                iScrollInstance = new iScroll(b);
                $('div').stellar({
                    scrollProperty: 'transform',
                    positionProperty: 'transform',
                    verticalScrolling: false,
                    horizontalOffset: 150
                });
            } else {
                $.stellar({
                    verticalScrolling: false,
                    horizontalOffset: 150
                });
            }
        });
    })();*/
	
}