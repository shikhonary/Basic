import axios from "axios"

export async function sendSms(to: string, message: string) {
  const token = process.env.BDBULKSMS_API_KEY

  if (!token) {
    console.error("BDBULKSMS_API_KEY is missing")
    throw new Error("BDBULKSMS_API_KEY is not defined in environment variables")
  }

  try {
    const greenwebsms = new URLSearchParams()
    greenwebsms.append("token", token)
    greenwebsms.append("to", to)
    greenwebsms.append("message", message)

    console.log(
      `[SMS DEBUG] Sending SMS to ${to}. Message length: ${message.length}`
    )
    const response = await axios.post(
      "https://api.bdbulksms.net/api.php",
      greenwebsms
    )
    console.log(`[SMS DEBUG] BDBulkSMS Response:`, response.data)
    return response.data
  } catch (error: any) {
    console.error("[SMS DEBUG] Error sending SMS via BDBulksms:", error.message)
    if (error.response) {
      console.error("[SMS DEBUG] Error Response Data:", error.response.data)
      console.error("[SMS DEBUG] Error Response Status:", error.response.status)
    }
    throw error
  }
}
