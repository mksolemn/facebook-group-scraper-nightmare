const   Credentials = require('./credentials'), // Include our credentials
        Nightmare = require('nightmare'),
        vo = require('vo'),
        nightmare = Nightmare({ show: true }),
        domain = 'https://facebook.com',      // Initial navigation domain
        groups = ['https://www.facebook.com/groups/394556737385005/?sorting_setting=RECENT_ACTIVITY', // Scrapable group array
        'https://www.facebook.com/groups/391908637633014/?sorting_setting=RECENT_ACTIVITY'];

        // add console logging - makes life a bit easier
        nightmare
            .on('console', (log, msg) => {console.log(msg); console.log( Credentials.facebook_username );})
            .useragent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36") // browser info - not essential
            .goto(domain)
            .type('input[id="email"]', Credentials.facebook_username)
            .type('input[id="pass"]', Credentials.facebook_password)
            .click('#loginbutton>input')
            .wait(3000) // will wait 3 seconds before closing Nightmare headless browser
            .end()
            .catch((error) => {
                console.error('Something went wrong:', error)
        });