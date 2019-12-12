(function init() {
    updateDelay();
    updateElements();
})();

function updateDelay() {
    DELAY = document.getElementById("delay").value;
    document.getElementById("delay-count").innerHTML = DELAY;
}

function updateElements() {
    clearContainer();
    TOTAL_ELEMENTS = document.getElementById("elements").value;
    document.getElementById("element-count").innerHTML = TOTAL_ELEMENTS;
    insertBars();
}

function insertBars() {
    const width = CONTAINER_WIDTH / TOTAL_ELEMENTS;

    // generate unique values
    var set = new Set();
    while (set.size < TOTAL_ELEMENTS) {
        set.add(Math.round(Math.random() * 99) + 1);
    }

    // generate bars
    const arr = Array.from(set);
    for (i = 0; i < arr.length; ++i) {
        let bar = document.createElement("div");
        bar.setAttribute("class", "bar");
        bar.setAttribute("style", "width: " + width + "px; height: " + arr[i] + "%;");
        bar.innerHTML = arr[i];
        container.appendChild(bar);
    }
}

function disableInput(what = true) {
    $("#reset").addClass("green");
    $(".sort").removeClass("green");
    $(".sort").attr("disabled", what);
    $(".slider-input").attr("disabled", what);
}

function clearContainer() {
    container.innerHTML = "";
}
