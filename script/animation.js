function generateElements(count) {
    // generate unique values
    var set = new Set();
    while (set.size < count) {
        set.add(Math.round(Math.random() * 99) + 1);
    }

    return Array.from(set);
}

function animate(origin, solution) {
    for (i = 0; i < solution.moves.length; ++i) {
        (function(solution, i, bars) {
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
            }, DELAY * TOTAL_ELEMENTS * i);
        })(solution, i, bars);
    }
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

function getElements() {
    var els = Array();
    for (i = 0; i < bars.length; ++i) {
        els.push(parseInt(bars[i].innerHTML));
    }

    return els;
}

function runAlgo() {
    var origin = getElements();
    var origin_copy = JSON.parse(JSON.stringify(origin));
    var solution = bubble(origin_copy);
    console.log(solution);
    animate(origin, solution);
}
