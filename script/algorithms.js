class Frame {
    constructor(elements = [], highlights = [], information = "") {
        this.elements = elements;
        this.highlights = highlights;
        this.information = information;
    }

    addHighlights(highlights) {
        this.highlights.push(...highlights);
    }

    addElements(elements) {
        this.elements.push(...elements);
    }
}

class Animation {
    constructor() {
        this.frames = [];
    }

    addFrame(frame) {
        this.frames.push(JSON.parse(JSON.stringify(frame))); // Store a copy
    }

    getFrames() {
        return this.frames;
    }
}

class Algorithms {
    static bubble(e, order) {
        let elements = e.slice();
        let solution = new Animation();
        let swapped;

        for (let i = 0; i < elements.length; ++i) {
            swapped = false;
            for (let j = 0; j < elements.length - i - 1; ++j) {
                solution.addFrame(new Frame([], [j, j + 1]));

                if ((order === "desc" && elements[j] < elements[j + 1]) || (order === "asc" && elements[j] > elements[j + 1])) {
                    swapped = true;
                    [elements[j], elements[j + 1]] = [elements[j + 1], elements[j]];
                    solution.addFrame(new Frame([j, j + 1], [j, j + 1]));
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

        while (1 != gap || true == swapped) {
            gap = getNextGap(gap);
            swapped = false;

            for (let i = 0; i < n - gap; ++i) {
                solution.addFrame(new Frame([], [i, i + gap]));

                if (order == "desc" ? e[i] < e[gap + i] : e[i] > e[gap + i]) {
                    swapped = true;

                    const temp = e[i];
                    e[i] = e[gap + i];
                    e[i + gap] = temp;

                    solution.addFrame(new Frame([i, i + gap], [i, i + gap]));
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

        for (let i = 1; i < elements.length; ++i) {
            let key = elements[i];
            let j = i - 1;

            solution.addFrame(new Frame([], [j, j + 1]));

            while (j >= 0 && (order == "desc" ? elements[j] < key : elements[j] > key)) {
                solution.addFrame(new Frame([], [j, j + 1]));
                elements[j + 1] = elements[j];
                solution.addFrame(new Frame([j, j + 1], [j, j + 1]));

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

            solution.addFrame(new Frame([], [i, current]));

            let j = 0;
            for (j = i + 1; j < elements.length; ++j) {
                solution.addFrame(new Frame([], [i, j, current]));

                if (order == "desc" ? elements[j] > elements[current] : elements[j] < elements[current]) {
                    current = j;
                }
            }

            const temp = elements[current];
            elements[current] = elements[i];
            elements[i] = temp;

            solution.addFrame(new Frame([i, current], [j, current]));
        }

        return solution;
    }

    static shell(e, order) {
        let elements = e.slice();
        const n = elements.length;
        let solution = new Animation();

        for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
            for (let i = gap; i < n; ++i) {
                const temp = elements[i];
                let j = i;

                solution.addFrame(new Frame([], [i, j - gap]));

                while (j >= gap && ((order === "desc" && elements[j - gap] < temp) || (order === "asc" && elements[j - gap] > temp))) {
                    elements[j] = elements[j - gap];
                    solution.addFrame(new Frame([j, j - gap], [i, j - gap]));
                    j -= gap;
                }

                solution.addFrame(new Frame([], [j, i]));
                elements[j] = temp;
                solution.addFrame(new Frame([], [j, i]));
            }
        }

        return solution;
    }

    static heap(e, order) {
        let elements = e;
        const n = e.length;
        let solution = new Animation();

        for (let i = parseInt(n / 2) - 1; i >= 0; --i) {
            heapify(elements, n, i, solution, order);
        }

        for (let i = n - 1; i >= 0; --i) {
            const temp = elements[0];
            elements[0] = elements[i];
            elements[i] = temp;

            solution.addFrame(new Frame([0, i], [0, i]));

            heapify(elements, i, 0, solution, order);
        }

        function heapify(elements, n, i, solution, order) {
            let current = i;
            let left = 2 * i + 1;
            let right = 2 * i + 2;

            if (left < n && (order == "asc" ? elements[left] > elements[current] : elements[left] < elements[current])) {
                current = left;
            }

            if (right < n && (order == "asc" ? elements[right] > elements[current] : elements[right] < elements[current])) {
                current = right;
            }

            solution.addFrame(new Frame([], [current, i]));

            if (current != i) {
                const temp = elements[i];
                elements[i] = elements[current];
                elements[current] = temp;
                solution.addFrame(new Frame([current, i], [current, i]));

                heapify(elements, n, current, solution, order);
            }
        }

        return solution;
    }
}
