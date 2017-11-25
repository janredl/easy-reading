// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var swiper = new Swiper('.swiper-container', {});

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

var sentences;
readSentences();
createSentenceList();

// about
$$('.about').on('click', function () {
    myApp.alert('Easy Reading 1.0 <br> author: Jan Redl <br> jan@redl.eu', "About");
});

$$('.next-word').on('click', function () {
    swiper.slideNext();
});  

$$('#sentence-add').on('click', function () {
    window.location.href = "edit.html"
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    
});

function readSentences() {
    var data = localStorage.getItem("sentences");
    if (data) {
        sentences = JSON.parse(data);
    }
}

function storeSentences() {
    var data = JSON.stringify(sentences)
    localStorage.getItem("sentences", data);
}

function createSentenceList() {

    var itemTemplate = '<div class = "item-content">\
        <div class = "item-inner">\
            <div class = "item-title label">\
                <a href="#">{title}</a>\
                <i class="material-icons edit-sentence">edit</i>\
                <i class="material-icons delete-sentence">delete</i>\
            </div>\
        </div>\
    </div>';

    var addTemplate = '<div class = "item-content">\
        <div class = "item-media">\
            <a href="#" id="sentence-add"><i class="material-icons">add_box</i></a>\
        </div>\
    </div>';

    for (key in sentences) {
        item = sentences[key];
        itemHtml = itemTemplate.replace(/{title}/g, item[title]);
        $$("#sentences").append(itemHtml);
    }
    $$("#sentences").append(addTemplate);
}


