const CONTAINER_WIDTH = 600;
var TOTAL_ELEMENTS = document.getElementById("elements").value;
var DELAY = document.getElementById("delay").value;
var container = document.getElementById("bars");
var bars = document.getElementsByClassName("bar");

function insertBars() {
    const width = CONTAINER_WIDTH / TOTAL_ELEMENTS;

    // generate unique values
    var set = new Set();
    while (set.size < TOTAL_ELEMENTS) {
        set.add(Math.round(Math.random() * 89) + 10);
    }

    // generate bars
    var arr = Array.from(set);
    for (i = 0; i < arr.length; ++i) {
        let bar = document.createElement("div");
        bar.setAttribute("class", "bar");
        bar.setAttribute("style", "width: " + width + "px; height: " + arr[i] + "%;");
        bar.innerHTML = arr[i];
        container.appendChild(bar);
    }
}

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

function disableInput(what = true) {
    $(".sort").attr("disabled", what);
    $(".slider-input").attr("disabled", what);
}

function clearContainer() {
    container.innerHTML = "";
}

function reset() {
    window.location.href = "index.html?delay=" + DELAY + "&elements=" + TOTAL_ELEMENTS;
}

function getHeight(elem) {
    try {
        var h = parseInt(elem.style.height, 10);
    } catch (e) {
        h = 0;
    }
    return h;
}

function shouldSwap(elem1, elem2) {
    try {
        return getHeight(elem1) < getHeight(elem2);
    } catch (e) {
        return false;
    }
}

$.fn.swap = function(elem) {
    elem = elem.jquery ? elem : $(elem);
    return this.each(function() {
        $(document.createTextNode(""))
            .insertBefore(this)
            .before(elem.before(this))
            .remove();
    });
};

function bubbleSort() {
    disableInput();
    var compareDelay = DELAY / 2;
    var outerDelay = DELAY * TOTAL_ELEMENTS;

    for (i = 0; i < TOTAL_ELEMENTS; ++i) {
        (function(i) {
            setTimeout(function() {
                for (j = 0; j < TOTAL_ELEMENTS - i - 1; ++j) {
                    (function(j) {
                        setTimeout(function() {
                            var leftElement = bars[j];
                            var rightElement = bars[j + 1];

                            $(leftElement).addClass("compared");
                            $(rightElement).addClass("compared");

                            if (getHeight(rightElement) > getHeight(leftElement)) {
                                $(rightElement).swap(leftElement);
                            }
                            $(leftElement)
                                .wait(compareDelay)
                                .removeClass("compared");
                            $(rightElement)
                                .wait(compareDelay)
                                .removeClass("compared");
                        }, DELAY * j);
                    })(j);
                }
            }, outerDelay * i);
        })(i);
    }
}

function selectionSort() {
    disableInput();
    var outerDelay = DELAY * TOTAL_ELEMENTS;
    var innerDelay = outerDelay / TOTAL_ELEMENTS;
    for (i = 0; i < TOTAL_ELEMENTS; i++) {
        var currentMaxIndex = i;
        (function(i) {
            setTimeout(function() {
                $(bars[i]).addClass("compared");
                for (j = i + 1; j < TOTAL_ELEMENTS; j++) {
                    (function(j) {
                        setTimeout(function() {
                            $(bars[j]).addClass("compared");

                            if (getHeight(bars[j]) > getHeight(bars[currentMaxIndex])) {
                                currentMaxIndex = j;
                            }

                            $(bars[j])
                                .wait(innerDelay)
                                .removeClass("compared");
                        }, innerDelay);
                    })(j);
                }
                $(bars[i])
                    .wait(outerDelay)
                    .removeClass("compared");
                if (shouldSwap(bars[i - 1], bars[currentMaxIndex])) {
                    $(bars[i - 1]).swap(bars[currentMaxIndex]);
                } else {
                    currentMaxIndex = i;
                }
            }, outerDelay * (i + 1));
        })(i);
    }
}
