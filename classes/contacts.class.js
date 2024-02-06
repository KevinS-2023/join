class Contact {
    constructor(name, email, phone, id, initials, color) {
        this.name = name; /** Array [Firstname, Lastname] */
        this.email = email;
        this.phone = phone;
        this.id = id;
        this.initials = initials;
        this.color = color; /** variant */
    }
}

export default Contact;