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
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = require("./swagger");
var OriginType;
(function (OriginType) {
    OriginType["SwaggerV3"] = "SwaggerV3";
    OriginType["SwaggerV2"] = "SwaggerV2";
    OriginType["SwaggerV1"] = "SwaggerV1";
})(OriginType = exports.OriginType || (exports.OriginType = {}));
function readRemoteDataSource(config, report) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (config.originType) {
            case OriginType.SwaggerV3: {
                return new swagger_1.SwaggerV3Reader(config, report).fetchRemoteData();
            }
            case OriginType.SwaggerV2: {
                return new swagger_1.SwaggerV2Reader(config, report).fetchRemoteData();
            }
            default:
                return new swagger_1.SwaggerV2Reader(config, report).fetchRemoteData();
        }
    });
}
exports.readRemoteDataSource = readRemoteDataSource;
//# sourceMappingURL=index.js.map