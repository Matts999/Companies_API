var mongoose = require('mongoose');
mongoose.set('strictQuery', true);
var Schema = mongoose.Schema;

var CompanySchema = new Schema(
  {
    name: {type: String, required: true, maxlength: 150},
    ticker: {type: String, required: true, maxlength: 150},
    PE: {type: Number, required: true},
    dividend: {type: Number, required: false}
  }
);


// Export model
module.exports = mongoose.model('Company', CompanySchema);