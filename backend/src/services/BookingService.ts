const puppeteer = require('puppeteer')

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

export default class BookingService {

    public static async run (reservation: any) {

        const browser = await puppeteer.launch({headless: true});

        const context = await browser.createIncognitoBrowserContext();
        const page = await context.newPage();
        

        await page.setViewport({
            width: 1920 + Math.floor(Math.random() * 100),
            height: 3000 + Math.floor(Math.random() * 100),
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false,
        });

   
        await page.setUserAgent(USER_AGENT);
        await page.setJavaScriptEnabled(true);
        await page.setDefaultNavigationTimeout(0);
    
        await page.setRequestInterception(true);
        page.on('request', ((req:any) => {
            if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
                req.abort();
            } else {
                req.continue();
            }
        }))

        console.log(reservation)
    
        let roomType = '0'
        switch(reservation.room) {
            case 1: case 16: roomType = '4'
                break
            case 2: case 3: roomType = '3'
                break
            case 4: case 5: case 8: case 9: case 12: roomType = '2'
                break
            case 6: case 7: case 10: case 11: roomType = '1'
                break
            case 13: roomType = '5'
                break
        }

        let checkinArr = reservation.date_from.split('-')
        let checkoutArr = reservation.date_to.split('-')
        
        if (checkinArr.length === 0 || checkoutArr.length === 0) {
            return
        }

        let checkinYear = checkinArr[0]
        let checkinMonth = checkinArr[1]
        let checkinDay = checkinArr[2]
        let checkoutYear = checkoutArr[0]
        let checkoutMonth = checkoutArr[1]
        let checkoutDay = checkoutArr[2]
        

        try{
            await page.goto('https://www.booking.com/hotel/rs/vila-srebrno-jezero.html?checkin_year=' + checkinYear + '&checkin_month=' + checkinMonth + '&checkin_monthday=' + checkinDay + '&checkout_year=' + checkoutYear + '&checkout_month=' + checkoutMonth + '&checkout_monthday=' + checkoutDay);
            
            let roomId = '0' + roomType
            await page.waitForSelector('[data-room-id*="5024027' + roomId + '"]');
    
            await page.select('select[data-room-id*="5024027' + roomId + '"]', '1')

            await page.waitForSelector('#hp_book_now_button');
            await page.click('#hp_book_now_button');

            await page.waitForSelector('#firstname');
            await page.focus('#firstname')
            await page.keyboard.type(reservation.person.name.split(' ')[0])
            await page.waitForSelector('#lastname');
            await page.focus('#lastname')
            await page.keyboard.type(reservation.person.name.split(' ')[1])
            await page.waitForSelector('#email');
            await page.focus('#email')
            await page.keyboard.type(reservation.person.email)
            await page.focus('#email_confirm')
            await page.keyboard.type(reservation.person.email)

            await page.waitForSelector('[name="book"]');
            await page.click('[name="book"]');

            await page.waitForSelector('#phone');
            await page.focus('#phone')
            await page.keyboard.type(reservation.person.phone)

            await page.waitForSelector('[name="book"]');
            await page.click('[name="book"]');
            await page.waitForNavigation({waitUntil: 'networkidle2'})

        } catch (e) {
            console.log(e)
            return false
        } finally {
            browser.close();
        }
    
        return true
    }
}