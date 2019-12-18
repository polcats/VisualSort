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

    let frames = solution.getFrames();
    for (let i = 0; i < frames.length; ++i) {
        (function(frames, i, bars, ANIMATION_FRAMES, DELAY, TOTAL_ELEMENTS) {
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
                }, DELAY * TOTAL_ELEMENTS * i)
            );
        })(frames, i, bars, ANIMATION_FRAMES, DELAY, TOTAL_ELEMENTS);
    }
}

function stopAnimation() {
    for (let i = 0; i < ANIMATION_FRAMES.length; ++i) {
        clearTimeout(ANIMATION_FRAMES[i]);
    }

    $(".bar").removeClass("compared");
    disableInput(false);
}

function runAlgo() {
    if (DELAY <= 0) {
        console.log("Abnormal delay.");
        return;
    }

    const algo = $("select#algorithms")
        .children("option:selected")
        .val();

    const order = $("select#order")
        .children("option:selected")
        .val();

    disableInput();
    let elements = JSON.parse(JSON.stringify(getElements()));
    let solution = solve(algo, order, elements);

    if (solution) {
        animate(solution);
    }

    function getElements() {
        let els = Array();

        for (let i = 0; i < bars.length; ++i) {
            els.push(parseInt(bars[i].innerHTML));
        }

        return els;
    }

    function solve(algo, order, input) {
        switch (algo) {
            case "bubble": {
                return Algorithms.bubble(input, order);
            }
            case "comb": {
                return Algorithms.comb(input, order);
            }
            case "insertion": {
                return Algorithms.insertion(input, order);
            }
            case "selection": {
                return Algorithms.selection(input, order);
            }
            case "shell": {
                return Algorithms.shell(input, order);
            }
            default: {
                return false;
            }
        }
    }
}
