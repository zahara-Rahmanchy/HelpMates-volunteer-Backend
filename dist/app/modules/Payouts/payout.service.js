"use strict";
/**
 * 1: get the token from paypal and for that the secret and client id is needed
 * 2: get users from the req body(user email)
 * 3: the admin email will be from the req.user
 * 4: Admin can select all the emails and respective volunteer's stipend amount
 *    and sent the payout at once.
 *
 */
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
exports.PayoutServices = void 0;
const axios_1 = __importDefault(require("axios"));
const payout_utils_1 = require("./payout.utils");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// get the access token
const baseURL = process.env.PAYPAL_BASE_URL;
const sendPayouts = (payments) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("payments: ", payments);
    const sender_batch_id = `batch_${Date.now()}`;
    const volunteerApps = yield prisma_1.default.volunteerApplication.findMany({
        where: {
            id: { in: payments.map(a => a.volunteerApplicationId) },
        },
        include: {
            user: {
                select: { id: true, paypalEmail: true, name: true },
            },
            opportunity: {
                select: { title: true, stipend: true },
            },
        },
    });
    // 2️⃣ Prepare PayPal payload items
    const payoutItems = volunteerApps.map(app => ({
        recipient_type: "EMAIL",
        amount: {
            value: app.opportunity.stipend.toFixed(2),
            currency: "USD",
        },
        receiver: app.user.paypalEmail,
        note: `Payment for volunteering: ${app.opportunity.title}`,
        sender_item_id: app.id,
    }));
    const payload = {
        sender_batch_header: {
            sender_batch_id,
            email_subject: "Payment Received for Your Contribution",
            email_message: "Thank you for your valuable contribution to volunteering service!",
        },
        items: payoutItems,
    };
    let paypalResult;
    try {
        const access_token = yield (0, payout_utils_1.getAccessToken)();
        const response = yield axios_1.default.post(`${baseURL}/v1/payments/payouts`, payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
        });
        paypalResult = response.data;
        console.log("PayPal Response:", paypalResult);
    }
    catch (error) {
        console.error("PayPal Error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw error;
    }
    // 3️⃣ Insert payouts into DB
    try {
        const insertPayouts = yield prisma_1.default.payout.createMany({
            data: volunteerApps.map((app, index) => ({
                volunteerApplicationId: app.id,
                userId: app.user.id,
                amount: app.opportunity.stipend,
                senderbatchId: sender_batch_id,
                senderItemId: payload.items[index].sender_item_id,
                payoutbatchId: paypalResult.batch_header.payout_batch_id,
                status: paypalResult.batch_header.batch_status,
            })),
        });
        console.log("Inserted payouts:", insertPayouts);
        return insertPayouts;
    }
    catch (error) {
        console.error("DB Insert Error:", error);
        throw error;
    }
});
const getPayoutsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payout.findMany({
        include: {
            volunteerApplication: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            contactNumber: true
                        }
                    },
                    opportunity: {
                        select: {
                            title: true,
                            organization: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return result;
});
// webhook url to get payout status updates: 
const handleWebhookEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { event_type, resource } = event;
    const senderItemId = (_b = resource === null || resource === void 0 ? void 0 : resource.payout_item) === null || _b === void 0 ? void 0 : _b.sender_item_id;
    console.log("event_type:", event_type, "\nsenderItemId:", senderItemId);
    console.log("event_type: ", event_type, "\nresoourse: ", resource);
    if (!(resource === null || resource === void 0 ? void 0 : resource.sender_item_id))
        return;
    if (event_type === "PAYMENT.PAYOUTS-ITEM.SUCCEEDED") {
        yield prisma_1.default.payout.updateMany({
            where: { senderItemId: senderItemId },
            data: { status: "SUCCESS", transactionId: resource.transaction_id, updatedAt: new Date() },
        });
    }
    else if (event_type === "PAYMENT.PAYOUTS-ITEM.FAILED") {
        yield prisma_1.default.payout.updateMany({
            where: { senderItemId: senderItemId },
            data: { status: "FAILED", updatedAt: new Date() },
        });
    }
});
exports.PayoutServices = {
    sendPayouts,
    getPayoutsFromDB,
    handleWebhookEvent
};
