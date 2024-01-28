
const mongoose = require("mongoose");

const dbConnnection = () =>{ mongoose
  .connect(process.env.DB_URI)
  .then((con) => {
    console.log(`Datebase connected ${con.connection.host}`);
  })

}

module.exports = dbConnnection;