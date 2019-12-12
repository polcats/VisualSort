function generateElements(count)
{
    // generate unique values
    var set = new Set();
    while (set.size < count) {
        set.add(Math.round(Math.random() * 99) + 1);
    }

    return Array.from(set);
}

function animate(anim)
{
    for(i = anim.moves.size - 1; i >= 0; --i)
    {
        // hightlight elements
        let highlight = anim.moves[i].highlight;

        // run timeout
        for (h = 0; h < highlight.size; ++h)
        {
            bars[highlight[0]].addClass(highlight[1]);
        }

        // swap elements
        let elem = anim.moves[i].elements;
        $(elem[0]).swap(elem[1]);

        // remove highlight
        for (h = 0; h < highlight.size; ++h)
        {
            bars[highlight[0]].removeClass(highlight[1]);
        }
    }
}

function solve(origin, solution)
{
    console.log("origin : " + origin);
    for (i = 0; i < solution.moves.length; ++i)
    {
        let temp = origin[solution.moves[i].elements[0]];
        origin[solution.moves[i].elements[0]] = origin[solution.moves[i].elements[1]] ;
        origin[solution.moves[i].elements[1]] = temp;
        console.log(" - " + origin);
    }
    console.log("solved : " + origin);
}

function insertionSort(e)
{
    var elements = e;
    var solutionObject = {};
    solutionObject.moves = [];

    for (i = 1; i < elements.length; ++i)
    {
        var key = elements[i];
        var j = i - 1;
        while (j >= 0 && elements[j] < key)
        {
            elements[j+1] = elements[j];

            move =
            {
                highlight : [],
                elements : []
            };

            move.elements.push(j+1);
            move.elements.push(j);
            solutionObject.moves.push(move);

            j = j -1;
        }
        elements[j+1] = key;
    }

    console.log("solution : " + elements)

    return solutionObject;
}

function test()
{
    var e = generateElements(10);
    console.log("initial : " + e)
    var newInstance = JSON.parse(JSON.stringify(e));
    var r = insertionSort(newInstance);
    solve(e, r);
}