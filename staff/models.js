"use strict";

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const StaffSchema = mongoose.Schema({
    staffName: {
      type: String,
      required: true,
      unique: true
    }
  });

  StaffSchema.methods.serialize = function() {
    return {
        id: this._id || "",
        staffName: this.staffName || ""
    };
  };
  
  const Staff = mongoose.model("Staff", StaffSchema);
  
  module.exports = {Staff};