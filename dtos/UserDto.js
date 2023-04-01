class UserDto{
    constructor(model) {
        this.email = model.email
        this.admin_id = model.admin_id
        this.username = model.username
    }
}

module.exports = UserDto