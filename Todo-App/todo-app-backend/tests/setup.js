const mongoose = require('mongoose');
require("dotenv").config({ path: ".env.test" });


beforeAll(async () => {
    if (mongoose.connection.readyState === 0) { // 0 means disconnected
        console.log("Connecting to the test database...");
        await mongoose.connect(process.env.MONGODB_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    } else {
        console.log("Already connected to the database.");
    }
});

afterAll(async () => {
    await mongoose.connection.close(); // Close the connection after tests
});
