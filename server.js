const app = require("./app.js");
const connectDatabase = require("./config/database.js");


connectDatabase()
  .then(function () {
    app.listen(process.env.PORT, function () {
      console.log(`server is running on PORT: ${process.env.PORT}`);
    });
  })
  .catch(function (err) {
    console.log(err);
  });
