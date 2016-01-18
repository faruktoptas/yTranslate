// ==UserScript==
// @name        yTranslate
// @namespace   yTranslate
// @description Translate selected text inside the page with a tooltip via Yandex Translate. Hold <b>Alt</b> key while selecting text.
// @include        http://*
// @include        https://*
// @include        file://*
// @license     MIT
// @version     1.0.0
// @grant       none
// ==/UserScript==
if (document.body) {
    var altPressed = false;
    var cursorX;
    var cursorY;
    var apiKey = "trnsl.1.1.20150711T123630Z.c8affac8a4d1daed.557bb6fbec827dd91be749d4da5db930e2266ff2";
    var lang = "en-tr";
    var apiUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key='+ apiKey + '&lang='+ lang + '&text=';
    main = function () {
        function createUI(text){
            var yTranslatePopupDiv = document.getElementById('yTranslatePopupDiv');
            if (yTranslatePopupDiv === null) {
                yTranslatePopupDiv = document.createElement('div');
            }
            yTranslatePopupDiv.id = 'yTranslatePopupDiv';
            yTranslatePopupDiv.style.fontSize = "1.8em";
            yTranslatePopupDiv.style.color="#ffffff";
            yTranslatePopupDiv.style.textalign="left";
            yTranslatePopupDiv.style.right="20%";
            yTranslatePopupDiv.style.width="60%";
            yTranslatePopupDiv.style.margin="auto";
            yTranslatePopupDiv.style.top="20%";
            yTranslatePopupDiv.style.border="1px solid #DCA";
            yTranslatePopupDiv.style.background="#000000";
            yTranslatePopupDiv.style.opacity="0.7";
            yTranslatePopupDiv.style.borderRadius = "6px";
            yTranslatePopupDiv.style.boxShadow = "5px 5px 8px #CCC";
            yTranslatePopupDiv.style.position="fixed";
            yTranslatePopupDiv.style.zIndex = "99999";
            yTranslatePopupDiv.style.padding="20px";
            yTranslatePopupDiv.style.display = "inline";

            document.getElementsByTagName('body') [0].appendChild(yTranslatePopupDiv);
            yTranslatePopupDiv.innerHTML = text;

        }
        
         function jsonp(url, callback) {
            var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
             console.log("1");
            window[callbackName] = function(data) {
                delete window[callbackName];
                document.body.removeChild(script);
                callback(data);
            };

            var script = document.createElement('script');
             script.onerror = function(err){
                 alert("This page does not allow to connect translate API!");
             }
            script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
            document.body.appendChild(script);
        }
        
        function parseJs(resp) {
            var result = JSON.parse(resp);
            if (result.code == 200) {
                var text = result.text;
                createUI(text);
            }
        }
        document.addEventListener('mouseup', function (event) {
            selected = window.getSelection().toString();
            if (selected.length > 0 && event.altKey) {
                jsonp(apiUrl + selected, function(data) {
                   parseJs(JSON.stringify(data));
                });
            }
        });
        document.addEventListener("mousedown", function(event){
            var yTranslatePopupDiv = document.getElementById("yTranslatePopupDiv");
            if (yTranslatePopupDiv !== null){
                yTranslatePopupDiv.style.display = "none";
            }
        });
    };
    main();
}
