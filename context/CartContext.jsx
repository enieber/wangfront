import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCart, setTotalCart] = useState(0);
  const [off, setOff] = useState(0);

  useEffect(() => {
    let mount = true;
    if (mount) {
      const listString = localStorage.getItem("cart");
      if (listString) {
        const list = JSON.parse(listString);
        setCartItems(list);
        const total = list.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        setTotalCart(total);
      }
    }

    return () => {
      mount = false;
    };
  }, []);

  function updateList(list) {
    if (list.length > 0) {
      const total = list.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotalCart(total);
      const listString = JSON.stringify(list);
      localStorage.setItem("cart", listString);
    } else {
      setTotalCart(0);
      const listString = JSON.stringify([]);
      localStorage.setItem("cart", listString);
    }
  }

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === product.id);
      if (itemExists) {
        const list = prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        updateList(list);
        return list;
      } else {
        const list = [...prevItems, { ...product, quantity: 1 }];
        updateList(list);
        return list;
      }
    });
  };

  const increment = (productId) => {
    setCartItems((prevItems) => {
      const incrementedCart = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      updateList(incrementedCart);
      return incrementedCart;
    });
  };

  const decrement = (productId) => {
    setCartItems((prevItems) => {
      const value = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
      updateList(value);
      return value;
    });
  };

  const setQuantity = (productId, quantity) => {
    setCartItems((prevItems) => {
      const value = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: quantity } : item
      );
      updateList(value);
      return value;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const list = prevItems.filter((item) => item.id !== productId);
      updateList(list);
      return list;
    });
  };

  const clearCart = () => {
    updateList([]);
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        decrement,
        increment,
        setQuantity,
        clearCart,
        totalCart,
        off,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
