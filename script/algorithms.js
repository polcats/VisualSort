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
        let frame = new Frame();
        let swapped = false;

        for (let i = 0; i < elements.length; ++i) {
            swapped = false;
            for (let j = 0; j < elements.length - i - 1; ++j) {
                frame.reset();
                frame.addHighlights([j, j + 1]);
                solution.addFrame(frame);

                const condition = order == "desc" ? elements[j] < elements[j + 1] : elements[j] > elements[j + 1];

                if (condition) {
                    swapped = true;

                    frame.reset();
                    frame.addElements([j, j + 1]);

                    const temp = elements[j];
                    elements[j] = elements[j + 1];
                    elements[j + 1] = temp;

                    frame.addHighlights([j, j + 1]);
                    solution.addFrame(frame);
                }
            }

            if (!swapped) {
                break;
            }
        }

        return solution;
    }

    static comb(e, order) {
        const n = e.length;
        let gap = n;
        let swapped = true;
        let solution = new Animation();
        let frame = new Frame();

        while (1 != gap || true == swapped) {
            gap = getNextGap(gap);
            swapped = false;

            for (let i = 0; i < n - gap; ++i) {
                frame.reset();
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

        function getNextGap(gap) {
            const local_gap = Math.floor((gap * 10) / 13);
            if (local_gap < 1) {
                return 1;
            }

            return local_gap;
        }

        return solution;
    }

    static insertion(e, order) {
        let elements = e;
        let solution = new Animation();
        let frame = new Frame();

        for (let i = 1; i < elements.length; ++i) {
            let key = elements[i];
            let j = i - 1;

            frame.reset();
            frame.addHighlights([j, j + 1]);
            solution.addFrame(frame);

            while (j >= 0 && (order == "desc" ? elements[j] < key : elements[j] > key)) {
                frame.reset();
                frame.addHighlights([j, j + 1]);
                solution.addFrame(frame);

                elements[j + 1] = elements[j];

                frame.reset();
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
        let frame = new Frame();

        for (let i = 0; i < elements.length - 1; ++i) {
            let current = i;

            frame.reset();
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

    static shell(e, order) {
        let elements = e;
        const n = e.length;

        let solution = new Animation();
        let frame = new Frame();

        for (let gap = parseInt(n / 2); gap > 0; gap = parseInt(gap / 2)) {
            for (let i = gap; i < n; ++i) {
                const temp = elements[i];
                let j;

                frame.reset();

                if (!isNaN(j - gap)) {
                    frame.addHighlights([i, j - gap]);
                }

                solution.addFrame(frame);

                for (
                    j = i;
                    j >= gap && (order == "desc" ? elements[j - gap] < temp : elements[j - gap] > temp);
                    j -= gap
                ) {
                    frame.reset();
                    frame.addHighlights([i, j - gap]);
                    frame.addElements([j, j - gap]);
                    solution.addFrame(frame);

                    elements[j] = elements[j - gap];

                    frame.reset();
                    frame.addHighlights([j, j - gap]);
                    solution.addFrame(frame);
                }

                frame.reset();
                frame.addHighlights([j, i]);
                solution.addFrame(frame);

                elements[j] = temp;

                frame.reset();
                frame.addHighlights([j, i]);
                solution.addFrame(frame);
            }
        }

        return solution;
    }
}
