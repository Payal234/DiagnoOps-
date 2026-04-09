import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { X, Plus, Minus } from "lucide-react";

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, clearCart } = useContext(CartContext);
  const [user, setUser] = useState(null);

  // ✅ Payment status state
  const [paymentStatus, setPaymentStatus] = useState(null); 
  // "success" | "error" | null

  // ✅ Merge duplicate items
  const uniqueItems = Object.values(
    cartItems.reduce((acc, item) => {
      if (acc[item.id]) {
        acc[item.id].quantity = (acc[item.id].quantity || 1) + 1;
      } else {
        acc[item.id] = { ...item, quantity: item.quantity || 1 };
      }
      return acc;
    }, {})
  );

  // ✅ Price calculations
  const total = uniqueItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  const platformFee = 10;
  const shippingFee = 5;
  const finalTotal = total + platformFee + shippingFee;

  // ✅ Auto hide message
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        setUser({});
      }
    }
  }, []);

  useEffect(() => {
    if (paymentStatus) {
      const timer = setTimeout(() => {
        setPaymentStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus]);

  // ✅ PAYMENT FUNCTION
  const handleCheckout = async () => {
    try {
      if (!user?.userId && !user?._id) {
        setPaymentStatus("error");
        return;
      }

      const adminId = uniqueItems[0]?.adminId || null;
      const adminAccountId = uniqueItems[0]?.adminAccountId || null;

      const res = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: finalTotal,
          items: uniqueItems,
          adminId,
          adminAccountId,
          userId: user._id || user.userId,
          userName: user.name,
          userEmail: user.email,
          userContact: user.phone || user.contact,
          userAge: user.age,
          userGender: user.gender,
          userBloodGroup: user.bloodGroup,
          userAllergies: user.allergies,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { error: await res.text() };

      if (!res.ok) {
        throw new Error(data.error || data.message || "Error creating order");
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,

        name: "My Store",
        description: "Order Payment",

        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              "http://localhost:5000/api/payment/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...response,
                  dbOrderId: data.dbOrderId,
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setPaymentStatus("success");
              clearCart();
            } else {
              setPaymentStatus("error");
            }

          } catch (err) {
            console.log(err);
            setPaymentStatus("error");
          }
        },

        prefill: {
          name: "Test User",
          email: "test@gmail.com",
          contact: "9999999999",
        },

        theme: {
          color: "#16a34a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err);
      setPaymentStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🛍️ Your Cart
      </h1>

      {/* ✅ SUCCESS / ERROR UI */}
      {paymentStatus === "success" && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center font-medium">
          ✅ Payment successful! Your order has been placed.
        </div>
      )}

      {paymentStatus === "error" && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center font-medium">
          ❌ Payment failed. Please try again.
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center">
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT */}
          <div className="flex-1 space-y-5">
            {uniqueItems.map((item, index) => (
              <div
                key={item.id ?? `${item.name}-${index}`}
                className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    ₹{item.price} × {item.quantity}
                  </p>

                  <p className="text-green-600 font-bold mt-1">
                    ₹{item.price * item.quantity}
                  </p>
                </div>

                {/* CONTROLS */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-full overflow-hidden">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      <Minus size={14} className="cursor-pointer"/>
                    </button>

                    <span className="px-3 font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      <Plus size={14} className="cursor-pointer"/>
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <X size={16} className="cursor-pointer"/>
                  </button>
                </div>
              </div>
            ))}

            {/* ✅ PAYMENT BUTTON */}
            {!user ? (
              <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 text-yellow-700 font-medium">
                Please login first to complete the booking.
              </div>
            ) : (
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow hover:scale-[1.02] transition cursor-pointer"
              >
                Proceed to Checkout
              </button>
            )}
          </div>

          {/* RIGHT */}
          <aside className="w-full lg:w-80">
            <div className="bg-white p-6 rounded-2xl shadow-md sticky top-6">
              <h2 className="text-xl font-semibold mb-5 text-gray-800">
                Order Summary
              </h2>

              <div className="space-y-3 text-gray-600 text-sm">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>
                    {uniqueItems.reduce(
                      (sum, i) => sum + (i.quantity || 1),
                      0
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹{platformFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shippingFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t my-4"></div>

              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span className="text-green-600">
                  ₹{finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;