const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`MongoDB connected on ${process.env.MONGODB_DB}`);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} !!!`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
