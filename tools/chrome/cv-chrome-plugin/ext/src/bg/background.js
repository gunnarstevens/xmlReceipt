// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
// var settings = new Store("settings", {
//      "sample_setting": "This is how you use Store.js to remember values"
// });

// chrome.browserAction.setTitle('TITLE');

console.log("Start background.js");

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        chrome.browserAction.setIcon({path: '../../icons/logo32.png'});
        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "hello")
        sendResponse({farewell: "goodbye"});
    });
