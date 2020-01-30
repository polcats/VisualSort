# VisualSort

An animated visualization of sorting algorithms.

<h2>Algorithms</h2>
<h3>Animated</h3>
<ul>
<li>Bubble Sort</li>
<li>Comb Sort</li>
<li>Heap Sort</li>
<li>Insertion Sort</li>
<li>Selection Sort</li>
<li>Shell Sort</li>
</ul>

<h3>Implemented</h3>
<ul>
<li>Merge Sort</li>
</ul>

<h3>To Do</h3>
<ul>
<li>Counting Sort</li>
</ul>

<h2>How Does It Work</h2>

<h3>Animation Object</h3>
<p>The animation object contains the frames which hold the indices of the elements to be highlighted and/or swapped.</p>
<p>The frames are essentially the stored "steps" of the algorithm.</p>

```javascript
animation = {
    "frames":[
        {
            "elements":[],
            "highlights":[0, 1]
        },
        {
            "elements":[0, 1],
            "highlights":[0, 1]
        }
        .
        .
    ]
}
```

<h3>Usage</h3>
<p>The animation object is created in a sorting algorithm. <br> Particular events are stored as frames of the animation.</p>

```javascript
class Algorithms {
    static bubble(e, order) {
        let elements = e;
        let solution = new Animation();
        let swapped = false;

        for (let i = 0; i < elements.length; ++i) {
            swapped = false;
            for (let j = 0; j < elements.length - 1; ++j) {
                solution.addFrame(new Frame([], [j, j + 1])); // Record to-be-highlighted elements

                if (order == "desc" ? elements[j] < elements[j + 1] : elements[j] > elements[j + 1]) {
                    swapped = true;

                    const temp = elements[j];
                    elements[j] = elements[j + 1];
                    elements[j + 1] = temp;

                    solution.addFrame(new Frame([j, j + 1], [j, j + 1])); // Record to-be-swapped & to-be-highlighted elements
                }
            }

            if (!swapped) {
                break;
            }
        }
        return solution;
    }
}
```

<h3>Animating the Algorithm</h3>
<p>The animation is played by a function that highlights the current elements in a frame and/or swaps them.</p>

<h2>Target Changes</h2>
<ul>
<li>[ ] Refine Swap Animation</li>
<li>[ ] Algorithm Comparison</li>
<li>[x] Custom Sort Order (Ascending or Descending)</li>
<li>[x] Algorithm Details</li>
</ul>

<h2>References</h2>
<ul>
    <li><a href="https://www.geeksforgeeks.org/sorting-algorithms/" target="_blank">Geeks for Geeks (Sorting Algorithms)</a></li>
    <li><a href="https://betterexplained.com/articles/sorting-algorithms/" target="_blank">Better Explained (Sorting Algorithms)</a></li>
</ul>
