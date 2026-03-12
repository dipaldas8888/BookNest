import React from "react";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { clearCart } from "../redux/features/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  console.log(cartItems);

  return (
    <section className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
      <p className="text-gray-500 mb-6">
        {cartItems.length} Products in your cart
      </p>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 border rounded-xl p-5">
            {cartItems.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}

            <button
              onClick={() => dispatch(clearCart())}
              className="text-sm text-gray-500 mt-4 underline"
            >
              Remove all from cart
            </button>
          </div>

          <CartSummary items={cartItems} />
        </div>
      )}
    </section>
  );
};

export default Cart;
