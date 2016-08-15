var mongoose = require( 'mongoose' )
const Schema = mongoose.Schema

const phoneCode = new Schema( {
  phone: String, 
  code: String,
  expire: Number
} )

module.exports = mongoose.model( 'phoneCode', phoneCode )
