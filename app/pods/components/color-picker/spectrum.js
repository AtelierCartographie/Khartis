import tinycolor from './tinycolor';

var defaultOpts = {

    // Callbacks
    beforeShow: noop,
    move: noop,
    change: noop,
    show: noop,
    hide: noop,

    // Options
    color: false,
    flat: false,
    showInput: false,
    allowEmpty: false,
    showButtons: true,
    clickoutFiresChange: true,
    showInitial: false,
    showPalette: false,
    showPaletteOnly: false,
    hideAfterPaletteSelect: false,
    togglePaletteOnly: false,
    showSelectionPalette: true,
    localStorageKey: false,
    appendTo: "body",
    maxSelectionSize: 7,
    togglePaletteMoreText: "more",
    togglePaletteLessText: "less",
    clearText: "Clear Color Selection",
    noColorSelectedText: "No Color Selected",
    preferredFormat: false,
    className: "", // Deprecated - use containerClassName and replacerClassName instead.
    containerClassName: "",
    replacerClassName: "",
    showAlpha: false,
    theme: "sp-light",
    palette: [["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]],
    selectionPalette: [],
    disabled: false,
    offset: null,
    replacerIcon: "&#9660;",
    borderPreview: false,
    backgroundPreview: true
},
spectrums = [],
IE = !!/msie/i.exec( window.navigator.userAgent );


function paletteTemplate (p, color, className, opts) {
    var html = [];
    for (var i = 0; i < p.length; i++) {
        var current = p[i];
        if(current) {
            var tiny = tinycolor(current);
            var c = tiny.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
            c += (tinycolor.equals(color, current)) ? " sp-thumb-active" : "";
            var formattedString = tiny.toString(opts.preferredFormat || "rgb");
            var swatchStyle = "background-color:" + tiny.toRgbString();
            html.push('<span title="' + formattedString + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';" /><i class="iconfont iconfont-check"></i></span>');
        } else {
            var cls = 'sp-clear-display';
            html.push($('<div />')
                .append($('<span data-color="" style="background-color:transparent;" class="' + cls + '"></span>')
                    .attr('title', opts.noColorSelectedText)
                )
                .html()
            );
        }
    }
    return "<div class='sp-cf " + className + "'>" + html.join('') + "</div>";
}

function hideAll() {
    for (var i = 0; i < spectrums.length; i++) {
        if (spectrums[i]) {
            spectrums[i].hide();
        }
    }
}

function instanceOptions(o, callbackContext) {
    var opts = $.extend({}, defaultOpts, o);
    opts.callbacks = {
        'move': bind(opts.move, callbackContext),
        'change': bind(opts.change, callbackContext),
        'show': bind(opts.show, callbackContext),
        'hide': bind(opts.hide, callbackContext),
        'beforeShow': bind(opts.beforeShow, callbackContext)
    };

    return opts;
}

function spectrum(element, o) {

    var opts = instanceOptions(o, element),
        container = $(opts.container),
        flat = opts.flat,
        showSelectionPalette = opts.showSelectionPalette,
        localStorageKey = opts.localStorageKey,
        theme = opts.theme,
        callbacks = opts.callbacks,
        resize = throttle(reflow, 10),
        visible = false,
        isDragging = false,
        dragWidth = 0,
        dragHeight = 0,
        dragHelperHeight = 0,
        slideHeight = 0,
        slideWidth = 0,
        alphaWidth = 0,
        alphaSlideHelperWidth = 0,
        slideHelperHeight = 0,
        currentHue = 0,
        currentSaturation = 0,
        currentValue = 0,
        currentAlpha = 1,
        palette = [],
        paletteArray = [],
        paletteLookup = {},
        selectionPalette = opts.selectionPalette.slice(0),
        maxSelectionSize = opts.maxSelectionSize,
        draggingClass = "sp-dragging",
        shiftMovementDirection = null;

    var doc = element.ownerDocument,
        body = doc.body,
        boundElement = $(element),
        disabled = false,
        pickerContainer = container.find(".sp-picker-container"),
        dragger = container.find(".sp-color"),
        dragHelper = container.find(".sp-dragger"),
        slider = container.find(".sp-hue"),
        slideHelper = container.find(".sp-slider"),
        alphaSliderInner = container.find(".sp-alpha-inner"),
        alphaSlider = container.find(".sp-alpha"),
        alphaSlideHelper = container.find(".sp-alpha-handle"),
        textInput = container.find(".sp-input"),
        paletteContainer = container.find(".sp-palette"),
        initialColorContainer = container.find(".sp-initial"),
        cancelButton = container.find(".sp-cancel"),
        clearButton = container.find(".sp-clear"),
        chooseButton = container.find(".sp-choose"),
        toggleButton = container.find(".sp-palette-toggle"),
        isInput = boundElement.is("input"),
        offsetElement = boundElement,
        previewElement = boundElement.find(".sp-preview-inner"),
        initialColor = opts.color || (isInput && boundElement.val()),
        colorOnShow = false,
        currentPreferredFormat = opts.preferredFormat,
        clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange,
        isEmpty = !initialColor,
        allowEmpty = false;

    function applyOptions() {

        if (opts.showPaletteOnly) {
            opts.showPalette = true;
        }

        toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);

        if (opts.palette) {
            palette = opts.palette.slice(0);
            paletteArray = $.isArray(palette[0]) ? palette : [palette];
            paletteLookup = {};
            for (var i = 0; i < paletteArray.length; i++) {
                for (var j = 0; j < paletteArray[i].length; j++) {
                    var rgb = tinycolor(paletteArray[i][j]).toRgbString();
                    paletteLookup[rgb] = true;
                }
            }
        }

        container.addClass(theme);
        container.toggleClass("sp-flat", flat);
        container.toggleClass("sp-input-disabled", !opts.showInput);
        container.toggleClass("sp-alpha-enabled", opts.showAlpha);
        container.toggleClass("sp-clear-enabled", allowEmpty);
        container.toggleClass("sp-buttons-disabled", !opts.showButtons);
        container.toggleClass("sp-palette-buttons-disabled", !opts.togglePaletteOnly);
        container.toggleClass("sp-palette-disabled", !opts.showPalette);
        container.toggleClass("sp-palette-only", opts.showPaletteOnly);
        container.toggleClass("sp-initial-disabled", !opts.showInitial);
        container.addClass(opts.className).addClass(opts.containerClassName);

        reflow();
    }

    function initialize() {

        if (IE) {
            container.find("*:not(input)").attr("unselectable", "on");
        }

        applyOptions();

        if (!allowEmpty) {
            clearButton.hide();
        }

        if (flat) {
            boundElement.after(container).hide();
        }
        else {

            var appendTo = opts.appendTo === "parent" ? boundElement.parent() : $(opts.appendTo);
            if (appendTo.length !== 1) {
                appendTo = $("body");
            }

            appendTo.append(container);
        }

        updateSelectionPaletteFromStorage();

        offsetElement.on("click.spectrum touchstart.spectrum", function (e) {
            if (!disabled) {
                toggle();
            }

            e.stopPropagation();

            if (!$(e.target).is("input")) {
                e.preventDefault();
            }
        });

        if(boundElement.is(":disabled") || (opts.disabled === true)) {
            disable();
        }

        // Prevent clicks from bubbling up to document.  This would cause it to be hidden.
        container.click(stopPropagation);

        // Handle user typed input
        textInput.change(setFromTextInput);
        textInput.on("paste", function () {
            setTimeout(setFromTextInput, 1);
        });
        textInput.keydown(function (e) { if (e.keyCode == 13) { setFromTextInput(); } });

        cancelButton.on("click.spectrum", function (e) {
            e.stopPropagation();
            e.preventDefault();
            revert();
            hide();
        });

        clearButton.attr("title", opts.clearText);
        clearButton.on("click.spectrum", function (e) {
            e.stopPropagation();
            e.preventDefault();
            isEmpty = true;
            move();

            if(flat) {
                //for the flat style, this is a change event
                updateOriginalInput(true);
            }
        });

        chooseButton.on("click.spectrum", function (e) {
            e.stopPropagation();
            e.preventDefault();

            if (IE && textInput.is(":focus")) {
                textInput.trigger('change');
            }

            if (isValid()) {
                updateOriginalInput(true);
                hide();
            }
        });

        toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);
        toggleButton.on("click.spectrum", function (e) {
            e.stopPropagation();
            e.preventDefault();

            opts.showPaletteOnly = !opts.showPaletteOnly;

            // To make sure the Picker area is drawn on the right, next to the
            // Palette area (and not below the palette), first move the Palette
            // to the left to make space for the picker, plus 5px extra.
            // The 'applyOptions' function puts the whole container back into place
            // and takes care of the button-text and the sp-palette-only CSS class.
            if (!opts.showPaletteOnly && !flat) {
                container.css('left', '-=' + (pickerContainer.outerWidth(true) + 5));
            }
            applyOptions();
        });

        draggable(alphaSlider, function (dragX, dragY, e) {
            currentAlpha = (dragX / alphaWidth);
            isEmpty = false;
            if (e.shiftKey) {
                currentAlpha = Math.round(currentAlpha * 10) / 10;
            }

            move();
        }, dragStart, dragStop);

        draggable(slider, function (dragX, dragY) {
            currentHue = parseFloat(dragY / slideHeight);
            isEmpty = false;
            if (!opts.showAlpha) {
                currentAlpha = 1;
            }
            move();
        }, dragStart, dragStop);

        draggable(dragger, function (dragX, dragY, e) {

            // shift+drag should snap the movement to either the x or y axis.
            if (!e.shiftKey) {
                shiftMovementDirection = null;
            }
            else if (!shiftMovementDirection) {
                var oldDragX = currentSaturation * dragWidth;
                var oldDragY = dragHeight - (currentValue * dragHeight);
                var furtherFromX = Math.abs(dragX - oldDragX) > Math.abs(dragY - oldDragY);

                shiftMovementDirection = furtherFromX ? "x" : "y";
            }

            var setSaturation = !shiftMovementDirection || shiftMovementDirection === "x";
            var setValue = !shiftMovementDirection || shiftMovementDirection === "y";

            if (setSaturation) {
                currentSaturation = parseFloat(dragX / dragWidth);
            }
            if (setValue) {
                currentValue = parseFloat((dragHeight - dragY) / dragHeight);
            }

            isEmpty = false;
            if (!opts.showAlpha) {
                currentAlpha = 1;
            }

            move();

        }, dragStart, dragStop);

        if (!!initialColor) {
            set(initialColor);

            // In case color was black - update the preview UI and set the format
            // since the set function will not run (default color is black).
            updateUI();
            currentPreferredFormat = opts.preferredFormat || tinycolor(initialColor).format;

            addColorToSelectionPalette(initialColor);
        }
        else {
            updateUI();
        }

        if (flat) {
            show();
        }

        function paletteElementClick(e) {
            if (e.data && e.data.ignore) {
                set($(e.target).closest(".sp-thumb-el").data("color"));
                move();
            }
            else {
                set($(e.target).closest(".sp-thumb-el").data("color"));
                move();

                // If the picker is going to close immediately, a palette selection
                // is a change.  Otherwise, it's a move only.
                if (opts.hideAfterPaletteSelect) {
                    updateOriginalInput(true);
                    hide();
                } else {
                    updateOriginalInput();
                }
            }

            return false;
        }

        var paletteEvent = IE ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
        paletteContainer.on(paletteEvent, ".sp-thumb-el", paletteElementClick);
        initialColorContainer.on(paletteEvent, ".sp-thumb-el:nth-child(1)", { ignore: true }, paletteElementClick);
    }

    function updateSelectionPaletteFromStorage() {

        if (localStorageKey && window.localStorage) {

            // Migrate old palettes over to new format.  May want to remove this eventually.
            try {
                var oldPalette = window.localStorage[localStorageKey].split(",#");
                if (oldPalette.length > 1) {
                    delete window.localStorage[localStorageKey];
                    $.each(oldPalette, function(i, c) {
                          addColorToSelectionPalette(c);
                    });
                }
            }
            catch(e) { }

            try {
                selectionPalette = window.localStorage[localStorageKey].split(";");
            }
            catch (e) { }
        }
    }

    function addColorToSelectionPalette(color) {
        if (showSelectionPalette) {
            var rgb = tinycolor(color).toRgbString();
            if (!paletteLookup[rgb] && $.inArray(rgb, selectionPalette) === -1) {
                selectionPalette.push(rgb);
                while(selectionPalette.length > maxSelectionSize) {
                    selectionPalette.shift();
                }
            }

            if (localStorageKey && window.localStorage) {
                try {
                    window.localStorage[localStorageKey] = selectionPalette.join(";");
                }
                catch(e) { }
            }
        }
    }

    function getUniqueSelectionPalette() {
        var unique = [];
        if (opts.showPalette) {
            for (var i = 0; i < selectionPalette.length; i++) {
                var rgb = tinycolor(selectionPalette[i]).toRgbString();

                if (!paletteLookup[rgb]) {
                    unique.push(selectionPalette[i]);
                }
            }
        }

        return unique.reverse().slice(0, opts.maxSelectionSize);
    }

    function drawPalette() {

        var currentColor = get();

        var html = $.map(paletteArray, function (palette, i) {
            return paletteTemplate(palette, currentColor, "sp-palette-row sp-palette-row-" + i, opts);
        });

        updateSelectionPaletteFromStorage();

        if (selectionPalette) {
            html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "sp-palette-row sp-palette-row-selection", opts));
        }

        paletteContainer.html(html.join(""));
    }

    function drawInitial() {
        if (opts.showInitial) {
            var initial = colorOnShow;
            var current = get();
            initialColorContainer.html(paletteTemplate([initial, current], current, "sp-palette-row-initial", opts));
        }
    }

    function dragStart() {
        if (dragHeight <= 0 || dragWidth <= 0 || slideHeight <= 0) {
            reflow();
        }
        isDragging = true;
        container.addClass(draggingClass);
        shiftMovementDirection = null;
        boundElement.trigger('dragstart.spectrum', [ get() ]);
    }

    function dragStop() {
        isDragging = false;
        container.removeClass(draggingClass);
        boundElement.trigger('dragstop.spectrum', [ get() ]);
    }

    function setFromTextInput() {

        var value = textInput.val();

        if ((value === null || value === "") && allowEmpty) {
            set(null);
            move();
            updateOriginalInput();
        }
        else {
            var tiny = tinycolor(value);
            if (tiny.isValid()) {
                set(tiny);
                move();
                updateOriginalInput();
            }
            else {
                textInput.addClass("sp-validation-error");
            }
        }
    }

    function toggle() {
        if (visible) {
            hide();
        }
        else {
            show();
        }
    }

    function show() {
        var event = $.Event('beforeShow.spectrum');

        if (visible) {
            reflow();
            return;
        }

        boundElement.trigger(event, [ get() ]);

        if (callbacks.beforeShow(get()) === false || event.isDefaultPrevented()) {
            return;
        }

        hideAll();
        visible = true;

        $(doc).on("keydown.spectrum", onkeydown);
        $(doc).on("click.spectrum", clickout);
        $(window).on("resize.spectrum", resize);
        boundElement.addClass("sp-active");
        container.removeClass("sp-hidden");

        reflow();
        updateUI();

        colorOnShow = get();

        drawInitial();
        callbacks.show(colorOnShow);
        boundElement.trigger('show.spectrum', [ colorOnShow ]);
    }

    function onkeydown(e) {
        // Close on ESC
        if (e.keyCode === 27) {
            hide();
        }
    }

    function clickout(e) {
        // Return on right click.
        if (e.button == 2) { return; }

        // If a drag event was happening during the mouseup, don't hide
        // on click.
        if (isDragging) { return; }

        if (clickoutFiresChange) {
            updateOriginalInput(true);
        }
        else {
            revert();
        }
        hide();
    }

    function hide() {
        // Return if hiding is unnecessary
        if (!visible || flat) { return; }
        visible = false;

        $(doc).off("keydown.spectrum", onkeydown);
        $(doc).off("click.spectrum", clickout);
        $(window).off("resize.spectrum", resize);

        boundElement.removeClass("sp-active");
        container.addClass("sp-hidden");

        callbacks.hide(get());
        boundElement.trigger('hide.spectrum', [ get() ]);
    }

    function revert() {
        set(colorOnShow, true);
        triggerValueChange();
    }

    function set(color, ignoreFormatChange) {
        if (tinycolor.equals(color, get())) {
            // Update UI just in case a validation error needs
            // to be cleared.
            updateUI();
            return;
        }

        var newColor, newHsv;
        if (!color && allowEmpty) {
            isEmpty = true;
        } else {
            isEmpty = false;
            newColor = tinycolor(color);
            newHsv = newColor.toHsv();

            currentHue = (newHsv.h % 360) / 360;
            currentSaturation = newHsv.s;
            currentValue = newHsv.v;
            currentAlpha = newHsv.a;
        }
        updateUI();

        if (newColor && newColor.isValid() && !ignoreFormatChange) {
            currentPreferredFormat = opts.preferredFormat || newColor.getFormat();
        }
    }

    function get(opts) {
        opts = opts || { };

        if (allowEmpty && isEmpty) {
            return null;
        }

        return tinycolor.fromRatio({
            h: currentHue,
            s: currentSaturation,
            v: currentValue,
            a: Math.round(currentAlpha * 1000) / 1000
        }, { format: opts.format || currentPreferredFormat });
    }

    function isValid() {
        return !textInput.hasClass("sp-validation-error");
    }

    function move() {
        updateUI();

        callbacks.move(get());
        boundElement.trigger('move.spectrum', [ get() ]);
    }

    function updateUI() {

        textInput.removeClass("sp-validation-error");

        updateHelperLocations();

        // Update dragger background color (gradients take care of saturation and value).
        var flatColor = tinycolor.fromRatio({ h: currentHue, s: 1, v: 1 });
        dragger.css("background-color", flatColor.toHexString());

        // Get a format that alpha will be included in (hex and names ignore alpha)
        var format = currentPreferredFormat;
        if (currentAlpha < 1 && !(currentAlpha === 0 && format === "name")) {
            if (format === "hex" || format === "hex3" || format === "hex6" || format === "name") {
                format = "rgb";
            }
        }

        var realColor = get({ format: format }),
            displayColor = '';

          //reset background info for preview element
        previewElement.removeClass("sp-clear-display");
        previewElement.css({
            'background-color': 'transparent',
            'border-color': 'transparent'
        });

        if (!realColor && allowEmpty) {
            // Update the replaced elements background with icon indicating no color selection
            previewElement.addClass("sp-clear-display");
        }
        else {
            var realHex = realColor.toHexString(),
                realRgb = realColor.toRgbString();

            // Update the replaced elements background color (with actual selected color)
            previewElement.css({
                'background-color': opts.backgroundPreview ? realRgb : "transparent",
                'border-color': opts.borderPreview ? realRgb : "transparent"
            });

            if (opts.showAlpha) {
                var rgb = realColor.toRgb();
                rgb.a = 0;
                var realAlpha = tinycolor(rgb).toRgbString();
                var gradient = "linear-gradient(left, " + realAlpha + ", " + realHex + ")";

                if (IE) {
                    alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
                }
                else {
                    alphaSliderInner.css("background", "-webkit-" + gradient);
                    alphaSliderInner.css("background", "-moz-" + gradient);
                    alphaSliderInner.css("background", "-ms-" + gradient);
                    // Use current syntax gradient on unprefixed property.
                    alphaSliderInner.css("background",
                        "linear-gradient(to right, " + realAlpha + ", " + realHex + ")");
                }
            }

            displayColor = realColor.toString(format);
        }

        // Update the text entry input as it changes happen
        if (opts.showInput) {
            textInput.val(displayColor);
        }

        if (opts.showPalette) {
            drawPalette();
        }

        drawInitial();
    }

    function updateHelperLocations() {
        var s = currentSaturation;
        var v = currentValue;

        if(allowEmpty && isEmpty) {
            //if selected color is empty, hide the helpers
            alphaSlideHelper.hide();
            slideHelper.hide();
            dragHelper.hide();
        }
        else {
            //make sure helpers are visible
            alphaSlideHelper.show();
            slideHelper.show();
            dragHelper.show();

            // Where to show the little circle in that displays your current selected color
            var dragX = s * dragWidth;
            var dragY = dragHeight - (v * dragHeight);
            dragX = Math.max(
                -dragHelperHeight,
                Math.min(dragWidth - dragHelperHeight, dragX - dragHelperHeight)
            );
            dragY = Math.max(
                -dragHelperHeight,
                Math.min(dragHeight - dragHelperHeight, dragY - dragHelperHeight)
            );
            dragHelper.css({
                "top": dragY + "px",
                "left": dragX + "px"
            });

            var alphaX = currentAlpha * alphaWidth;
            alphaSlideHelper.css({
                "left": (alphaX - (alphaSlideHelperWidth / 2)) + "px"
            });

            // Where to show the bar that displays your current selected hue
            var slideY = (currentHue) * slideHeight;
            slideHelper.css({
                "top": (slideY - slideHelperHeight) + "px"
            });
        }
    }

    function triggerValueChange() {
      var color = get();
      callbacks.change(color);
    }

    function updateOriginalInput(fireCallback) {
        var color = get(),
            displayColor = '',
            hasChanged = !tinycolor.equals(color, colorOnShow);

        if (color) {
            displayColor = color.toString(currentPreferredFormat);
            // Update the selection palette with the current color
            addColorToSelectionPalette(color);
        }

        if (isInput) {
            boundElement.val(displayColor);
        }

        if (fireCallback && hasChanged) {
            callbacks.change(color);
            boundElement.trigger('change', [ color ]);
        }
    }

    function reflow() {
        if (!visible) {
            return; // Calculations would be useless and wouldn't be reliable anyways
        }
        dragWidth = dragger.width();
        dragHeight = dragger.height();
        dragHelperHeight = dragHelper.height();
        slideWidth = slider.width();
        slideHeight = slider.height();
        slideHelperHeight = slideHelper.height();
        alphaWidth = alphaSlider.width();
        alphaSlideHelperWidth = alphaSlideHelper.width();

        if (!flat) {
            container.css("position", "absolute");
            if (opts.offset) {
                container.offset(opts.offset);
            } else {
                container.offset(getOffset(container, offsetElement));
            }
        }

        updateHelperLocations();

        if (opts.showPalette) {
            drawPalette();
        }

        boundElement.trigger('reflow.spectrum');
    }

    function destroy() {
        boundElement.show();
        offsetElement.off("click.spectrum touchstart.spectrum");
        container.remove();
        replacer.remove();
        spectrums[spect.id] = null;
    }

    function option(optionName, optionValue) {
        if (optionName === undefined) {
            return $.extend({}, opts);
        }
        if (optionValue === undefined) {
            return opts[optionName];
        }

        opts[optionName] = optionValue;

        if (optionName === "preferredFormat") {
            currentPreferredFormat = opts.preferredFormat;
        }
        applyOptions();
    }

    function enable() {
        disabled = false;
        boundElement.attr("disabled", false);
        offsetElement.removeClass("sp-disabled");
    }

    function disable() {
        hide();
        disabled = true;
        boundElement.attr("disabled", true);
        offsetElement.addClass("sp-disabled");
    }

    function setOffset(coord) {
        opts.offset = coord;
        reflow();
    }

    initialize();

    var spect = {
        show: show,
        hide: hide,
        toggle: toggle,
        reflow: reflow,
        option: option,
        enable: enable,
        disable: disable,
        offset: setOffset,
        set: function (c) {
          set(c);
          updateOriginalInput();
        },
        get: get,
        destroy: destroy,
        container: container
    };

    spect.id = spectrums.push(spect) - 1;

    return spect;
}

