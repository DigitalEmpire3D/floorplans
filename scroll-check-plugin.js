(function($) {
    $.fn.hasScrollBar = function() {
        //return this.get(0).scrollHeight > this.height();
        return this.get(0).scrollHeight > this.get(0).clientHeight;
    }
})(jQuery);