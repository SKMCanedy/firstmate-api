exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/firstmate-api-database";
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || "mongodb://localhost:27017/test-firstmate-api-database";
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
exports.CLIENT_ORIGIN = [/\.heroku\.com$/,"http://localhost:3000"]