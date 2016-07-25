// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
// var settings = new Store("settings", {
//      "sample_setting": "This is how you use Store.js to remember values"
// });

var jsonReceipt = null;

debugger;


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        debugger;
        chrome.browserAction.setIcon({path: '../../icons/logo32.png'});
        jsonReceipt = request;
        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");
    });
