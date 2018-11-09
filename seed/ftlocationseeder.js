const {FTLocation} = require('../routes/models/ftlocation');

var mongoose = require('mongoose');
//var mongo = require('mongodb').MongoClient;

mongoose.connect('mongodb://localhost:27017/uptaste', { useNewUrlParser: true });

var ftlocations = [
    new FTLocation({
        day: 'Monday',
        location: '34009 Alvarado-Niles Road Union City, CA'
    }),
    new FTLocation({
        day: 'Tuesday',
        location: '2700 Jims Rd NE, Marietta, GA'
    }),
    new FTLocation({
        day: 'Wednesday',
        location: '410 Terry Ave. North Seattle, WA'
    }),
    new FTLocation({
        day: 'Thursday',
        location: '110 Inner Campus Drive Austin, TX'
    }),
    new FTLocation({
        day: 'Friday',
        location: 'North Ave NW, Atlanta, GA'
    })
];

var done = 0;
for (var i=0; i<ftlocations.length; i++) {
    ftlocations[i].save(function(err, result) {
        done++;
        if (done === ftlocations.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}