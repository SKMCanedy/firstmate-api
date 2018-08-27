"use strict";

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const columnOrderSchema = mongoose.Schema({ content: 'string' })

const BoardSchema = mongoose.Schema({
  tasks: { type : Object , "default" : {} },
  columns: { type : Object , "default" : {} },
  columnOrder: { type : Array , "default" : [] },
  modalStatus: { type : Object, "default" : {} }
});

BoardSchema.methods.serialize = function() {
  return {
    id: this._id || "",
    tasks: this.tasks || "",
    columns: this.columns || "",
    columnOrder: this.columnOrder || ""
  };
};

const Board = mongoose.model("Board", BoardSchema);

module.exports = {Board};