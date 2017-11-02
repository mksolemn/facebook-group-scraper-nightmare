# Nightmarish facebook to wordpress scraper
Facebook  group scraping using NodeJs and NightmareJs.


## 1. Basic NightmareJS setup

```

npm install --save nightmare

```

## 2. Login to Facebook


### Setup external file to keep all your credentials

I'm setting it up like this so I don't have to think when I push files to git. Just add credentials.js to .gitignore and you can do the same.
As you may guess, you'll have to create credentials.js file.

#### [Generate wordpress authorization code](https://code.tutsplus.com/tutorials/wp-rest-api-setting-up-and-using-basic-authentication--cms-24762)
Check [this article](https://code.tutsplus.com/tutorials/wp-rest-api-setting-up-and-using-basic-authentication--cms-24762) - don't worry this won't take more than 5 minutes.

```javascript
// credentials.js

module.exports = {
    facebook_username : [your_facebook_username],
    facebook_password : [your_facebook_password],
    wordpress_auhtorization_code : [your_wordpress_auhtorization_code]
}
```

### Login to facebook

Totally basic setup, just to see how it works, will do some refactoring later.

```javascript
const   Credentials = require('./credentials'), // Include our credentials
        Nightmare = require('nightmare'),
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
```

## 3. Looping through group pages


