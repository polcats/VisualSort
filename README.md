# VisualSort

An animated visualization of sorting algorithms.

<h2>Algorithms</h2>
<h3>Animated</h3>
<ul>
<li>Bubble Sort</li>
<li>Comb Sort</li>
<li>Insertion Sort</li>
<li>Selection Sort</li>
</ul>

<h3>Implemented</h3>
<ul>
<li>Merge Sort</li>
<li>Shell Sort</li>
</ul>

<h3>To Do</h3>
<ul>
<li>Heap Sort</li>
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
class Algorthims {
    static bubble(e) {
        let elements = e;
        let solution = new Animation();

        for (let i = 0; i < elements.length; ++i) {
            for (let j = 0; j < elements.length - i - 1; ++j) {
            
                // Highlight adjacent elements
                let frame = new Frame();
                frame.addHighlights([j, j + 1]);
                solution.addFrame({ ...frame });

                if (elements[j] < elements[j + 1]) {
                    frame.reset();

                    // Store indeces of to-be-swapped elements
                    frame.addElements([j, j + 1]);

                    let temp = elements[j];
                    elements[j] = elements[j + 1];
                    elements[j + 1] = temp;

                    // Highlight swapped elements
                    frame.addHighlights([j, j + 1]);
                    solution.addFrame({ ...frame });
                }
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
<li>[ ] Custom Sort Order (Ascending or Descending)</li>
<li>[ ] Algorithm Comparison</li>
<li>[x] Algorithm Details</li>
</ul>
