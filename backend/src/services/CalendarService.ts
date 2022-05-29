import IntegrationRepo from "../database/repositories/IntegrationRepo";
import ReservationRepo from "../database/repositories/ReservationRepo";

const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

const CLIENT_ID = '690794457490-7ctf0qc3274nmrgrop4tjhfcdjlpkhc4.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'http://localhost:4200/calendar'

export default class CalendarService {

    public static async authorizeUser() {
        const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        let token = await this.getToken()
        console.log(token)
        if (Object.keys(token).length === 0) {
            return await this.getAccessToken(oAuth2Client);
        }
    }

    public static async getToken() {
        let gCal = await new IntegrationRepo().getByName('Google Calendar')
        return gCal.content
    }

    private static async getAccessToken(oAuth2Client: any) {
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES,
          include_granted_scopes: true
        });
        return authUrl
    }

    public static async createAccessToken(code: string, requestUri: string) {
        const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oAuth2Client.getToken(decodeURIComponent(code), (err: any, token: any) => 
            {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                new IntegrationRepo().addContent('Google Calendar', {token: token})
                this.listEvents(oAuth2Client);
            }
        );
    }


    private static async listEvents(auth: any) {
        let calendar = google.calendar({version: 'v3', auth});
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

    public static async createEvent (reservation: any, resId: any) {
        let token = await this.getToken()

        console.log(token.get('token'))
        console.log(reservation)
        if (token) {
            const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
            oAuth2Client.setCredentials(token.get('token'));
            if (!oAuth2Client) {
                console.log(oAuth2Client)
                return
            }
            if (oAuth2Client.isTokenExpiring()) {
                console.log('token is expiring')
            }
           
            console.log(oAuth2Client)
            let calendar = google.calendar({version: 'v3', oAuth2Client});
            let dateFrom = reservation.date_from.split(' ')[0] + 'T14:00:00+02:00'
            let dateTo = reservation.date_to.split(' ')[0] + 'T11:00:00+02:00'
            var event = {
                'summary': 'Reservation at Vila Srebrno Jezero',
                'description': 'Reservation for Vila Srebrno Jezero for ' + reservation.person.name + '.',
                'start': {
                  'dateTime': dateFrom
                },
                'end': {
                  'dateTime': dateTo
                },
                'attendees': [
                  {'email': reservation.person.email}
                ]
              };
              
              
            console.log(event)
            let createdEvent = await calendar.events.insert({
                auth: oAuth2Client,
                calendarId: 'primary',
                resource: event,
            })
            if (createdEvent) {
                await new ReservationRepo().updateGCId(resId, createdEvent.data.id)
                return createdEvent.data.id
            } else {
                return null
            }
        } else {
            console.log('no token')
            return 0
        }
    }

    public static async editEvent (reservation: any, googleCalendarEventId: any, status = 'confirmed') {
        let token = await this.getToken()

        console.log(token.get('token'))
        console.log(reservation)
        if (token) {
            const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
            oAuth2Client.setCredentials(token.get('token'));
            if (!oAuth2Client) {
                console.log(oAuth2Client)
                return
            }
           
            console.log(oAuth2Client)

            let dateFrom = reservation.date_from.split(' ').length > 1 ? reservation.date_from.split(' ')[0] : (reservation.date_from.split('T')[0])
            let dateTo = reservation.date_to.split(' ').length > 1 ? reservation.date_to.split(' ')[0] : (reservation.date_to.split('T')[0])
            
            let calendar = google.calendar({version: 'v3', oAuth2Client});
            var event = {
                'summary': 'Reservation at Vila Srebrno Jezero',
                'description': 'Reservation for Vila Srebrno Jezero for ' + reservation.person.name + '.',
                'start': {
                  'dateTime': dateFrom + 'T14:00:00+02:00'
                },
                'end': {
                  'dateTime': dateTo + 'T11:00:00+02:00'
                },
                'attendees': [
                  {'email': reservation.person.email}
                ],
                'status': status
              };

              
            console.log(event)
            calendar.events.update({
                auth: oAuth2Client,
                calendarId: 'primary',
                resource: event,
                eventId: googleCalendarEventId
            }, function(err: any, event: any) {
                if (err) {
                    console.log('There was an error contacting the Calendar service: ' + err);
                    return;
                }
                console.log('Event updated: ' + status);
            
            });
        } else {
            console.log('no token')
            return false
        }
    }

}