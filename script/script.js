var CONTAINER_WIDTH = 600;
var container = document.getElementById("bars");
function clearContainer() {
    container.innerHTML = "";
}

var TOTAL_ELEMENTS = 9;
function insertBars() {
    var width = CONTAINER_WIDTH / TOTAL_ELEMENTS;

    for (i = 0; i < TOTAL_ELEMENTS; ++i) {
        var height = Math.round(Math.random() * 89) + 10;
        var bar = document.createElement("div");
        bar.setAttribute("class", "bar");
        bar.setAttribute("style", "width: " + width + "px; height: " + height + "%;");
        bar.innerHTML = height;
        container.appendChild(bar);
    }
}
insertBars();

function reset() {
    window.location.reload();
}

// from https://stackoverflow.com/questions/10716986/swap-2-html-elements-and-preserve-event-listeners-on-them?lq=1
function swapElements(obj1, obj2) {
    // save the location of obj2
    var parent2 = obj2.parentNode;
    var next2 = obj2.nextSibling;
    // special case for obj1 is the next sibling of obj2
    if (next2 === obj1) {
        // just put obj1 before obj2
        parent2.insertBefore(obj1, obj2);
    } else {
        // insert obj2 right before obj1
        obj1.parentNode.insertBefore(obj2, obj1);

        // now insert obj1 where obj2 was
        if (next2) {
            // if there was an element after obj2, then insert obj1 right before that
            parent2.insertBefore(obj1, next2);
        } else {
            // otherwise, just append as last child
            parent2.appendChild(obj1);
        }
    }
}

function getHeight(elem) {
    return parseInt(elem.style.height.replace("%", ""), 10);
}

function shouldSwap(elem1, elem2) {
    try {
        return getHeight(elem1) < getHeight(elem2);
    } catch (e) {
        return false;
    }
}

function disableButtons() {
    $(".sort").attr("disabled", true);
}

var bars = document.getElementsByClassName("bar");
function bubbleSort() {
    disableButtons();
    var delay = 300;
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
                                swapElements(rightElement, leftElement);
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
    var delay = 300;
    var outerDelay = delay * TOTAL_ELEMENTS;
    for (i = 0; i < TOTAL_ELEMENTS; i++) {
        var currentMaxIndex = i;
        (function(i) {
            setTimeout(function() {
                if (TOTAL_ELEMENTS - 1 != i) {
                    $(bars[i]).addClass("red");
                }

                for (j = i + 1; j < TOTAL_ELEMENTS; j++) {
                    outerDelay = delay * (TOTAL_ELEMENTS - i);
                    var innerDelay = outerDelay / (TOTAL_ELEMENTS - j);
                    $(bars[i])
                        .wait(outerDelay)
                        .removeClass("red");

                    (function(j) {
                        setTimeout(function() {
                            $(bars[j]).addClass("compared");

                            if (getHeight(bars[j]) > getHeight(bars[currentMaxIndex])) {
                                currentMaxIndex = j;
                            }

                            $(bars[j])
                                .wait(delay)
                                .removeClass("compared");
                        }, innerDelay / 2);
                    })(j);
                }
                if (shouldSwap(bars[i - 1], bars[currentMaxIndex])) {
                    swapElements(bars[i - 1], bars[currentMaxIndex]);
                }
            }, outerDelay * i);
        })(i);
    }
}
