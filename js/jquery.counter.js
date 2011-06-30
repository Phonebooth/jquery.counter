(function($){
    $.fn.extend({ 
        counter: function(options) {
            var defaults = {
                type: "text",
                rate: 155, // minutes per second
                start_value: 4800000000, // minutes
                start_timestamp: 1306814400, // seconds since epoch
                start_date: undefined,
                css: {
                    "min-width": "200px",
                    "min-height": "64px",
                    "color": "#5F5F5F",
                    "font-size": "44px",
                    "font-weight": "bold",
                    "font-family": "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    "text-shadow": "0px 0px 5px #CBCBCB",
                    "text-align": "center",
                    "line-height": "64px",
                    "padding-bottom":"4px",
                    "position": "relative",
                },
                css_class: undefined,
                image_height: 30,
                show_comma: false
            };
            
            var options = $.extend(defaults, options);
            
            function addCommas(nStr) {
                nStr += '';
                x = nStr.split('.');
                x1 = x[0];
                x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
                return x1 + x2;
            }
            
            return this.each(function() {
                var o = options,
                    obj = $(this),
                    ts = Date.now || function() { return +new Date },
                    current_timestamp,
                    diff,
                    minutes_since_start,
                    current_minutes,
                    current_minutes_str,
                    html="";
                
                if (o.start_date && o.start_date.year && o.start_date.month && o.start_date.day) {
                    o.start_timestamp = Math.round(new Date(o.start_date.year+"-"+o.start_date.month+"-"+o.start_date.day).getTime()/1000);
                }
                current_timestamp = Math.round(ts() / 1000);
                diff = current_timestamp - o.start_timestamp;
                minutes_since_start = o.rate * diff;
                current_minutes = minutes_since_start + o.start_value;
                current_minutes_str = current_minutes + "";
                if (o.show_comma) {
                    current_minutes_str = addCommas(current_minutes_str);
                }
                
                if (o.type === 'text') {
                    html = "<span class='digits'>" + current_minutes_str + "</span>";
                    obj.html(html);
                    var el = obj.find('.digits');
                    if (o.css_class) {
                        // if a class was provided, use it
                        el.addClass(o.css_class);
                    } else {
                        // otherwise, use css object
                        el.css(o.css);
                    }
                } else if (o.type === 'image') {
                    html = "<div class='counter-wrap'><div class='counter-left'>&nbsp;</div>";
                    var numheight = o.image_height;
                    for (i=1;i<=current_minutes_str.length;i++) {
                        html = html + "<div class='counter-number counter-place-" + (i-1) + "'>&nbsp;</div>";
                        if (i !== current_minutes_str.length) {
                            html = html + "<div class='counter-spliter'>&nbsp;</div>";
                        }
                    }
                    html = html + "<div class='counter-right'>&nbsp;</div></div>";
                    obj.html(html);
                    var place = 0;
                    
                    obj.find(".counter-number").each(function() {
                        var $this = $(this);
                        var digit_string = current_minutes_str.charAt(place++);
                        if (!isNaN(digit_string)) {
                            var digit = Number(digit_string);
                            $this.data("digit", digit);
                            $this.data("digit_string", digit_string);
                            var numHeight = digit * numheight * -1;
                            $this.animate({top: numHeight+'px'}, 1500);
                        }
                        if (digit_string === ",") {
                            $this.animate({top: '-' + o.image_height * 10 + 'px'}, 1500);
                        }
                    });
                }
            });
        }
    });
})(jQuery);