// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

var swiper = new Swiper('.swiper-container', {});

var upperState = false;
var currentSentence = '';

var sentences = {};
readSentences();
createSentenceList();
initSentenceListEvents();

initMainText();

// about
$$('.about').on('click', function () {
    myApp.alert('Easy Reading 1.0 <br> author: Jan Redl <br> jan@redl.eu', "About");
});

// $$('.sentence-next').on('click', function () {
//     swiper.slideNext();
// });

// $$('.sentence-prev').on('click', function () {
//     swiper.slideNext();
// });  

$$('#edit-submit').on('click', processPopup);
$$('#edit-delete').on('click', processPopupDelete);

$$('#sentence-add').on('click', function () {
    var uniqid = Date.now();
    $$('#sentence-form-uniqid').val(uniqid);
    $$('#sentence-form-title').val('');
    $$('#sentence-form-text').val('');
    myApp.popup('.popup-edit');
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

setInterval(checkUpperCase, 100);

//---------------------------------------

function processPopupDelete() {
    var formData = myApp.formToJSON('#sentence-form');
    myApp.closeModal('.popup-edit');
    var uniqid = formData.uniqid;
    delete formData.uniqid;
    delete sentences.uniqid;
    deleteFromSentenceList(uniqid);   
}

function processPopup() {
    var formData = myApp.formToJSON('#sentence-form');
    myApp.closeModal('.popup-edit');
    var uniqid = formData.uniqid;
    delete formData.uniqid;
    delete sentences.uniqid;
    deleteFromSentenceList(uniqid);
    if (!formData['text']) {
        return;
    }
    if (!formData['title']) {
        var words = formData['text'].split(/\s+/);
        var firstWords = words.slice(0, 3);
        formData['title'] = firstWords.join(' ');
    }
    uniqid = Date.now();
    sentences[uniqid] = formData;
    saveSentences();
    addToSentenceList(uniqid, formData);
    initSentenceListEvents();
    sentenceToMainText(formData['text']);
}

function checkUpperCase() {
    u = $$("#upper-case").prop('checked');
    if (upperState != u) {
        upperState = u;
        sentenceToMainText(currentSentence);
    }
}

function initSentenceListEvents() {

    $$('.sentence-edit').on('click', function (e) {
        var target = e.target;
        var uniqid = $$(target).data('uniqid');
        var formData = sentences[uniqid];
        $$('#sentence-form-uniqid').val(uniqid);
        $$('#sentence-form-title').val(sentences[uniqid]['title']);
        $$('#sentence-form-text').val(sentences[uniqid]['text']);
        myApp.popup('.popup-edit');
    });

    $$('.sentence-open').on('click', function (e) {
        var target = e.target;
        var uniqid = $$(target).data('uniqid');
        var sentence = sentences[uniqid]['text'];
        sentenceToMainText(sentence);
    });
}

function readSentences() {
    var data = localStorage.getItem("sentences");
    if (data) {
        sentences = JSON.parse(data);
    }
}

function saveSentences() {
    var data = JSON.stringify(sentences)
    localStorage.setItem("sentences", data);
}

function createSentenceList() {

    var addTemplate = '<div class="item-content" id="add-to-list">\
        <div class = "item-media">\
            <a href="#" id="sentence-add"><i class="material-icons">add_box</i></a>\
        </div>\
    </div>';

    for (key in sentences) {
        data = sentences[key];
        var itemHtml = createListItem(key, data)
        $$("#sentences").append(itemHtml);
    }
    $$("#sentences").append(addTemplate);
}

function deleteFromSentenceList(uniqid) {
    $$("#item" + uniqid).remove();    
}

function addToSentenceList(key, data) {
    var itemHtml = createListItem(key, data);
    $$("#sentences").prepend(itemHtml);
}

function createListItem(key, data) {
    var itemTemplate = '<div class="item-content" id="item{uniqid}">\
        <div class="item-inner">\
            <div class="item-title label">\
                <a href="#" class="sentence-open" data-uniqid="{uniqid}">{title}</a>\
            </div>\
            <div class="item-input">\
                <a href="#" class="sentence-edit"><i class="material-icons edit-sentence" data-uniqid="{uniqid}">edit</i></a>\
            </div>\
        </div>\
    </div>'; 

    var itemHtml = itemTemplate.replace(/{title}/g, data.title).replace(/{uniqid}/g, key);
    return itemHtml;  
}

function sentenceToMainText(sentence) {
    currentSentence = sentence;
    var upperCase = $$("#upper-case").prop('checked');
    if (upperCase) {
        sentence = sentence.toUpperCase();
    }
    var words = sentence.split(/\s+/);

    var itemTemplate = '<div class="swiper-slide big-text">{word}</div>';

    swiper.removeAllSlides();    

    for (i in words) {
        word = words[i];
        var itemHtml = itemTemplate.replace(/{word}/g, word);
        swiper.appendSlide(itemHtml);
    }
    swiper.slideTo(0);
}

function initMainText() {
    var uniqid = Object.keys(sentences)[0];
    if (uniqid) {
        sentence = sentences[uniqid]['text'];
    } else {
        sentence = "Helo! How are you?";
    }
    sentenceToMainText(sentence);
}

function truncate(string){
   var maxlen = 10;
   if (string.length > maxlen)
      return string.substring(0,maxlen)+'...';
   else
      return string;
};
