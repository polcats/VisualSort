(function init() {
    updateSpeed();
    updateElements();
    showDetails();
})();

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
