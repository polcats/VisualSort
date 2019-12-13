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



function comb(e)
{
    var solutionObject = {};
    solutionObject.moves = [];

    function getNextGap(gap)
    {
        let local_gap = Math.floor((gap * 10) / 13);
        if (local_gap < 1)
        {
            return 1;
        }

        return local_gap;
    }

    let n = e.length;
    let gap = n;
    let swapped = true;

    while ( 1 != gap || true == swapped)
    {
        gap = getNextGap(gap);
        swapped = false;

        for (i = 0; i < n - gap; ++i)
        {
            move = {
                highlight: [],
                elements: []
            };

            if (e[i] < e[gap + i])
            {
                move.highlight.push(i, "compared");
                move.highlight.push(gap + i, "compared");
                move.elements.push(i);
                move.elements.push(gap + i);

                let temp = e[i];
                e[i] = e[gap+i];
                e[i+gap] = temp;

                swapped = true;
            }
            
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