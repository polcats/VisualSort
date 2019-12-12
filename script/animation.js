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
        let highlight = solution.moves[i].highlight;
        (function(solution, i, bars) {
            setTimeout(function() {
                for (h = 0; h < highlight.length; ++h) {
                    $(bars[highlight[0]])
                        .addClass(highlight[1])
                        .wait(50)
                        .removeClass("compared");
                }

                let elem = solution.moves[i].elements;
                $(bars[elem[0]]).swap(bars[elem[1]]);
            }, DELAY * i);
        })(solution, i, bars);
    }
}

function insertionSort(e) {
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

            move.highlight.push(j + 1, "compared");
            move.highlight.push(j, "compared");

            move.elements.push(j + 1);
            move.elements.push(j);
            solutionObject.moves.push(move);

            j = j - 1;
        }
        elements[j + 1] = key;
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
    var solution = insertionSort(origin_copy);
    animate(origin, solution);
}
