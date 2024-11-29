(function($) {
    
    // Helper function to determine if an element has the placeholder feature.
    function supportsPlaceholder() {
        return typeof (document.createElement('input')).placeholder !== 'undefined';
    }

    // Generate an indented list of links from a navigation structure.
    $.fn.navList = function() {
        return this.find('a').map(function() {
            const $this = $(this);
            const indent = Math.max(0, $this.parents('li').length - 1);
            const href = $this.attr('href');
            const target = $this.attr('target');
            return `
                <a class="link depth-${indent}" 
                   ${target ? `target="${target}"` : ''} 
                   ${href ? `href="${href}"` : ''}>
                    <span class="indent-${indent}"></span>
                    ${$this.text()}
                </a>`;
        }).get().join('');
    };

    // Panel functionality for showing/hiding elements.
    $.fn.panel = function(userConfig) {
        if (this.length === 0) return this;
        if (this.length > 1) return this.each(function() { $(this).panel(userConfig); });

        const $this = $(this);
        const $body = $('body');
        const $window = $(window);
        const id = $this.attr('id');
        const config = $.extend({
            delay: 0,
            hideOnClick: false,
            hideOnEscape: false,
            hideOnSwipe: false,
            resetScroll: false,
            resetForms: false,
            side: null,
            target: $this,
            visibleClass: 'visible'
        }, userConfig);

        // Ensure target is a jQuery object.
        config.target = $(config.target);

        // Method to hide the panel.
        $this._hide = function(event) {
            if (!config.target.hasClass(config.visibleClass)) return;

            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            config.target.removeClass(config.visibleClass);
            setTimeout(() => {
                if (config.resetScroll) $this.scrollTop(0);
                if (config.resetForms) $this.find('form').each(function() { this.reset(); });
            }, config.delay);
        };

        // Vendor fixes for overflow styles.
        $this.css({
            '-ms-overflow-style': '-ms-autohiding-scrollbar',
            '-webkit-overflow-scrolling': 'touch'
        });

        // Event bindings.
        if (config.hideOnClick) {
            $this.find('a').css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)')
                .on('click', function(event) {
                    const href = $(this).attr('href');
                    if (!href || href === '#' || href === `#${id}`) return;

                    event.preventDefault();
                    event.stopPropagation();
                    $this._hide();

                    setTimeout(() => {
                        if ($(this).attr('target') === '_blank') {
                            window.open(href);
                        } else {
                            window.location.href = href;
                        }
                    }, config.delay + 10);
                });
        }

        // Touch event handling for swipes.
        let touchPosX, touchPosY;

        $this.on('touchstart', function(event) {
            touchPosX = event.originalEvent.touches[0].pageX;
            touchPosY = event.originalEvent.touches[0].pageY;
        }).on('touchmove', function(event) {
            if (touchPosX === null || touchPosY === null) return;

            const diffX = touchPosX - event.originalEvent.touches[0].pageX;
            const diffY = touchPosY - event.originalEvent.touches[0].pageY;

            if (config.hideOnSwipe) {
                const boundary = 20;
                const delta = 50;
                let result = false;

                switch (config.side) {
                    case 'left':
                        result = (Math.abs(diffY) < boundary) && (diffX > delta);
                        break;
                    case 'right':
                        result = (Math.abs(diffY) < boundary) && (diffX < -delta);
                        break;
                    case 'top':
                        result = (Math.abs(diffX) < boundary) && (diffY > delta);
                        break;
                    case 'bottom':
                        result = (Math.abs(diffX) < boundary) && (diffY < -delta);
                        break;
                }

                if (result) {
                    touchPosX = null;
                    touchPosY = null;
                    $this._hide();
                    return false;
                }
            }

            // Prevent scrolling past bounds.
            const th = $this.outerHeight();
            const ts = ($this.get(0).scrollHeight - $this.scrollTop());
            if (($this.scrollTop() < 0 && diffY < 0) || (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {
                event.preventDefault();
                event.stopPropagation();
            }
        });

        // Prevent event bubbling inside the panel.
        $this.on('click touchend touchstart touchmove', function(event) {
            event.stopPropagation();
        });

        // Hide panel on anchor clicks targeting its ID.
        $this.on('click', `a[href="#${id}"]`, function(event) {
            event.preventDefault();
            event.stopPropagation();
            config.target.removeClass(config.visibleClass);
        });

        // Body click event to hide the panel.
        $body.on('click touchend', function(event) {
            $this._hide(event);
        });

        // Toggle panel on body link click.
        $body.on('click', `a[href="#${id}"]`, function(event) {
            event.preventDefault();
            event.stopPropagation();
            config.target.toggleClass(config.visibleClass);
        });

        // Hide on ESC key.
        if (config.hideOnEscape) {
            $window.on('keydown', function(event) {
                if (event.keyCode === 27) $this._hide(event);
            });
        }

        return $this;
    };

    // Placeholder polyfill for older browsers.
    $.fn.placeholder = function() {
        if (supportsPlaceholder()) return this;

        return this.each(function() {
            const $this = $(this);
            $this.find('input[type=text], textarea').each(function() {
                const $input = $(this);
                if ($input.val() === '' || $input.val() === $input.attr('placeholder')) {
                    $input.addClass('polyfill-placeholder').val($input.attr('placeholder'));
                }
            }).on('blur', function() {
                const $input = $(this);
                if ($input.val() === '') {
                    $input.addClass('polyfill-placeholder').val($input.attr('placeholder'));
                }
            }).on('focus', function() {
                const $input = $(this);
                if ($input.val() === $input.attr('placeholder')) {
                    $input.removeClass('polyfill-placeholder').val('');
                }
            });

            $this.find('input[type=password]').each(function() {
                const $input = $(this);
                const $placeholder = $('<input>', {
                    type: 'text',
                    class: 'polyfill-placeholder',
                    placeholder: $input.attr('placeholder'),
                    id: `${$input.attr('id')}-polyfill-field`,
                    name: `${$input.attr('name')}-polyfill-field`
                }).insertAfter($input);
                
                $input.toggle($input.val() !== '');
                $placeholder.toggle($input.val() === '');

                $input.on('blur', function() {
                    if ($input.val() === '') {
                        $input.hide();
                        $placeholder.show();
                    }
                });

                $placeholder.on('focus', function() {
                    $placeholder.hide();
                    $input.show().focus();
                }).on('keypress', function() {
                    $placeholder.val('');
                });
            });

            $this.on('submit', function() {
                $this.find('input[type=text], input[type=password], textarea').each(function() {
                    const $input = $(this);
                    if ($input.val() === $input.attr('placeholder')) {
                        $input.removeClass('polyfill-placeholder').val('');
                    }
                });
            }).on('reset', function(event) {
                event.preventDefault();
                $this.find('select').val($('option:first').val());
                $this.find('input, textarea').each(function() {
                    const $input = $(this);
                    $input.removeClass('polyfill-placeholder');
                    if ($input.attr('type') === 'password') {
                        $input.val($input.attr('defaultValue'));
                        const $placeholder = $input.parent().find(`input[name="${$input.attr('name')}-polyfill-field"]`);
                        $input.val() === '' ? ($input.hide(), $placeholder.show()) : ($input.show(), $placeholder.hide());
                    } else {
                        $input.val($input.attr('defaultValue'));
                        if ($input.val() === '') {
                            $input.addClass('polyfill-placeholder').val($input.attr('placeholder'));
                        }
                    }
                });
            });
        });
    };

    // Move elements to/from the first positions of their respective parents.
    $.prioritize = function($elements, condition) {
        if (typeof $elements !== 'jQuery') $elements = $($elements);
        const key = '__prioritize';

        $elements.each(function() {
            const $element = $(this);
            const $parent = $element.parent();

            if ($parent.length === 0) return;

            if (!$element.data(key)) {
                if (!condition) return;
                const $placeholder = $element.prev();
                if ($placeholder.length === 0) return;
                $element.prependTo($parent);
                $element.data(key, $placeholder);
            } else {
                if (condition) return;
                const $placeholder = $element.data(key);
                $element.insertAfter($placeholder);
                $element.removeData(key);
            }
        });
    };

})(jQuery);
