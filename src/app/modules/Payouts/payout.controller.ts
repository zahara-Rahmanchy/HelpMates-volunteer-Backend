import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { PayoutServices } from "./payout.service";
import catchAsync from "../../../shared/catchAsync";

const makePaymentToVolunteers = catchAsync(
  async (req: Request, res: Response) => {
    console.log("payout controller:", req.body);

    const result = await PayoutServices.sendPayouts(req.body)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Payouts processed successfully",
      data: result,
    });
  }
);

const getPayoutDetails = catchAsync(async(req:Request,res:Response)=>{
  const result = await PayoutServices.getPayoutsFromDB();

  sendResponse(res,{
    success: true,
      statusCode: httpStatus.OK,
      message: "Payouts fetched successfully",
      data: result,
  })
})

 const paypalWebhook = catchAsync(async (req: Request, res: Response) => {
  
    const event = req.body;

    console.log("Event from paypal webhook: ", event)
    const result = await PayoutServices.handleWebhookEvent(event);

    sendResponse(res,{
    success: true,
      statusCode: httpStatus.OK,
      message: "Payout's Status fetched successfully",
      data: result,
  })

    
})
export const PayoutsController = {
    makePaymentToVolunteers,
    getPayoutDetails,
    paypalWebhook 
} 