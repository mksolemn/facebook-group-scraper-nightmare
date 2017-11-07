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
            .wait(3000) // will wait 3 seconds to load next page
            .then(()=>{
                var run = function * () {
                    for (var i = 0; groups.length > i; i++) {
                        var post = yield nightmare.goto(groups[i])
                            .wait(200) // I like to wait tiny bit before injecting jQuery
                            .inject('js', './node_modules/jquery/dist/jquery.js') // injecting jQuery into the page
                            .wait(3000)
                            .evaluate(()=> {
                                var posts = [];
                                $('.fbUserStory').each(function(index){
                                    var post = {};
                                    var userName = $(this).find('h5 a').text();
                                    var price = $(this).find('._l57').text();
                                    var postDate = $(this).find('abbr').attr('title');
                                    var postTitle = $(this).find('._l53>span:last-child').text();
                                    var location = $(this).find('.mtm ._l58').text();
                                    var description = $(this).find('.userContent p').text();

                                    post.id = index;
                                    post.price = price;
                                    post.username = userName;
                                    post.date = postDate;
                                    post.title = postTitle;
                                    post.location = location;
                                    post.description = description;
                                    posts.push(post);
                                })
                                return posts;
                            })
                            .then(function () {
                                console.log('Done yielding');
                            })
                    }
                }

                vo(run)((res)=> {
                    console.log(res);
                })

            })
            .catch((error) => {
                console.error('Something went wrong:', error)
        });