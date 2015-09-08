jQuery.fn.center = function (pos, extra_left) {
	// If extra_left is undefined (not set), the variable eL is 0, otherwise
	// eL gets the value of extra_left.
	var eL = (typeof extra_left === 'undefined') ? 0 : extra_left;
    var position = (pos * $(window).width() + (eL * (pos - 1)));
    this.css("position","absolute");
    this.css("left", (position - ($(window).width() / 2) - $(this).find('.letter_frame').width() / 2) + "px");
    return this;
}
jQuery.addJS = function (filename) {
	var fileref=document.createElement('script')
	fileref.setAttribute("type","text/javascript")
	fileref.setAttribute("src", filename)
	document.getElementsByTagName("head")[0].appendChild(fileref)
}
jQuery.fn.tclick = function (onclick, onup) {
    this.bind("touchstart", function (e) { onclick.call(this, e); e.stopPropagation(); e.preventDefault(); });
    this.bind("mousedown", function (e) { onclick.call(this, e); });
    this.bind("touchend", function (e) { onup.call(this, e); e.stopPropagation(); e.preventDefault(); });
    this.bind("mouseup", function (e) { onup.call(this, e); });
    return this;
}