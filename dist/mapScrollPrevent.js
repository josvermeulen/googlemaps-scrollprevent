/*!
 * mapScrollPrevent (jQuery Google Maps Scroll Prevent Plugin)
 * Version 0.5.4
 * URL: https://github.com/diazemiliano/mapScrollPrevent
 * Description: mapScrollPrevent is an easy solution to the problem of page
 *              scrolling with Google Maps.
 * Author: Emiliano Díaz https://github.com/diazemiliano/
 * Copyright: The MIT License (MIT) Copyright (c) 2015 Emiliano Díaz.
 */
(function($) {
    return $.fn.extend({
        mapScrollPrevent: function(options) {
            var applyCss, coverObject, defaults, hideOverlay, iframeObject, mapCSS, opts, overlayObject, showOverlay, start, stop, wrapIframe, wrapObject;
            defaults = {

                /* Custom class for map wrap */
                wrapClass: "map-wrap",

                /* Custom class for hover div */
                overlayClass: "map-overlay",

                /* Hover Message */
                overlayMessage: "Clic para Navegar.",

                /* Present on touchscreen devices */
                inTouch: true,

                /* Removes mapScroll */
                stop: false
            };
            opts = $.extend(true, defaults, options);
            mapCSS = "/* --- mapScrollPrevent.js CSS Classes --- */ ." + opts.overlayClass + " { position: absolute; overflow:hidden; cursor: pointer; text-align: center; background-color: rgba(255, 255, 255, 0); } ." + opts.overlayClass + ", ." + opts.overlayClass + " p { -moz-transition: all .3s ease-in-out; -o-transition: all .3s ease-in-out; -webkit-transition: all .3s ease-in-out; transition: all .3s ease-in-out; } ." + opts.overlayClass + ":hover { background-color: rgba(255, 255, 255, 0.8); } ." + opts.overlayClass + " p { font-family: Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; padding-top: 2.5%; padding-bottom: 2.5%; margin-right: auto; margin-left: auto; width: 70%; position: relative; top: 50%; transform: translateY(-50%); border-color: rgba(0, 0, 0, 0.3); color: rgba(58, 132, 223, 0); background-color: rgba(0, 0, 0, 0); -moz-border-radius-topleft: 2px; -webkit-border-top-left-radius: 2px; border-top-left-radius: 2px; -moz-border-radius-topright: 2px; -webkit-border-top-right-radius: 2px; border-top-right-radius: 2px; } ." + opts.overlayClass + ":hover p { background-color: rgb(255, 255, 255); color: rgb(58, 132, 223); -moz-box-shadow: rgba(0,0,0,0.3) 0px 1px 4px -1px; -webkit-box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px; box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px; } ." + opts.wrapClass + " { display: inline-block; } ." + opts.wrapClass + " iframe { position: relative; top: 0; left: 0; }";

            /* iframe Map Object */
            iframeObject = $(this);

            /* Creates overlay object */
            overlayObject = $("<div class=\"" + opts.overlayClass + "\"> <p>" + opts.overlayMessage + "</p></div>");
            wrapObject = $("<div class=\"" + opts.wrapClass + "\"></div>");

            /* Early exit */
            if (!iframeObject.length) {
                return;
            }

            /* Wraps the iframe */
            wrapIframe = function() {

                /* Check first if the iframe is already wraped */
                if (!iframeObject.closest("." + opts.wrapClass).is("div")) {
                    iframeObject.wrap(wrapObject);
                }

                /* Update variable objects with DOM objects */
                wrapObject = iframeObject.closest("." + opts.wrapClass).append(overlayObject);
                overlayObject = wrapObject.children("." + opts.overlayClass);
                return coverObject();
            };

            /* Apply all the css */
            applyCss = function() {
                return $("head").append("<style rel=\"stylesheet\" type=\"text/css\"> " + mapCSS + "</style>");
            };
            coverObject = function() {
                return overlayObject.height(iframeObject.height()).width(iframeObject.width()).css({
                    "top": iframeObject.position().top,
                    "left": iframeObject.position().left
                });
            };

            /* Overlay functions */
            hideOverlay = function() {
                coverObject();
                iframeObject.css({
                    "pointer-events": "auto"
                });
                return overlayObject.hide();
            };
            showOverlay = function() {
                coverObject();
                iframeObject.css({
                    "pointer-events": "none"
                });
                return overlayObject.show();
            };

            /* Init wrap and bind events */
            start = function() {
                applyCss();
                wrapIframe();

                /* Dynamic Adjust */
                $(window).on("resize", coverObject);
                iframeObject.on("resize", coverObject);

                /* Mouse Events */
                overlayObject.bind("click", hideOverlay);
                return wrapObject.bind("mouseleave", hideOverlay).bind("mouseenter", showOverlay);
            };

            /* Removes everithing */
            stop = function() {
                iframeObject.removeAttr("style");
                if (iframeObject.parent().is("." + opts.wrapClass)) {
                    iframeObject.unwrap();
                }
                return $("." + opts.overlayClass).remove();
            };
            if (!opts.stop) {
                return start();
            } else {
                return stop();
            }
        }
    });
})(jQuery);