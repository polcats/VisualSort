$.fn.swap = function(elem) {
    elem = elem.jquery ? elem : $(elem);
    return this.each(function() {
        $(document.createTextNode(""))
            .insertBefore(this)
            .before(elem.before(this))
            .remove();
    });
};

var ANIMATION_FRAMES = [];
function animate(solution) {
    ANIMATION_FRAMES = [];

    let frames = solution.getFrames();
    for (i = 0; i < frames.length; ++i) {
        (function(frames, i, bars, ANIMATION_FRAMES, DELAY, TOTAL_ELEMENTS) {
            ANIMATION_FRAMES.push(
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
        })(frames, i, bars, ANIMATION_FRAMES, DELAY, TOTAL_ELEMENTS);
    }
}

function stopAnimation() {
    for (i = 0; i < ANIMATION_FRAMES.length; ++i) {
        clearTimeout(ANIMATION_FRAMES[i]);
    }
    disableInput(false);
}

function runAlgo(algo) {
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
                return Algorithms.bubble(input);
            }
            case "comb": {
                return Algorithms.comb(input);
            }
            case "insertion": {
                return Algorithms.insertion(input);
            }
            case "selection": {
                return Algorithms.selection(input);
            }
            default: {
                return false;
            }
        }
    }

    disableInput();
    var origin = getElements();
    var origin_copy = JSON.parse(JSON.stringify(origin));
    var solution = solve(algo, origin_copy);
    if (solution) {
        animate(solution);
    }
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
        // only stores a copy
        let temp = JSON.parse(JSON.stringify(move));
        this.frames.push(temp);
    }
    getFrames() {
        return this.frames;
    }
    frames = Array();
}

class Algorithms {
    static bubble(e) {
        let elements = e;
        let solution = new Animation();

        for (let i = 0; i < elements.length; ++i) {
            for (let j = 0; j < elements.length - i - 1; ++j) {
                let move = new Move();
                move.addHighlights([j, j + 1]);
                solution.addMove({ ...move });

                if (elements[j] < elements[j + 1]) {
                    move.reset();
                    move.addElements([j, j + 1]);

                    var temp = elements[j];
                    elements[j] = elements[j + 1];
                    elements[j + 1] = temp;

                    move.addHighlights([j, j + 1]);
                    solution.addMove({ ...move });
                }
            }
        }
        return solution;
    }

    static comb(e) {
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
                    move.reset();
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

    static insertion(e) {
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

    static selection(e) {
        let elements = e;
        let solution = new Animation();

        for (i = 0; i < elements.length - 1; ++i) {
            let currentMax = i;
            let move = new Move();

            move.addHighlights([i, currentMax]);
            solution.addMove(move);

            for (var j = i + 1; j < elements.length; ++j) {
                move.reset();
                move.addHighlights([i, j, currentMax]);
                solution.addMove(move);

                if (elements[j] > elements[currentMax]) {
                    currentMax = j;
                }
            }

            let temp = elements[currentMax];
            elements[currentMax] = elements[i];
            elements[i] = temp;

            move.reset();
            move.addHighlights([j, currentMax]);
            move.addElements([i, currentMax]);
            solution.addMove(move);
        }

        return solution;
    }
}
