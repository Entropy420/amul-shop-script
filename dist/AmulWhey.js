"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
var promises_1 = require("fs/promises");
var path = require("path");
// reads the config file and return the parsed json(promise)
function configReader() {
    return __awaiter(this, void 0, void 0, function () {
        var rawData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readFile)(path.join(__dirname, "..", "config.json"), "utf-8")];
                case 1:
                    rawData = _a.sent();
                    return [2 /*return*/, JSON.parse(rawData)];
            }
        });
    });
}
// fills the pin code, and runs a loop to see if products(from config file) are in stock or not
(function () { return __awaiter(void 0, void 0, void 0, function () {
    function checkStock(link) {
        return __awaiter(this, void 0, void 0, function () {
            var addToCartButton, isDisabled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.goto(link)];
                    case 1:
                        _a.sent();
                        addToCartButton = page.locator("a", { hasText: /add to cart/i });
                        return [4 /*yield*/, addToCartButton.getAttribute("disabled")];
                    case 2:
                        isDisabled = _a.sent();
                        if (isDisabled == "true") {
                            return [2 /*return*/, false];
                        }
                        else
                            return [2 /*return*/, true];
                        return [2 /*return*/];
                }
            });
        });
    }
    var dataJson, pinCode, listOfLinks, browser, page, _i, listOfLinks_1, _a, name_1, link;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, configReader()];
            case 1:
                dataJson = _b.sent();
                pinCode = dataJson.pinCode;
                listOfLinks = dataJson.productsLinks;
                return [4 /*yield*/, test_1.chromium.launch()];
            case 2:
                browser = _b.sent();
                return [4 /*yield*/, browser.newPage()];
            case 3:
                page = _b.sent();
                return [4 /*yield*/, page.goto("https://shop.amul.com/en/browse/protein")];
            case 4:
                _b.sent();
                return [4 /*yield*/, page.locator("#search").fill(pinCode)];
            case 5:
                _b.sent();
                return [4 /*yield*/, page.locator("#automatic").waitFor({ state: "visible" })];
            case 6:
                _b.sent();
                return [4 /*yield*/, page.getByRole("button").filter({ hasText: pinCode }).click()];
            case 7:
                _b.sent();
                _i = 0, listOfLinks_1 = listOfLinks;
                _b.label = 8;
            case 8:
                if (!(_i < listOfLinks_1.length)) return [3 /*break*/, 11];
                _a = listOfLinks_1[_i], name_1 = _a.name, link = _a.link;
                return [4 /*yield*/, checkStock(link)];
            case 9:
                if (_b.sent()) {
                    console.log("".concat(name_1, " is IN stock"));
                }
                else {
                    console.log("".concat(name_1, " is NOT in stock"));
                }
                _b.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 8];
            case 11: return [4 /*yield*/, browser.close()];
            case 12:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); })();
