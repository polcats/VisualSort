function shell(e)
{
    let elements = e;
    let n = e.length;

    var solutionObject = {};
    solutionObject.moves = [];

    for (gap =  Math.floor(n / 2); gap > 0; Math.floor(gap/=2))
    {
        for (i = gap; i < n; ++i)
        {
            temp = elements[i];

            move = {
                highlight: [],
                elements: []
            };

            
            let j;
            for (j = i; j >= gap && elements[j - gap] > temp; j-=gap)
            {
                // move.elements.push(j);
                // move.elements.push(j - gap);
                
                // move.highlight.push(j, "compared");
                // move.highlight.push(j - gap, "compared");

                elements[j] = elements[j - gap];
            }
            elements[j] = temp;
            move.highlight.push(i, "compared");
            move.highlight.push(j, "compared");
            move.elements.push(j);
            move.elements.push(i);

            solutionObject.moves.push(move);
        }
    }

    return solutionObject;
}

function runTest()
{
    disableInput();
    var origin = getElements();
    var origin_copy = JSON.parse(JSON.stringify(origin));
    var solution = comb(origin_copy);
    if (solution) {
        try {

            animate(origin, solution);
            console.log(solution);
        }
        catch(e){}
    }
}