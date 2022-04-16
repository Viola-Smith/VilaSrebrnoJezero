import ReservationRepo from "../database/repositories/ReservationRepo";
import CalendarRepo from "../database/repositories/CalendarRepo";

const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

const CLIENT_ID = '690794457490-7ctf0qc3274nmrgrop4tjhfcdjlpkhc4.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'http://localhost:4200/calendar'

export default class CalendarService {

    public static async authorizeUser(redirectUri: string) {
        const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirectUri);
        let token = await CalendarRepo.getToken()
        console.log(token)
        if (!token) {
            return await this.getAccessToken(oAuth2Client);
        }
    }

    public static async disconnectUser() {
        return await CalendarRepo.deleteToken()
    }

    public static async getToken() {
        return (await CalendarRepo.getToken())
    }

    private static async getAccessToken(oAuth2Client: any) {
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES,
        });
        return authUrl
    }

    public static async createAccessToken(code: string, requestUri: string) {
        const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, requestUri);
        oAuth2Client.getToken(decodeURIComponent(code), (err: any, token: any) => 
            {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                CalendarRepo.createToken(token)
                this.listEvents(oAuth2Client);
            });
    }


    private static async listEvents(auth: any) {
        const calendar = google.calendar({version: 'v3', auth});
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err:any, res: any) => {
            if (err) return console.log('The API returned an error: ' + err);
            const events = res.data.items;
            if (events.length) {
            console.log('Upcoming 10 events:');
            events.map((event: any, i: any) => {
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary}`);
            });
            } else {
            console.log('No upcoming events found.');
            }
        });
    }

    public static async createEvent (redirectUri: any, reservation: any) {
        let token = await CalendarRepo.getToken()

        console.log(token.get('token'))
        console.log(reservation)
        if (token) {
            const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirectUri);
            oAuth2Client.setCredentials(token.get('token'));
            if (!oAuth2Client) {
                console.log(oAuth2Client)
                return
            }
           
            console.log(oAuth2Client)
            const calendar = google.calendar({version: 'v3', oAuth2Client});
            var event = {
                'summary': 'Reservation at Vila Srebrno Jezero',
                'description': 'Reservation for Vila Srebrno Jezero for ' + reservation.person.name + '.',
                'start': {
                  'dateTime': reservation.date_from
                },
                'end': {
                  'dateTime': reservation.date_to
                },
                'attendees': [
                  {'email': reservation.person.email}
                ]
              };
              
            console.log(event)
            calendar.events.insert({
                auth: oAuth2Client,
                calendarId: 'primary',
                resource: event,
            }, function(err: any, event: any) {
                if (err) {
                    console.log('There was an error contacting the Calendar service: ' + err);
                    return;
                }
                console.log('Event created:');
                console.log(event.data.id)
                ReservationRepo.updateGCId(reservation.id, event.data.id)
            });
        } else {
            console.log('no token')
            return false
        }
    }

    public static async deleteEvent (googleCalendarEventId: any) {
        let token = await CalendarRepo.getToken()

        if (token) {
            const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
      
            console.log(token)
            oAuth2Client.setCredentials(token.get('token'));
            if (!oAuth2Client) {
                console.log(oAuth2Client)
                return
            }

            const calendar = google.calendar({version: 'v3', oAuth2Client});
            console.log(calendar)
            calendar.events.delete({calendarId: 'primary', eventId: googleCalendarEventId},
                function(err: any, event: any) {
                    if (err) {
                        console.log('There was an error contacting the Calendar service: ' + err);
                        return;
                    }
                    console.log('Event deleted:');
                    console.log(event.data.id)
                });
           
        }
    }

}