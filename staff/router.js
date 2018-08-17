"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");


const {Staff} = require("./models");


const router = express.Router();
const jwtAuth = passport.authenticate("jwt", { session: false });


//-- CRUD Routes --

router.get("/", jwtAuth, (req,res) => {
    console.log("GET all route accessed");
    Staff
    .find()
    .then(allStaff => {
        const allStaffTeam = allStaff.map((staffList) => staffList.serialize());
        res.json(allStaffTeam);
        });
});

router.get("/:id", jwtAuth, (req,res) => {
    console.log("GET single route accessed");
    Staff
    .findById(req.params.id)
    .then(singleStaff => {
        const staffDetails = singleStaff.serialize();
        res.json(staffDetails);
    });
});

router.post("/", jwtAuth, (req,res) => {
    console.log("POST Route accessed");
    Staff
    .create({
        staffName: req.body.staffName,
    })
    .then(
        staff => res.status(201).json(staff.serialize()))
    .catch(function(err){
        if (err.code == 11000){
            res.status(500).json({message: "Duplicate Staff Name"});
        } 
        else {
            res.status(500).json({message: "Internal server error"});
        }
    });
});

router.put("/:id", jwtAuth, (req,res) => {
    console.log("PUT Route accessed");
    
    Staff
    .findByIdAndUpdate (req.params.id, req.body, {new: true}, (err, staff) => {
        if (staff){
            return res.send(staff);
        }

        if (err && err.code == 11000){
            return res.status(500).json({message: "Duplicate Staff Name"});
        } 
    })
});

router.delete("/:id", jwtAuth, (req,res)=> {
    console.log("DELETE Route accessed");
    Staff.findByIdAndRemove(req.params.id, () =>{
        res.status(200).end();
    });
});

//-- Exports --

module.exports = {router};
