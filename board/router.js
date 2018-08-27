"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");


const {Board} = require("./models");

const router = express.Router();
const jwtAuth = passport.authenticate("jwt", { session: false });


//-- CRUD Routes --

router.get("/", jwtAuth, (req,res) => {
    console.log("GET Board all route accessed");
    Board
    .find()
    .then(allBoard => {
        const allBoards = allBoard.map((boards) => boards.serialize());
        res.json(allBoard);
        });
});

router.get("/:id", jwtAuth, (req,res) => {
    console.log("GET Board single route accessed");
    Board
    .findById(req.params.id)
    .then(board => {
        const boardDetails = board.serialize();
        res.json(boardDetails);
    })
    .catch(function(err){
        res.status(500).json({message: "Internal server error"});
    });
});

router.post("/", jwtAuth, (req,res) => {
    console.log("POST Board Route accessed");
    console.log(req.body)
    Board
    .create({
        tasks: req.body.tasks,
        columns: req.body.columns,
        columnOrder: req.body.columnOrder
    })
    .then(
        board => res.status(201).json(board.serialize()))
    .catch(function(err){
        res.status(500).json({message: "Internal server error"});
    });
});

router.put("/:id", jwtAuth, (req,res) => {
    console.log("PUT Board Route accessed");
    
    Board
    .findByIdAndUpdate (req.params.id, req.body, {new: true}, (err, board) => {
        if (board){
            return res.send(board);
        }

        if (err){
            return res.status(500).json({message: "Internal server error"});
        } 
    })
});

router.delete("/:id", jwtAuth, (req,res)=> {
    console.log("DELETE Board Route accessed");
    Board.findByIdAndRemove(req.params.id, () =>{
        res.status(200).end();
    });
});

//-- Exports --

module.exports = {router};
