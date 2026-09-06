import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  const saveCart = (newItems) => {
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const addToCart = (product, pricing, qty = 1) => {
    const existing = items.find(
      (item) => item.productId === product._id
    );

    if (existing) {
      const updated = items.map((item) =>
        item.productId === product._id
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + qty,
                product.quantity
              ),
            }
          : item
      );

      saveCart(updated);
    } else {
      saveCart([
        ...items,
        {
          productId: product._id,
          name: product.name,
          image: product.images?.[0] || '',
          price: pricing.discountedPrice,
          maxQuantity: product.quantity,
          quantity: Math.min(qty, product.quantity),
        },
      ]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    const updated = items.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.min(quantity, item.maxQuantity),
          }
        : item
    );

    saveCart(updated);
  };

  const removeFromCart = (productId) => {
    saveCart(
      items.filter((item) => item.productId !== productId)
    );
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);