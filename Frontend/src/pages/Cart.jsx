import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { X, Plus, Minus } from "lucide-react";

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, clearCart } = useContext(CartContext);

  // consolidate any duplicates just in case the context array contains
  // multiple entries for the same item id.  This guarantees items with a
  // quantity >1 show once with a "+N" badge and prevents repeated rows.
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

  const total = uniqueItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* items list */}
          <div className="flex-1 space-y-4">
            {uniqueItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
              >
                <div>
                  <h2 className="font-semibold">
                    {item.name}
                    {item.quantity && item.quantity > 1 && (
                      <span className="ml-2 text-sm text-gray-500">
                        +{item.quantity}
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-500">
                    ₹{item.price * (item.quantity || 1)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 rounded-full hover:bg-gray-200"
                    title="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() => addToCart(item)}
                    className="p-2 rounded-full hover:bg-gray-200"
                    title="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 rounded-full hover:bg-gray-200"
                    title="Remove"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                // placeholder action, e.g. navigate to checkout
                alert('Proceeding to checkout...');
              }}
              className="mt-2 w-full py-2 bg-green-600 text-white rounded-lg"
            >
              Proceed
            </button>
          </div>

          {/* summary sidebar */}
          <aside className="w-full lg:w-64 p-4 bg-gray-100 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
            <p className="mb-1">
              Items: {uniqueItems.reduce((sum, i) => sum + (i.quantity || 1), 0)}
            </p>
            <p className="font-bold text-xl">Total Payable: ₹{total.toFixed(2)}</p>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
