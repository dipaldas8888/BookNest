import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../redux/features/orderSlice";
import { clearCart } from "../redux/features/cartSlice";
import { Tag, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import API from "../api/axios";
import endpoints from "../api/endpoints";

const PROMO_CODES = {
  BOOK10: 10,
  BOOKNEST20: 20,
  READ15: 15,
};

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const CartSummary = ({ items }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountPct = appliedPromo ? PROMO_CODES[appliedPromo] : 0;
  const discountAmt = parseFloat(((subtotal * discountPct) / 100).toFixed(2));
  const delivery = subtotal > 500 ? 0 : 49; // ₹49 delivery, free above ₹500
  const total = Math.max(0, subtotal - discountAmt + delivery);

  const applyPromo = () => {
    setPromoError("");
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
    } else {
      setPromoError("Invalid promo code. Try BOOK10, BOOKNEST20, or READ15");
    }
  };

  // Razorpay Checkout
  const handleRazorpayCheckout = async () => {
    if (!user) {
      alert("Please sign in to checkout.");
      return;
    }

    setCheckoutLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Razorpay failed to load. Check your internet connection.");
        setCheckoutLoading(false);
        return;
      }

      // 1. Create Razorpay order on backend (amount in INR)
      const { data } = await API.post(endpoints.payment.createOrder, {
        amount: total,   // backend multiplies by 100 to convert to paise
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      });

      // 2. Open Razorpay modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "BookNest",
        description: `Order for ${items.length} book(s)`,
        order_id: data.orderId,
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: { color: "#1a3a2a" },
        handler: async (response) => {
          try {
            // 3. Verify payment on backend
            const verifyRes = await API.post(endpoints.payment.verify, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              // 4. Create order in our DB
              const orderItems = items.map((item) => ({
                book: item._id,
                quantity: item.quantity,
                priceAtPurchase: item.price,
              }));
              dispatch(createOrder({ items: orderItems, totalAmount: total }));
              dispatch(clearCart());
              alert("🎉 Payment successful! Your order has been placed.");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verify error:", err);
            alert("Payment verification error. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => setCheckoutLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setCheckoutLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err.response?.data?.message || "Checkout failed. Please try again.");
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5 sticky top-24">
      <h2 className="font-black text-gray-900 text-lg">Order Summary</h2>

      {/* Line items */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>

        {discountAmt > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount (-{discountPct}%)</span>
            <span className="font-bold">-${discountAmt.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span className="font-bold text-gray-900">
            {delivery === 0 ? (
              <span className="text-green-600 font-black text-xs uppercase">Free</span>
            ) : (
              `$${delivery.toFixed(2)}`
            )}
          </span>
        </div>

        {delivery > 0 && (
          <p className="text-[11px] text-gray-400">Free delivery on orders above $500</p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Total */}
      <div className="flex justify-between items-baseline">
        <span className="text-lg font-black text-gray-900">Total</span>
        <span className="text-2xl font-black text-gray-900">${total.toFixed(2)}</span>
      </div>

      {/* Promo code */}
      <div className="space-y-2">
        <div className="flex gap-2 p-1.5 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex items-center gap-2 flex-1 pl-2">
            <Tag className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                setPromoError("");
              }}
              placeholder="Add promo code"
              disabled={!!appliedPromo}
              className="flex-1 text-sm bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 min-w-0"
            />
          </div>
          <button
            onClick={applyPromo}
            disabled={!!appliedPromo || !promoInput}
            className="bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-bold transition cursor-pointer disabled:cursor-not-allowed"
          >
            {appliedPromo ? "✓" : "Apply"}
          </button>
        </div>
        {promoError && <p className="text-[11px] text-red-500 font-medium pl-1">{promoError}</p>}
        {appliedPromo && (
          <p className="text-[11px] text-green-600 font-bold pl-1">
            🎉 {appliedPromo} applied — {discountPct}% off!
          </p>
        )}
      </div>

      {/* Checkout button */}
      <button
        onClick={handleRazorpayCheckout}
        disabled={checkoutLoading || items.length === 0}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-black py-4 rounded-xl text-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        {checkoutLoading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
        ) : (
          <>Go to Checkout <ArrowRight className="w-4 h-4" /></>
        )}
      </button>

      {/* Accepted payment methods */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {["UPI", "Cards", "Net Banking", "EMI", "Wallet"].map((m) => (
            <span key={m} className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md">{m}</span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
          <span>Razorpay Test Mode — use card <strong className="text-gray-600">4111 1111 1111 1111</strong></span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
