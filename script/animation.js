$.fn.swap = function(elem) {
    elem = elem.jquery ? elem : $(elem);
    return this.each(function() {
        $(document.createTextNode(""))
            .insertBefore(this)
            .before(elem.before(this))
            .remove();
    });
};

var timeouts = [];
function animate(origin, solution) {
    timeouts = [];

    let frames = solution.getFrames();

    for (i = 0; i < frames.length; ++i) {
        (function(frames, i, bars, timeouts, DELAY, TOTAL_ELEMENTS) {
            timeouts.push(
                setTimeout(function() {
                    $(".bar").removeClass("compared");
                    let innerDelay = DELAY * TOTAL_ELEMENTS;
                    let lastFrame = i == frames.length - 1;
                    let elem = frames[i].elements;
                    let highlight = frames[i].highlights;

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
        })(frames, i, bars, timeouts, DELAY, TOTAL_ELEMENTS);
    }
}

function stopAnimation() {
    for (i = 0; i < timeouts.length; ++i) {
        clearTimeout(timeouts[i]);
    }
    disableInput(false);
}

function reset() {
    stopAnimation();
    updateDelay();
    updateElements();
}

class Move {
    Move() {}
    addHighlights(highlights) {
        for (const e of highlights) {
            this.highlights.push(e);
        }
    }
    addElements(elements) {
        for (const e of elements) {
            this.elements.push(e);
        }
    }
    reset() {
        this.highlights.length = 0;
        this.elements.length = 0;
    }

    elements = Array();
    highlights = Array();
}

class Animation {
    Animation() {}
    addMove(move) {
        this.frames.push(move);
    }
    getFrames() {
        return this.frames;
    }
    frames = Array();
}

function bubble(e) {
    let elements = e;
    let solution = new Animation();

    for (i = 0; i < elements.length; ++i) {
        for (j = 0; j < elements.length - i - 1; ++j) {
            let move = new Move();
            move.addHighlights([j, j + 1]);
            solution.addMove(move);

            if (elements[j] < elements[j + 1]) {
                move = new Move();
                move.addElements([j, j + 1]);

                var temp = elements[j];
                elements[j] = elements[j + 1];
                elements[j + 1] = temp;

                move.addHighlights([j, j + 1]);
                solution.addMove(move);
            }
        }
    }
    return solution;
}

function comb(e) {
    let solution = new Animation();

    function getNextGap(gap) {
        let local_gap = Math.floor((gap * 10) / 13);
        if (local_gap < 1) {
            return 1;
        }

        return local_gap;
    }

    let n = e.length;
    let gap = n;
    let swapped = true;

    while (1 != gap || true == swapped) {
        gap = getNextGap(gap);
        swapped = false;

        for (i = 0; i < n - gap; ++i) {
            let move = new Move();
            move.addHighlights([i, i + gap]);
            solution.addMove(move);

            if (e[i] < e[gap + i]) {
                move = new Move();
                move.addElements([i, i + gap]);

                let temp = e[i];
                e[i] = e[gap + i];
                e[i + gap] = temp;

                move.addHighlights([i, i + gap]);
                solution.addMove(move);

                swapped = true;
            }
        }
    }

    return solution;
}

function insertion(e) {
    let elements = e;
    let solution = new Animation();

    for (i = 1; i < elements.length; ++i) {
        var key = elements[i];
        var j = i - 1;
        while (j >= 0 && elements[j] < key) {
            elements[j + 1] = elements[j];

            let move = new Move();
            move.addHighlights([j, j + 1]);
            move.addElements([j, j + 1]);
            solution.addMove(move);

            j = j - 1;
        }
        elements[j + 1] = key;
    }

    return solution;
}

function selection(e) {
    let elements = e;
    let solution = new Animation();

    for (i = 0; i < elements.length - 1; ++i) {
        let currentMax = i;
        let move = new Move();

        move.addHighlights([i, currentMax]);
        solution.addMove(move);

        for (j = i + 1; j < elements.length; ++j) {
            move = new Move();
            move.addHighlights([i, j, currentMax]);
            solution.addMove(move);

            if (elements[j] > elements[currentMax]) {
                currentMax = j;
            }
        }

        let temp = elements[currentMax];
        elements[currentMax] = elements[i];
        elements[i] = temp;

        move = new Move();
        move.addHighlights([j, currentMax]);
        move.addElements([i, currentMax]);
        solution.addMove(move);
    }

    return solution;
}

function getElements() {
    var els = Array();
    for (i = 0; i < bars.length; ++i) {
        els.push(parseInt(bars[i].innerHTML));
    }

    return els;
}

function solve(algo, input) {
    switch (algo) {
        case "bubble": {
            return bubble(input);
        }
        case "comb": {
            return comb(input);
        }
        case "insertion": {
            return insertion(input);
        }
        case "selection": {
            return selection(input);
        }
        default: {
            return false;
        }
    }
}

function runAlgo(algo) {
    disableInput();
    var origin = getElements();
    var origin_copy = JSON.parse(JSON.stringify(origin));
    var solution = solve(algo, origin_copy);
    if (solution) {
        animate(origin, solution);
    }
}
