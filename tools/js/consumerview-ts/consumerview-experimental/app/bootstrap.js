System.register(['angular2/platform/browser', "./components/app.component", './services/receipts.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var browser_1, app_component_1, receipts_service_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (receipts_service_1_1) {
                receipts_service_1 = receipts_service_1_1;
            }],
        execute: function() {
            // load the main angular component
            // bootstrap(AppComponent);
            browser_1.bootstrap(app_component_1.AppComponent, [receipts_service_1.ReceiptsService]);
        }
    }
});
