"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepsEnum = void 0;
const mongoose_1 = require("mongoose");
var StepsEnum;
(function (StepsEnum) {
    StepsEnum["CompanyInfo"] = "companyInfo";
    StepsEnum["ChoosePlan"] = "choosePlan";
    StepsEnum["Finish"] = "finish";
})(StepsEnum = exports.StepsEnum || (exports.StepsEnum = {}));
const clientSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, 'Please enter a valid phone number']
    },
    steps: {
        type: String,
        enum: Object.values(StepsEnum),
    },
    companies: {
        type: { type: String },
        name: String,
        quantity: Number,
        address: String,
        subDomain: String,
        subsidiaries: [
            {
                name: String,
                package: String,
                quantity: Number,
                address: String,
                subDomain: String,
            }
        ] // ✅ No need for `?`, Mongoose handles optional fields
    },
    connection: [
        { companyName: String, subDomain: String, db: String }
    ],
    paid: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Number,
        default: Date.now
    }
});
const Client = (0, mongoose_1.model)('Client', clientSchema);
exports.default = Client;
