(function($) {
    const $window = $(window);
    const $body = $('body');
    const $menu = $('#menu');

    // Breakpoints configuration.
    const breakpointsConfig = {
        default: ['1681px', null],
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px'],
        xxsmall: [null, '360px'],
    };
    
    breakpoints(breakpointsConfig);

    // Play initial animations on page load.
    $window.on('load', () => {
        setTimeout(() => {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Menu setup.
    $menu.append('<a href="#menu" class="close"></a>')
         .appendTo($body)
         .panel({
             target: $body,
             visibleClass: 'is-menu-visible',
             delay: 500,
             hideOnClick: true,
             hideOnSwipe: true,
             resetScroll: true,
             resetForms: true,
             side: 'right'
         });

})(jQuery);
