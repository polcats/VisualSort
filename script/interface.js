// Initialize
LoadUrlParams();

function LoadUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const elements = parseInt(urlParams.get("elements"));
    var error = false;

    if (urlParams.has("delay")) {
        const delay = parseInt(urlParams.get("delay"));
        if (delay > 0 && delay <= 100) {
            DELAY = delay;
            document.getElementById("delay").value = DELAY;
        } else {
            error = true;
        }
    }

    if (urlParams.has("elements")) {
        if (elements >= 5 && elements <= 30) {
            TOTAL_ELEMENTS = elements;
            document.getElementById("elements").value = TOTAL_ELEMENTS;
        } else {
            error = true;
        }
    }

    if (error) {
        alert("Unable to load some parameters!");
    }

    updateDelay();
    updateElements();
}

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
        set.add(Math.round(Math.random() * 89) + 10);
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

function reset() {
    window.location.href = "index.html?delay=" + DELAY + "&elements=" + TOTAL_ELEMENTS;
}
