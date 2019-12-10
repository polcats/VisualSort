var CONTAINER_WIDTH = 600;
var TOTAL_ELEMENTS = 10;

var container = document.getElementById("bars");
function clearContainer() {
    container.innerHTML = "";
}

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

insertBars();

function reset() {
    disableButtons(false);
    container.innerHTML = "";
    insertBars();
}

function getHeight(elem) {
    try {
        var h = parseInt(elem.style.height, 10);
    } catch (e) {
        h = 0;
    }

    // console.log(h);
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

function disableButtons(what = true) {
    $(".sort").attr("disabled", what);
}

var bars = document.getElementsByClassName("bar");
function bubbleSort() {
    disableButtons();
    var delay = document.getElementById("delay").value;
    var compareDelay = delay / 2;
    var outerDelay = delay * TOTAL_ELEMENTS;

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
                        }, delay * j);
                    })(j);
                }
            }, outerDelay * i);
        })(i);
    }
}

function selectionSort() {
    disableButtons();
    var delay = document.getElementById("delay").value;
    var outerDelay = delay * TOTAL_ELEMENTS;
    for (i = 0; i < TOTAL_ELEMENTS; i++) {
        var currentMaxIndex = i;
        (function(i) {
            setTimeout(function() {
                // console.log("i = " + i + " : " + getHeight(bars[i]));
                if (TOTAL_ELEMENTS - 1 != i) {
                    $(bars[i]).addClass("red");
                }

                for (j = i + 1; j < TOTAL_ELEMENTS; j++) {
                    outerDelay = delay * (TOTAL_ELEMENTS - i);
                    var innerDelay = outerDelay / (TOTAL_ELEMENTS - j);

                    (function(j) {
                        setTimeout(function() {
                            // console.log("--- j = " + j + " : " + getHeight(bars[j]));
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
                    .removeClass("red");
                if (shouldSwap(bars[i - 1], bars[currentMaxIndex])) {
                    // console.log(
                    //     "swapping : " +
                    //         (i - 1) +
                    //         " and " +
                    //         currentMaxIndex +
                    //         " values: " +
                    //         getHeight(bars[i - 1]) +
                    //         " < " +
                    //         getHeight(bars[currentMaxIndex])
                    // );
                    $(bars[i - 1]).swap(bars[currentMaxIndex]);
                }
                // bars = document.getElementsByClassName("bar");
            }, outerDelay * (i + 1));
        })(i);
    }
}
