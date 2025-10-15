/**
 * 1: get the token from paypal and for that the secret and client id is needed 
 * 2: get users from the req body(user email)
 * 3: the admin email will be from the req.user
 * 4: Admin can select all the emails and respective volunteer's stipend amount 
 *    and sent the payout at once.
 * 
 */

import axios from "axios";
import { IUserPaymentInfo } from "./payoutInterfaces";
import { getAccessToken } from "./payout.utils";
import prisma from "../../../shared/prisma";

// get the access token
const baseURL = process.env.PAYPAL_BASE_URL;

const sendPayouts = async(payments:IUserPaymentInfo[])=>{
    console.log("payments: ",payments)
    const sender_batch_id= `batch_${Date.now()}`
    const volunteerApps = await prisma.volunteerApplication.findMany({
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
    const access_token = await getAccessToken();
    const response = await axios.post(`${baseURL}/v1/payments/payouts`, payload, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });
    paypalResult = response.data;
    console.log("PayPal Response:", paypalResult);
  } catch (error: any) {
    console.error("PayPal Error:", error.response?.data || error.message);
    throw error;
  }

  // 3️⃣ Insert payouts into DB
  try {
    const insertPayouts = await prisma.payout.createMany({
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
  } catch (error: any) {
    console.error("DB Insert Error:", error);
    throw error;
  }
}
const getPayoutsFromDB = async()=>{
    const result = await prisma.payout.findMany({
      include:{
        volunteerApplication:{
            include:{
                user:{
                    select:{
                        name:true,
                        email:true,
                        contactNumber:true
                    }
                },
                opportunity:{
                    select:{
                        title:true,
                        organization:true
                    }
                }
            }
        }
      },
      orderBy:{
        createdAt:'desc'
      }
    });

    return result
}

// webhook url to get payout status updates: 
const handleWebhookEvent = async (event: any) => {
  const { event_type, resource } = event;
  const senderItemId = resource?.payout_item?.sender_item_id;
  console.log("event_type:", event_type, "\nsenderItemId:", senderItemId);
  console.log("event_type: ",event_type, "\nresoourse: ",resource)
  if (!resource?.sender_item_id) return;

  if (event_type === "PAYMENT.PAYOUTS-ITEM.SUCCEEDED") {
    await prisma.payout.updateMany({
      where: { senderItemId: senderItemId  },
      data: { status: "SUCCESS", transactionId: resource.transaction_id, updatedAt: new Date() },
    });
  } else if (event_type === "PAYMENT.PAYOUTS-ITEM.FAILED") {
    await prisma.payout.updateMany({
      where: { senderItemId: senderItemId  },
      data: { status: "FAILED", updatedAt: new Date() },
    });
  }
};




export const PayoutServices = {
    sendPayouts,
    getPayoutsFromDB ,
    handleWebhookEvent
}