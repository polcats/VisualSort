function generateElements(count) {
    // generate unique values
    var set = new Set();
    while (set.size < count) {
        set.add(Math.round(Math.random() * 99) + 1);
    }

    return Array.from(set);
}

var timeouts = [];
function animate(origin, solution) {
    timeouts = [];
    for (i = 0; i < solution.moves.length; ++i) {
        (function(solution, i, bars, timeouts) {
            timeouts.push(
                setTimeout(function() {
                    let highlight = solution.moves[i].highlight;

                    let elem = solution.moves[i].elements;
                    $(bars[elem[0]])
                        .addClass("compared")
                        .wait(100)
                        .removeClass("compared");
                    $(bars[elem[1]])
                        .addClass("compared")
                        .wait(100)
                        .removeClass("compared");

                    $(bars[elem[0]]).swap(bars[elem[1]]);
                    if (i == solution.moves.length - 1) {
                        disableInput(false);
                    }
                }, DELAY * TOTAL_ELEMENTS * i)
            );
        })(solution, i, bars, timeouts);
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

            move.highlight.push(j, "compared");
            move.highlight.push(j + 1, "compared");

            move.elements.push(j + 1);
            move.elements.push(j);
            solutionObject.moves.push(move);

            j = j - 1;
        }
        elements[j + 1] = key;
    }

    return solutionObject;
}

function bubble(e) {
    var elements = e;
    var solutionObject = {};
    solutionObject.moves = [];

    for (i = 0; i < elements.length; ++i) {
        for (j = 0; j < elements.length - i - 1; ++j) {
            move = {
                highlight: [],
                elements: []
            };

            move.highlight.push(j, "compared");
            move.highlight.push(j + 1, "compared");

            if (elements[j] < elements[j + 1]) {
                var temp = elements[j];
                elements[j] = elements[j + 1];
                elements[j + 1] = temp;
                move.elements.push(j);
                move.elements.push(j + 1);
                solutionObject.moves.push(move);
            }
        }
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
        for (j = i + 1; j < elements.length; ++j) {
            move.highlight.push(j, "compared");
            move.highlight.push(j + 1, "compared");

            if (elements[j] > elements[currentMax]) {
                currentMax = j;
            }
        }
        let temp = elements[currentMax];
        elements[currentMax] = elements[i];
        elements[i] = temp;

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
            break;
        }
        case "insertion": {
            return insertion(input);
            break;
        }
        case "selection": {
            return selection(input);
            break;
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
