import React from "react";
import { useDispatch } from "react-redux";
import { createOrder } from "../redux/features/orderSlice";
import { clearCart } from "../redux/features/cartSlice";

const CartSummary = ({ items }) => {
  const dispatch = useDispatch();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const delivery = 25;
  const tax = 14;
  const discount = 60;

  const total = subtotal + delivery + tax - discount;

  const handleCheckout = () => {
    const orderItems = items.map((item) => ({
      book: item._id,
      quantity: item.quantity,
      priceAtPurchase: item.price,
    }));

    dispatch(createOrder({ items: orderItems, totalAmount: total }));

    dispatch(clearCart());
  };

  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm">
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Promocode"
          className="border rounded px-3 py-2 flex-1"
        />

        <button className="text-blue-600 font-semibold">Apply</button>
      </div>

      <div className="text-sm space-y-2">
        <div className="flex justify-between">
          <p>{items.length} items:</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>

        <div className="flex justify-between">
          <p>Delivery cost:</p>
          <p>${delivery}</p>
        </div>

        <div className="flex justify-between">
          <p>Tax:</p>
          <p>${tax}</p>
        </div>

        <div className="flex justify-between text-green-600">
          <p>Discount:</p>
          <p>-${discount}</p>
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex justify-between font-bold text-lg mb-4">
        <p>Total:</p>
        <p>${total.toFixed(2)}</p>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
      >
        Checkout →
      </button>
    </div>
  );
};

export default CartSummary;
