function generateElements(count) {
    // generate unique values
    var set = new Set();
    while (set.size < count) {
        set.add(Math.round(Math.random() * 99) + 1);
    }

    return Array.from(set);
}

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
    for (i = 0; i < solution.moves.length; ++i) {
        (function(solution, i, bars, timeouts, DELAY, TOTAL_ELEMENTS) {
            timeouts.push(
                setTimeout(function() {
                    $(".bar").removeClass("compared");
                    let elem = solution.moves[i].elements;
                    let innerDelay = DELAY * TOTAL_ELEMENTS;
                    let highlight = solution.moves[i].highlight;

                    if (highlight.length && i != solution.moves.length - 1) {
                        for (h = 0; h < highlight.length; ++h) {
                            $(bars[highlight[h]]).addClass("compared");
                        }
                    }

                    if (elem.length) {
                        $(bars[elem[0]]).swap(bars[elem[1]]);
                    }

                    if (i == solution.moves.length - 1) {
                        $("#stop")
                            .attr("disabled", true)
                            .removeClass("green");
                    }
                }, DELAY * TOTAL_ELEMENTS * i)
            );
        })(solution, i, bars, timeouts, DELAY, TOTAL_ELEMENTS);
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

function bubble(e) {
    var elements = e;
    var solutionObject = {};
    solutionObject.moves = [];

    for (i = 0; i < elements.length; ++i) {
        for (j = 0; j < elements.length - i - 1; ++j) {
            let move = {
                highlight: [],
                elements: []
            };

            move.highlight.push(j);
            move.highlight.push(j + 1);
            solutionObject.moves.push(move);

            if (elements[j] < elements[j + 1]) {
                move = {
                    highlight: [],
                    elements: []
                };
                move.elements.push(j);
                move.elements.push(j + 1);

                var temp = elements[j];
                elements[j] = elements[j + 1];
                elements[j + 1] = temp;

                move.highlight.push(j);
                move.highlight.push(j + 1);
            }
            solutionObject.moves.push(move);
        }
    }
    console.log(solutionObject);
    return solutionObject;
}

function comb(e) {
    var solutionObject = {};
    solutionObject.moves = [];

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
            move = {
                highlight: [],
                elements: []
            };
            move.highlight.push(i);
            move.highlight.push(gap + i);
            solutionObject.moves.push(move);

            if (e[i] < e[gap + i]) {
                move = {
                    highlight: [],
                    elements: []
                };
                move.elements.push(i);
                move.elements.push(gap + i);

                let temp = e[i];
                e[i] = e[gap + i];
                e[i + gap] = temp;

                move.highlight.push(i);
                move.highlight.push(gap + i);

                swapped = true;
            }

            solutionObject.moves.push(move);
        }
    }

    return solutionObject;
}

function insertion(e) {
    var elements = e;
    var solutionObject = {};
    solutionObject.moves = [];

    for (i = 1; i < elements.length; ++i) {
        var key = elements[i];
        var j = i - 1;
        while (j >= 0 && elements[j] < key) {
            elements[j + 1] = elements[j];

            move = {
                highlight: [],
                elements: []
            };

            move.highlight.push(j);
            move.highlight.push(j + 1);

            move.elements.push(j + 1);
            move.elements.push(j);
            solutionObject.moves.push(move);

            j = j - 1;
        }
        elements[j + 1] = key;
    }

    return solutionObject;
}

function selection(e) {
    var elements = e;
    var solutionObject = {};
    solutionObject.moves = [];

    for (i = 0; i < elements.length - 1; ++i) {
        let currentMax = i;
        move = {
            highlight: [],
            elements: []
        };
        move.highlight.push(i);
        move.highlight.push(currentMax);
        solutionObject.moves.push(move);

        for (j = i + 1; j < elements.length; ++j) {
            move = {
                highlight: [],
                elements: []
            };
            move.highlight.push(i);
            move.highlight.push(j);
            move.highlight.push(currentMax);
            solutionObject.moves.push(move);
            if (elements[j] > elements[currentMax]) {
                currentMax = j;
            }
        }
        let temp = elements[currentMax];
        elements[currentMax] = elements[i];
        elements[i] = temp;

        move = {
            highlight: [],
            elements: []
        };
        move.highlight.push(j);
        move.highlight.push(currentMax);
        move.elements.push(i);
        move.elements.push(currentMax);
        solutionObject.moves.push(move);
    }
    return solutionObject;
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
