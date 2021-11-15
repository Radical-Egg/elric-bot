const FormData = require('form-data');

class Query {
    constructor() {
        this.filename = ""
        this.api_url = ""
        this.FormData = new FormData()
    }
}

module.exports = Query