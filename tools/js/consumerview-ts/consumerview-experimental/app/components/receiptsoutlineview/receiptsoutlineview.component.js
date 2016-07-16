System.register(['@angular/core', '../../services/receipts.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, receipts_service_1;
    var ReceiptsOutlineViewComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (receipts_service_1_1) {
                receipts_service_1 = receipts_service_1_1;
            }],
        execute: function() {
            ReceiptsOutlineViewComponent = (function () {
                function ReceiptsOutlineViewComponent(receiptsService) {
                    this.receiptsService = receiptsService;
                }
                ReceiptsOutlineViewComponent.prototype.ngOnInit = function () {
                    this.receipts = this.receiptsService.getReceipts();
                };
                ReceiptsOutlineViewComponent.prototype.getReceipts = function () {
                    return this.receipts;
                };
                ReceiptsOutlineViewComponent.prototype.onSelect = function (hero) { this.selectedHero = hero; };
                ReceiptsOutlineViewComponent = __decorate([
                    core_1.Component({
                        moduleId: module.id,
                        selector: 'cw-receiptsoutlineview',
                        templateUrl: 'receiptsoutlineview.component.html',
                        styleUrls: ['receiptsoutlineview.component.css'],
                        providers: [receipts_service_1.ReceiptsService]
                    }), 
                    __metadata('design:paramtypes', [receipts_service_1.ReceiptsService])
                ], ReceiptsOutlineViewComponent);
                return ReceiptsOutlineViewComponent;
            }());
            exports_1("ReceiptsOutlineViewComponent", ReceiptsOutlineViewComponent);
        }
    }
});