/**
* checkOffset - get the offset below/above and left/right element depending on screen position
* Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
*/
function getOffset(picker, input) {
    var extraY = 0;
    var dpWidth = picker.outerWidth();
    var dpHeight = picker.outerHeight();
    var inputHeight = input.outerHeight();
    var doc = picker[0].ownerDocument;
    var docElem = doc.documentElement;
    var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
    var viewHeight = docElem.clientHeight + $(doc).scrollTop();
    var offset = input.offset();
    var offsetLeft = offset.left;
    var offsetTop = offset.top;

    offsetTop += inputHeight;

    offsetLeft -=
        Math.min(offsetLeft, (offsetLeft + dpWidth > viewWidth && viewWidth > dpWidth) ?
        Math.abs(offsetLeft + dpWidth - viewWidth) : 0);

    offsetTop -=
        Math.min(offsetTop, ((offsetTop + dpHeight > viewHeight && viewHeight > dpHeight) ?
        Math.abs(dpHeight + inputHeight - extraY) : extraY));

    return {
        top: offsetTop,
        bottom: offset.bottom,
        left: offsetLeft,
        right: offset.right,
        width: offset.width,
        height: offset.height
    };
}

/**
* noop - do nothing
*/
function noop() {

}

/**
* stopPropagation - makes the code only doing this a little easier to read in line
*/
function stopPropagation(e) {
    e.stopPropagation();
}

