const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Quiz, TakenQuiz } = require('./Quiz')

//https://mongoosejs.com/docs/discriminators.html
//https://dev.to/helenasometimes/getting-started-with-mongoose-discriminators-in-expressjs--22m9

const baseOptions = {
    discriminatorKey: 'usertype',
    collection: 'users'
};

const User = mongoose.model('User', mongoose.Schema({
        username: {type: String, required: true},
        password: {type: String, required: true},
        email: {type: String, required: true}
        }, baseOptions,
    ),
);

exports.User = mongoose.model('User');

const Mentor = User.discriminator('Mentor', new mongoose.Schema({
        madeQuizzes: {type:[Quiz.schema], required: false},
        teams: {type:[Schema.Types.ObjectID], required: false},
        specialty: {type: String, required: false}
    }),
);

exports.Mentor = mongoose.model('Mentor')

const Coach = User.discriminator('Coach', new mongoose.Schema({
        madeQuizzes: {type:[Quiz.schema], required: false},
        school: {type: String, required: false},
        teams: {type:[Schema.Types.ObjectId], required: false}
    }),
);

exports.Coach = mongoose.model('Coach')

const Student = User.discriminator('Student', new mongoose.Schema({
        takenQuizzes: {type:[TakenQuiz.schema], required: false},
        school: {type: String, required: false},
        //QUESTION: Should students be part of multiple teams
        team: {type:Schema.Types.ObjectId, required: false}
    }),
);

exports.Student = mongoose.model('Student')

const Admin = User.discriminator('Admin', new mongoose.Schema({

    }),
);

exports.Admin = mongoose.model('Admin')
