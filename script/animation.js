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
    const origin = getElements();
    let origin_copy = JSON.parse(JSON.stringify(origin));
    let solution = solve(algo, order, origin_copy);

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
            default: {
                return false;
            }
        }
    }
}

class Frame {
    Frame() {}

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

    addFrame(frame) {
        // only stores a copy
        const temp = JSON.parse(JSON.stringify(frame));
        this.frames.push(temp);
    }

    getFrames() {
        return this.frames;
    }

    frames = Array();
}

class Algorithms {
    static bubble(e, order) {
        let elements = e;
        let solution = new Animation();

        for (let i = 0; i < elements.length; ++i) {
            for (let j = 0; j < elements.length - i - 1; ++j) {
                let frame = new Frame();
                frame.addHighlights([j, j + 1]);
                solution.addFrame({ ...frame });

                const condition = order == "desc" ? elements[j] < elements[j + 1] : elements[j] > elements[j + 1];

                if (condition) {
                    frame.reset();
                    frame.addElements([j, j + 1]);

                    const temp = elements[j];
                    elements[j] = elements[j + 1];
                    elements[j + 1] = temp;

                    frame.addHighlights([j, j + 1]);
                    solution.addFrame({ ...frame });
                }
            }
        }

        return solution;
    }

    static comb(e, order) {
        let solution = new Animation();

        function getNextGap(gap) {
            let local_gap = Math.floor((gap * 10) / 13);
            if (local_gap < 1) {
                return 1;
            }

            return local_gap;
        }

        const n = e.length;
        let gap = n;
        let swapped = true;

        while (1 != gap || true == swapped) {
            gap = getNextGap(gap);
            swapped = false;

            for (let i = 0; i < n - gap; ++i) {
                let frame = new Frame();
                frame.addHighlights([i, i + gap]);
                solution.addFrame(frame);

                const condition = order == "desc" ? e[i] < e[gap + i] : e[i] > e[gap + i];

                if (condition) {
                    frame.reset();
                    frame.addElements([i, i + gap]);

                    const temp = e[i];
                    e[i] = e[gap + i];
                    e[i + gap] = temp;

                    frame.addHighlights([i, i + gap]);
                    solution.addFrame(frame);

                    swapped = true;
                }
            }
        }

        return solution;
    }

    static insertion(e, order) {
        let elements = e;
        let solution = new Animation();

        for (let i = 1; i < elements.length; ++i) {
            let key = elements[i];
            let j = i - 1;

            while (j >= 0 && (order == "desc" ? elements[j] < key : elements[j] > key)) {
                elements[j + 1] = elements[j];

                let frame = new Frame();
                frame.addHighlights([j, j + 1]);
                frame.addElements([j, j + 1]);
                solution.addFrame(frame);

                j = j - 1;
            }

            elements[j + 1] = key;
        }

        return solution;
    }

    static selection(e, order) {
        let elements = e;
        let solution = new Animation();

        for (let i = 0; i < elements.length - 1; ++i) {
            let current = i;
            let frame = new Frame();

            frame.addHighlights([i, current]);
            solution.addFrame(frame);

            let j = 0;
            for (j = i + 1; j < elements.length; ++j) {
                frame.reset();
                frame.addHighlights([i, j, current]);
                solution.addFrame(frame);

                let condition = order == "desc" ? elements[j] > elements[current] : elements[j] < elements[current];

                if (condition) {
                    current = j;
                }
            }

            const temp = elements[current];
            elements[current] = elements[i];
            elements[i] = temp;

            frame.reset();
            frame.addHighlights([j, current]);
            frame.addElements([i, current]);
            solution.addFrame(frame);
        }

        return solution;
    }
}
