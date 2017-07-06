var availableWords = [];
function split(val) {
    return val.split(/\s*[\s]\s*/);
}
function extractLast(term) {
    return split(term).pop();
}

$("#input").autocomplete({
    minLength: 0,
    source: function (request, response) {
        // delegate back to autocomplete, but extract the last term
        response($.ui.autocomplete.filter(availableWords, extractLast(request.term)));
    },
    // source: function (request, response) {
    //     $.getJSON("search.php", {
    //         term: extractLast(request.term)
    //     }, response);
    // },
    focus: function () {
        // prevent value inserted on focus
        return false;
    },
    select: function (event, ui) {
        var terms = split(this.value);
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push(ui.item.value);
        // add placeholder to get the comma-and-space at the end
        // terms.push("");
        this.value = terms.join(" ");
        return false;
    }
});