const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishlistItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
});

const WishlistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref:"User",  required: function() { return !this.sessionId}},
  sessionId: { type: String,  required: function() { return !this.userId; }, unique: true, },
  items: [WishlistItemSchema],
}, {
  timestamps: true,
});


module.exports = mongoose.model('Wishlist', WishlistSchema);
