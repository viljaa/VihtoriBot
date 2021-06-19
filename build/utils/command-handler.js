(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.commandHandler = void 0;
    /* Function for providing different fucntionality based on commands received */
    function commandHandler(message) {
        var _a;
        // Remove prefix from the command and initialize variable with the value
        var command = message.content.slice(2);
        /* Example command, Vihtori greeter! */
        if (command === 'greet') {
            var user = (_a = message.member) === null || _a === void 0 ? void 0 : _a.displayName;
            message.channel.send('Hello, ' + user + '! May Vihtori be victorious!');
        }
    }
    exports.commandHandler = commandHandler;
});
