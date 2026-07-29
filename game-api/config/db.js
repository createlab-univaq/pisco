const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connesso con successo!");
  } catch (error) {
    console.error("Errore di connessione al database:", error);
    process.exit(1); // Stoppa l'app se il db non si connette
  }
};

module.exports = connectDB;
