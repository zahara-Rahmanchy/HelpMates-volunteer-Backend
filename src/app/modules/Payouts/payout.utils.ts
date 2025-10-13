import axios from "axios";

const baseURL = process.env.PAYPAL_BASE_URL;

export const getAccessToken = async()=>{
   try{
     const response = await axios.post(
        `${baseURL}/v1/oauth2/token`,
        "grant_type=client_credentials",
        {
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },
            auth:{
                username: process.env.PAYPAL_CLIENT_ID as string,
                password:process.env.PAYPAL_SECRET_KEY as string 
            }
        }

    )
    console.log("access token response: ",response)

    return response.data.access_token;
   }catch(error){
      console.log("error: ",error)
      throw error;
   }


}