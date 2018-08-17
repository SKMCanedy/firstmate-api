"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");


const {Process} = require("./models");


const router = express.Router();
const jwtAuth = passport.authenticate("jwt", { session: false });


//-- CRUD Routes --

router.get("/", jwtAuth, (req,res) => {
    console.log("GET all route accessed");
    Process
    .find()
    .then(allProcesses => {
        const allProcessesList = allProcesses.map((processes) => processes.serialize());
        res.json(allProcessesList);
        });
});

router.get("/:id", jwtAuth, (req,res) => {
    console.log("GET single route accessed");
    Process
    .findById(req.params.id)
    .then(singleProcess => {
        const processDetails = singleProcess.serialize();
        res.json(processDetails);
    });
});

router.post("/", jwtAuth, (req,res) => {
    console.log("POST Route accessed");
    Process
    .create({
        processName: req.body.processName,
    })
    .then(
        process => res.status(201).json(process.serialize()))
    .catch(function(err){
        if (err.code == 11000){
            res.status(500).json({message: "Duplicate Process Entry"});
        } 
        else {
            res.status(500).json({message: "Internal server error"});
        }
    });
});

router.put("/:id", jwtAuth, (req,res) => {
    console.log("PUT Route accessed");
    
    Process
    .findByIdAndUpdate (req.params.id, req.body, {new: true}, (err, process) => {
        if (process){
            return res.send(process);
        }

        if (err && err.code == 11000){
            return res.status(500).json({message: "Duplicate Process Entry"});
        } 
    })
});

router.delete("/:id", jwtAuth, (req,res)=> {
    console.log("DELETE Route accessed");
    Process.findByIdAndRemove(req.params.id, () =>{
        res.status(200).end();
    });
});

//-- Exports --

module.exports = {router};