/**
* Create a function bound to a given object
* Thanks to underscore.js
*/
function bind(func, obj) {
    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 2);
    return function () {
        return func.apply(obj, args.concat(slice.call(arguments)));
    };
}

/**
* Lightweight drag helper.  Handles containment within the element, so that
* when dragging, the x is within [0,element.width] and y is within [0,element.height]
*/
function draggable(element, onmove, onstart, onstop) {
    onmove = onmove || function () { };
    onstart = onstart || function () { };
    onstop = onstop || function () { };
    var doc = document;
    var dragging = false;
    var offset = {};
    var maxHeight = 0;
    var maxWidth = 0;
    var hasTouch = ('ontouchstart' in window);

    var duringDragEvents = {};
    duringDragEvents["selectstart"] = prevent;
    duringDragEvents["dragstart"] = prevent;
    duringDragEvents["touchmove mousemove"] = move;
    duringDragEvents["touchend mouseup"] = stop;

    function prevent(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;
    }

    function move(e) {
        if (dragging) {
            // Mouseup happened outside of window
            if (IE && doc.documentMode < 9 && !e.button) {
                return stop();
            }

            var t0 = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
            var pageX = t0 && t0.pageX || e.pageX;
            var pageY = t0 && t0.pageY || e.pageY;

            var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
            var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));

            if (hasTouch) {
                // Stop scrolling in iOS
                prevent(e);
            }

            onmove.apply(element, [dragX, dragY, e]);
        }
    }

    function start(e) {
        var rightclick = (e.which) ? (e.which == 3) : (e.button == 2);

        if (!rightclick && !dragging) {
            if (onstart.apply(element, arguments) !== false) {
                dragging = true;
                maxHeight = $(element).height();
                maxWidth = $(element).width();
                offset = $(element).offset();

                $(doc).on(duringDragEvents);
                $(doc.body).addClass("sp-dragging");

                move(e);

                prevent(e);
            }
        }
    }

    function stop() {
        if (dragging) {
            $(doc).off(duringDragEvents);
            $(doc.body).removeClass("sp-dragging");

            // Wait a tick before notifying observers to allow the click event
            // to fire in Chrome.
            setTimeout(function() {
                onstop.apply(element, arguments);
            }, 0);
        }
        dragging = false;
    }

    $(element).on("touchstart mousedown", start);
}

function throttle(func, wait, debounce) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var throttler = function () {
            timeout = null;
            func.apply(context, args);
        };
        if (debounce) clearTimeout(timeout);
        if (debounce || !timeout) timeout = setTimeout(throttler, wait);
    };
}

spectrum.localization = { };
spectrum.palettes = { };

export default spectrum;
