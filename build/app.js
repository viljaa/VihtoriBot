var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./classes/bot-core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* Imports */
    var bot_core_1 = __importDefault(require("./classes/bot-core"));
    /* Bot configuration */
    var bot = new bot_core_1.default;
    /* Run the bot */
    bot.activate().then(function () {
        console.log('Succesfully logged in, Vihtori Bot is active!');
    }).catch(function (error) {
        console.log(error);
    });
});
