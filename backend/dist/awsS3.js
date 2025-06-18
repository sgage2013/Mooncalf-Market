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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const NAME_OF_BUCKET = process.env.AWS_BUCKET_NAME;
const multer_1 = __importDefault(require("multer"));
const s3 = new aws_sdk_1.default.S3({ apiVersion: "2006-03-01" });
const singlePublicFileUpload = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const { originalname, mimetype, buffer } = yield file;
    const path = require("path");
    const Key = new Date().getTime().toString() + path.extname(originalname);
    const uploadParams = {
        Bucket: NAME_OF_BUCKET,
        Key,
        Body: buffer,
        ACL: "public-read",
    };
    const result = yield s3.upload(uploadParams).promise();
    return result.Location;
});
const multiplePublicFileUpload = (files) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Promise.all(files.map((file) => {
        return singlePublicFileUpload(file);
    }));
});
const singlePrivateFileUpload = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const { originalname, mimetype, buffer } = yield file;
    const path = require("path");
    const Key = new Date().getTime().toString() + path.extname(originalname);
    const uploadParams = {
        Bucket: NAME_OF_BUCKET,
        Key,
        Body: buffer,
    };
    const result = yield s3.upload(uploadParams).promise();
    return result.Key;
});
const multiplePrivateFileUpload = (files) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Promise.all(files.map((file) => {
        return singlePrivateFileUpload(file);
    }));
});
const retrievePrivateFile = (key) => {
    let fileUrl;
    if (key) {
        fileUrl = s3.getSignedUrl("getObject", {
            Bucket: NAME_OF_BUCKET,
            Key: key,
        });
    }
    return fileUrl || key;
};
const storage = multer_1.default.memoryStorage();
const singleMulterUpload = (nameOfKey) => (0, multer_1.default)({ storage: storage }).single(nameOfKey);
const multipleMulterUpload = (nameOfKey) => (0, multer_1.default)({ storage: storage }).array(nameOfKey);
module.exports = {
    s3,
    singlePublicFileUpload,
    multiplePublicFileUpload,
    singlePrivateFileUpload,
    multiplePrivateFileUpload,
    retrievePrivateFile,
    singleMulterUpload,
    multipleMulterUpload,
};
//# sourceMappingURL=awsS3.js.map