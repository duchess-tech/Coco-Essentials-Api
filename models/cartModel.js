const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 }
});

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', sparse: true, default: undefined },
  sessionId: { type: String ,sparse: true, unique: true, default: undefined},
  products: [cartProductSchema],
  totalQuantity: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true, default: 0 }
}, { timestamps: true });

// cartSchema.methods.calculateTotals = function () {
//     const self = this;
//     return mongoose.model('Product').populate(this, 'products.productId')
//       .then(function(cart) {
//         self.totalQuantity = cart.products.reduce((acc, item) => acc + item.quantity, 0);
//         self.totalPrice = cart.products.reduce((acc, item) => acc + (item.quantity * item.productId.price), 0);
//       });
//   };
  
cartSchema.methods.calculateTotals = async function () {
  await mongoose.model('Cart').populate(this, {
    path: 'products.productId',
    model: 'Product'
  });
  this.totalQuantity = this.products.reduce((acc, item) => acc + item.quantity, 0);
  this.totalPrice = this.products.reduce((acc, item) => {
    if (item?.productId && typeof item?.productId.price === 'number') {
      return acc + (item?.quantity * item?.productId.price);
    }
    return acc;
  }, 0);
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
