var WORDS_FROM_SERVER = [];
var WORDS_TO_SEND = [];
var TYPE, PREV_TYPE;
var COUNTER = 0;
var TYPE1_URL = 'http://localhost/intelliFont/server/begining.php';
var TYPE2_URL = 'http://localhost/intelliFont/server/next.php';
var TYPE3_URL = 'http://localhost/intelliFont/server/nextx2.php';


$('#input').on('change paste keyup', function () {
    var inputString = $(this).val();
    var lastChar = inputString.split('');
    var words = getWord(inputString, lastChar[lastChar.length - 1]);
    console.log(`word: ${WORDS_TO_SEND[0]} | prev_word: ${WORDS_TO_SEND[1]}`);
    if (inputString === '') COUNTER = 0;
    if ((words.toString() !== WORDS_TO_SEND.toString() && TYPE !== PREV_TYPE) ||
        (words.toString() === WORDS_TO_SEND.toString() && TYPE !== PREV_TYPE) ||
        (words.toString() !== WORDS_TO_SEND.toString() && TYPE === PREV_TYPE)) {
        if (words[0] !== undefined) {
            WORDS_TO_SEND = words;
            PREV_TYPE = TYPE;
            sendWord();
        }
    }

    // HERE GOES predict() FUNCTION
});

window.addEventListener('load', function () {
    document.getElementById("input").focus();
});

// FUNCTIONS

// Refresh list of suggestions
function refreshSuggestions() {
    $('#predictions').html('');
    for (let i = 0; i < WORDS_FROM_SERVER.length; i++) {
        $('#predictions').append(`<div>${WORDS_FROM_SERVER[i]}</div>`);
    }
}

// Send word/words to server 
function sendWord() {
    var url;
    var dataToSend = {
        'word': WORDS_TO_SEND[0],
        'prev_word': WORDS_TO_SEND[1]
    }
    switch (TYPE) {
        case 1:
            url = TYPE1_URL;
            break;
        case 2:
            url = TYPE2_URL;
            break;
        case 3:
            url = TYPE3_URL;
            break;
    }
    $.ajax({
        type: "POST",
        dataType: "json",
        crossDomain: true,
        url: url,
        // data: JSON.stringify(dataToSend),
        data: dataToSend,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        },
        success: function (result) {
            console.log(result);
            WORDS_FROM_SERVER = result;
            refreshSuggestions();
        }
    });
}

// get word/words from input box
function getWord(string, lastChar) {
    let tmpSentence = string.split('.');
    let tmpArray = tmpSentence[tmpSentence.length - 1].split(' ');
    let tmpChar = '';
    let tmpCharPrev = '';
    for (let i = 0; i < tmpArray.length; i++) {
        tmpArray[i] = tmpArray[i].replace(/[^a-zA-Z0-9]/g, '')
    }
    tmpArray.remove('');
    if (tmpArray.length !== 0) {
        tmpChar = tmpArray[tmpArray.length - 1].split('');
    }
    if (tmpArray.length > 1) {
        tmpCharPrev = tmpArray[tmpArray.length - 2].split('');
    }
    function isWordCompleted(string) {
        if (lastChar === ' ' || lastChar === '.') {
            return true;
        } else {
            return false;
        }
    }
    function isBeginning(string) {
        if (tmpChar[tmpChar.length - 1] === '.' || tmpArray.length === 1 || tmpCharPrev[tmpCharPrev.length - 1] === '.' || tmpArray.length === 2 && lastChar !== ' ') {
            return true;
        } else {
            return false;
        }
    }
    if (isBeginning(string)) {
        if (!isWordCompleted(string) && tmpArray.length === 1) {
            data = [tmpArray[tmpArray.length - 1]];
            TYPE = 1;
        } else if (isWordCompleted(string) && tmpArray.length === 1) {
            data = [tmpArray[tmpArray.length - 1]];
            TYPE = 2;
        } else {
            data = [tmpArray[tmpArray.length - 2]];
            TYPE = 2;
        }
    } else {
        if (tmpArray.length < 3 || isWordCompleted(string)) { // TODO! Treba da se menja na space a ne samo kada krene korisnik da pise rec if (lastChar = ' ')
            data = [tmpArray[tmpArray.length - 1], tmpArray[tmpArray.length - 2]];
        } else if (!isWordCompleted(string)) {
            data = [tmpArray[tmpArray.length - 2], tmpArray[tmpArray.length - 3]];
        }
        TYPE = 3;
    }
    // console.log('isBeginning: ' + isBeginning(string) + ', isWordCompleted: ' + isWordCompleted(string) + ', lastChar: ' + lastChar + ', tmpArrayLength: ' + tmpArray.length);
    return data;
}

// Extending Array class to remove specific character
Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};