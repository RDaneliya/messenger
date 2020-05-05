const mongoose = require('../modules/mongoose');
const Schema   = mongoose.Schema;

const schema = new Schema({
  text:        {
    type:     String,
    unique:   false,
    required: true
  },
  destination: {
    type:     String,
    unique:   false,
    required: true
  },
  addresser:   {
    type:     String,
    unique:   false,
    required: true
  },
  date:        {
    type:     Date,
    unique:   false,
    required: true,
    default:  Date.now()
  }
});

const Message = mongoose.model('Message', schema);

exports.loadMessages = callback => {
  let result = Message.find({}).the;
  result.sort({ date: 1 }).exec((err, result) => {
    callback(err, result);
  });
};

exports.loadDialogMessages = (username0, username1, callback) => {
  Message.find({
    $or: [{
      addresser:   username0,
      destination: username1
    }, {
      addresser:   username1,
      destination: username0
    }]
  }, (err, result) => {
    result.sort((a, b) => (a._doc.date > b._doc.date) ? 1 : -1);
    callback(err, result);
  });
};

exports.saveMessage = (data, callback) => {
  const message = new Message({
    text:        data.text,
    destination: data.destination,
    addresser:   data.addresser,
    date:        data.date
  });
  message.save(err => {
    callback(err);
  });
};
