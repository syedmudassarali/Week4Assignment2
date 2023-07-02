const express = require('express');
const bodyParser = require('body-parser');
const DiaryEntryModel = require('./entry-schema');
const mongoose = require('mongoose');
const UserModel = require('./user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/cricketteam')    
    .then(() => {
        console.log('Database Connected')
    })
    .catch(() => {
        console.log('Error connecting to MongoDB');
    })

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

app.delete('/remove-entry/:id', (req, res) => {
    DiaryEntryModel.deleteOne({_id: req.params.id})
    .then(() => {
        res.status(200).json({
            message: 'Post Deleted'
        })
    })
})

app.put('/update-entry/:id', (req, res) => {
    const updatedEntry = new DiaryEntryModel({_id: req.body.id, testdate: req.body.testdate, matchtype: req.body.matchtype,
        team: req.body.team, player: req.body.player, runs: req.body.runs,balls: req.body.balls, fours: req.body.fours, sixes: req.body.sixes,
        strike: req.body.strike,wickets: req.body.wickets,conceded: req.body.conceded})
    DiaryEntryModel.updateOne({_id: req.body.id}, updatedEntry)
        .then(() => {
            res.status(200).json({
                message: 'Update completed'
            })    
        })
})

app.post('/add-entry', (req, res, next) => {
   
    try{
        const token = req.headers.authorization;
        jwt.verify(token, "secret_string")
        next();
    }
    catch(err){
        res.status(401).json({
            message:"Error with Authentication token"
        })
    }
    
}, (req,res) => {
    const diaryEntry = new DiaryEntryModel({testdate: req.body.testdate, matchtype: req.body.matchtype,team: req.body.team, player: req.body.player, runs: req.body.runs,balls: req.body.balls, fours: req.body.fours, sixes: req.body.sixes,
        strike: req.body.strike,wickets: req.body.wickets,conceded: req.body.conceded});
    diaryEntry.save()
        .then(() => {
            res.status(200).json({
                message: 'Post submitted'
            })
        })
})

app.get('/diary-entries',(req, res, next) => {
    DiaryEntryModel.find()
    .then((data) => {
        res.json({'diaryEntries': data});
    })
    .catch(() => {
        console.log('Error fetching entries')
    })
})

app.post('/sign-up', (req,res) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const userModel = new UserModel({
                username: req.body.username,
                password: hash
            })

            userModel.save()
            .then(result => {
                res.status(201).json({
                    message: 'User created',
                    result: result
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
        })
})

app.post('/login', (req,res) => {

    let userFound;

    UserModel.findOne({username: req.body.username})
        .then(user => {
            if(!user){
                return res.status(401).json({
                    message: 'User not found'
                })
            }
            userFound = user
            return bcrypt.compare(req.body.password, user.password)
        })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message: 'Password is incorrect'
            })
        }

        const token = jwt.sign({username: userFound.username, userId: userFound._id}, "secret_string", {expiresIn:"1h"})
        return res.status(200).json({
            token: token
        })
    })
    .catch(err => {
        return res.status(401).json({
            message: 'Error with authentication'
        })
    })
})

module.exports = app;
