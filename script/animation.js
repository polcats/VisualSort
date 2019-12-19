$.fn.swap = function(elem) {
    elem = elem.jquery ? elem : $(elem);
    return this.each(function() {
        $(document.createTextNode(""))
            .insertBefore(this)
            .before(elem.before(this))
            .remove();
    });
};

let ANIMATION_FRAMES = [];
function animate(solution) {
    ANIMATION_FRAMES = [];

    const frames = solution.getFrames();
    for (let i = 0; i < frames.length; ++i) {
        (function(frames, i, bars, ANIMATION_FRAMES, SPEED, TOTAL_ELEMENTS) {
            ANIMATION_FRAMES.push(
                setTimeout(function() {
                    $(".bar").removeClass("compared");
                    const lastFrame = i == frames.length - 1;
                    const elem = frames[i].elements;
                    const highlight = frames[i].highlights;

                    if (0 < highlight.length && !lastFrame) {
                        for (h = 0; h < highlight.length; ++h) {
                            $(bars[highlight[h]]).addClass("compared");
                        }
                    }

                    if (0 < elem.length) {
                        $(bars[elem[1]]).swap(bars[elem[0]]);
                    }

                    if (lastFrame) {
                        $("#stop")
                            .attr("disabled", true)
                            .removeClass("green");
                    }
                }, SPEED * TOTAL_ELEMENTS * i)
            );
        })(frames, i, bars, ANIMATION_FRAMES, SPEED, TOTAL_ELEMENTS);
    }
}

function stopAnimation() {
    for (let i = 0; i < ANIMATION_FRAMES.length; ++i) {
        clearTimeout(ANIMATION_FRAMES[i]);
    }

    $(".bar").removeClass("compared");
    disableInput(false);
}
