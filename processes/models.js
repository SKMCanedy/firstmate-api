"use strict";

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const ProcessSchema = mongoose.Schema({
    processName: {
      type: String,
      required: true,
      unique: true
    }
  });

  ProcessSchema.methods.serialize = function() {
    return {
        id: this._id || "",
        processName: this.processName || ""
    };
  };
  
  const Process = mongoose.model("Process", ProcessSchema);
  
  module.exports = {Process};