var mongoose = require( 'mongoose' )
const Schema = mongoose.Schema

const notifySchema = new Schema( {
  receiver:String, // 消息接收人
  notifies : Array
} )

module.exports = mongoose.model( 'Notify', notifySchema )
