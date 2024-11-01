"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsyncErrors = void 0;
const catchAsyncErrors = (thefunction) => {
    return (req, res, next) => {
        Promise.resolve(thefunction(req, res, next)).catch(next);
    };
};
exports.catchAsyncErrors = catchAsyncErrors;
