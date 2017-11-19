const request = require('request');

module.exports = {
    sendToWordpress: function (res) {
        let itemPrice = '';
        for (var i = 0; res.length > i; i += 1) {
            // check if title is a link
            if (this.requirementsToPass(res[i].title)) {
                // look for price
                if (res[i].price === undefined || res[i].price === null || res[i].price === '') {
                    itemPrice = this.extractPrice(res[i].description);
                } else {
                    itemPrice = res[i].price;
                }
                itemPrice = itemPrice.replace('€', '');
                console.log(itemPrice);
                request({
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic bWtzb2xlbW46TTFuZDN4NHNAMTk5MQ=='
                    },
                    uri: 'http://livinmalta.com/wp-json/wp/v2/posts',
                    body: JSON.stringify({
                        title: res[i].title,
                        content: res[i].description,
                        status: 'publish',
                        fields: {
                            item_price: itemPrice,
                            phone_number: this.extractPhone(res[i].description)
                        }
                    }),
                    method: 'POST'
                })
            }
        }
    },
    requirementsToPass: function (title) {
        if (title === undefined || title === null || title === '') {
            return false;
        }
        return true;
    },
    extractPhone: function (description) {
        const regex = /(\+?\d+)\d+\d+\d+\d+\d+\d+/g;
        if (description.match(regex) !== null) {
            return description.match(regex)[0];
        }
    },
    extractPrice: function (description) {
        const regex = /[\$\£\€](\d+(?:\.\d{1,2})?)/;
        if (description.match(regex) !== null) {
            return description.match(regex)[0];
        }
    }
}