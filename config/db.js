const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://" + process.env.BD_USER_PASS + "@cluster0.l2bpyiq.mongodb.net/tstreamdb",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));
