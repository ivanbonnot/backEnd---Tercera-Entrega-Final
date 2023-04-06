const mongoose = require('mongoose')

let isConnected;

const connectToDb = async (db) => {

    if (!isConnected && db == "mongo") {
        try {
            mongoose.set('strictQuery', true);
            await mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.xvejx.gcp.mongodb.net/test`,
                { useNewUrlParser: true, useUnifiedTopology: true })

                .then(() => {
                    isConnected = true
                    console.log('MongoDB Connected', isConnected);
                })
                .catch(err => console.log(err))
            return;
        }
        catch (e) {
            console.log(e.message);
        }
        return;
    }
}

module.exports = connectToDb ;
