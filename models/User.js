const usersCollection = require("../db").db().collection("users")

let User = function(data) {
    this.user = data
    this.errors = []
}

User.prototype.validate = function() {
    if (this.user == "") {this.errors.push("You must provide a username")}
    if (this.user > 15) {this.errors.push("Username must be less than 15 characters.")}
}

User.prototype.create = function() {
    return new Promise(async (resolve, reject) => {
        this.validate()
        if (!this.errors.length) {
            resolve(this.user)
        } else {
            reject(this.errors)
        }
    })
}

module.exports = User