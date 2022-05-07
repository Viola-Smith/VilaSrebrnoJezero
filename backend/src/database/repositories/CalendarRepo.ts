import GoogleCalendarTokens from "../models/googleCalendarTokens"


export default class CalendarRepo {

    public static async getToken() {
        return await GoogleCalendarTokens.findOne().exec()
    }

    public static async createToken(token: any) {
        let newToken = new GoogleCalendarTokens({token: token});
        return await newToken.save()
    }

    public static async deleteToken() {
        return await GoogleCalendarTokens.deleteOne().exec()
    }

}