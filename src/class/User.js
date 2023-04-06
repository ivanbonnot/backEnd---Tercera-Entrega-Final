class User {
    constructor(username, password, email, address, phone, avatar, cartId) {
      this.timestamp = Date.now();
      this.username = username;
      this.password = password;
      this.email = email;
      this.address = address;
      this.phone= phone;
      this.avatar = avatar;
      this.cartId = cartId;
    }
  }
  
  module.exports = User;