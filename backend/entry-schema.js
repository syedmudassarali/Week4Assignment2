const mongoose = require('mongoose');

const entrySchema = mongoose.Schema({
    testdate: String,
    matchtype: String,
    team: String,
    player: String,
    runs: Number,
    balls: Number,
    fours: Number,
    sixes: Number,
    strike: Number,
    wickets: Number,
    conceded: Number

});

module.exports = mongoose.model('DiaryEntry', entrySchema);