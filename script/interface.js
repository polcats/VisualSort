(function init() {
    updateSpeed();
    updateElements();
    showDetails();
})();

$("#speed").on("input", function() {
    updateSpeed();
});

$("#elements").on("input", function() {
    updateElements();
});

$("#algorithms").on("change", function() {
    showDetails();
});

$("#sort").on("click", function() {
    runAlgo();
});

$("#stop").on("click", function() {
    stopAnimation();
});

$("#reset").on("click", function() {
    reset();
});

function updateSpeed() {
    SPEED = document.getElementById("speed").value;
    document.getElementById("speed-count").innerHTML = 101 - SPEED;
}

function updateElements() {
    clearContainer();
    TOTAL_ELEMENTS = document.getElementById("elements").value;
    document.getElementById("element-count").innerHTML = TOTAL_ELEMENTS;
    insertBars();
}

function clearContainer() {
    container.innerHTML = "";
}

function insertBars() {
    const width = CONTAINER_WIDTH / TOTAL_ELEMENTS;

    // generate unique values
    let set = new Set();
    while (set.size < TOTAL_ELEMENTS) {
        set.add(Math.round(Math.random() * 99) + 1);
    }

    // generate bars
    const arr = Array.from(set);
    for (let i = 0; i < arr.length; ++i) {
        let bar = document.createElement("div");
        bar.setAttribute("class", "bar");
        bar.setAttribute("style", "width: " + width + "px; height: " + arr[i] + "%;");
        bar.innerHTML = arr[i];
        container.appendChild(bar);
    }
}

function showDetails() {
    const algo = $("select#algorithms")
        .children("option:selected")
        .val();
    $(".algo-container").addClass("hidden");
    $("#" + algo + "-info").removeClass("hidden");
}

function disableInput(what = true) {
    // disable inputs
    $(".sort").attr("disabled", what);
    $(".slider-input").attr("disabled", what);
    $("select#algorithms").attr("disabled", what);
    $("select#order").attr("disabled", what);

    // swap colors
    $("#stop")
        .attr("disabled", true)
        .removeClass("green");

    if (what) {
        $(".sort").removeClass("green");
        $("#stop")
            .attr("disabled", false)
            .addClass("green");

        return;
    }

    $(".sort").addClass("green");
}

function reset() {
    stopAnimation();
    updateSpeed();
    updateElements();
}

function runAlgo() {
    if (SPEED <= 0) {
        console.log("Abnormal delay.");
        return;
    }

    const algo = $("select#algorithms")
        .children("option:selected")
        .val();

    const order = $("select#order")
        .children("option:selected")
        .val();

    let elements = JSON.parse(JSON.stringify(getElements()));
    const solution = solve(algo, order, elements);

    if (solution) {
        disableInput();
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
            case "shell": {
                return Algorithms.shell(input, order);
            }
            default: {
                return false;
            }
        }
    }
}
