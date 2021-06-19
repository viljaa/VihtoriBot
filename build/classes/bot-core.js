var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "discord.js", "dotenv", "../utils/command-handler"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* Imports */
    var discord_js_1 = require("discord.js");
    var dotenv = __importStar(require("dotenv"));
    var command_handler_1 = require("../utils/command-handler");
    /* Import configuration */
    dotenv.config();
    /* Bot configuration */
    var Bot = /** @class */ (function () {
        function Bot() {
            this.token = process.env.BOT_TOKEN;
            this.client = new discord_js_1.Client;
            this.prefix = '!!';
        }
        /* Function that runs the bot and activates it to receive commands */
        Bot.prototype.activate = function () {
            var _this = this;
            /* Command handler for incoming commands */
            this.client.on('message', function (message) {
                if (message.content.startsWith(_this.prefix))
                    command_handler_1.commandHandler(message);
            });
            return this.client.login(this.token);
        };
        return Bot;
    }());
    exports.default = Bot;
});
