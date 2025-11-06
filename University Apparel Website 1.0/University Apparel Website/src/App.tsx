import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import Shop from "./components/Shop";
import ContactPage from "./components/ContactPage";
import ReservationForm from "./components/ReservationForm";
import OrderStatus from "./components/OrderStatus";
import AdminLoginPage from "./components/AdminLoginPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminProducts from "./components/AdminProducts";
import { CartItem, Product, Order } from "./types/product";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("home");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [productsState, setProductsState] = useState<Product[]>([]);

  // Load orders from localStorage so admin can review across sessions
  useEffect(() => {
    const raw = localStorage.getItem("mmsu_orders");
    if (raw) {
      try {
        const parsed: Order[] = JSON.parse(raw);
        // revive date fields
        const revived = parsed.map((o) => ({
          ...o,
          createdAt: new Date(o.createdAt),
          updatedAt: new Date(o.updatedAt),
        }));
        setOrders(revived);
      } catch (_) {
        // ignore parse errors
      }
    }
  }, []);

  // Load products from localStorage or defaults
  useEffect(() => {
    const raw = localStorage.getItem("mmsu_products");
    if (raw) {
      try {
        const parsed: Product[] = JSON.parse(raw);
        setProductsState(parsed);
        return;
      } catch (_) {
        // ignore parse errors
      }
    }
    import("./data/products").then((mod) => {
      setProductsState(mod.products);
    });
  }, []);

  const persistOrders = (next: Order[]) => {
    setOrders(next);
    localStorage.setItem("mmsu_orders", JSON.stringify(next));
  };

  const persistProducts = (next: Product[]) => {
    setProductsState(next);
    localStorage.setItem("mmsu_products", JSON.stringify(next));
  };

  const handleLogin = (email: string, password: string) => {
    // Simple validation for demo purposes
    if (email.includes("@mmsu.edu.ph") || email.includes("@")) {
      setIsAuthenticated(true);
      setUserEmail(email);
      toast.success(`Welcome back, ${email.split("@")[0]}!`);
      setCurrentView("shop");
    } else {
      toast.error("Please use a valid email address");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    setCartItems([]);
    setCurrentView("home");
    toast.info("You have been logged out");
  };

  const handleAddToCart = (product: Product, size: string, quantity: number) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.product.id === product.id && item.size === size
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { product, size, quantity }]);
    }
    
    toast.success(`${product.name} (Size ${size}) added to cart!`);
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
  };

  const handleRemoveItem = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    toast.info("Item removed from cart");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    setCurrentView("reservation");
  };

  const handleSubmitOrder = (order: Order) => {
    const next = [order, ...orders];
    persistOrders(next);
    setCartItems([]);
    toast.success(
      `Reservation submitted successfully! Order #${order.orderNumber}`,
      {
        description: "You will receive a confirmation email within 24 hours."
      }
    );
    setCurrentView("orders");
  };

  const handleCancelReservation = () => {
    setCurrentView("shop");
    toast.info("Reservation cancelled");
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminLogin = (email: string, password: string) => {
    // Demo-only auth: simple check
    const isValid = email.length > 5 && password === "admin123";
    if (isValid) {
      setIsAdminAuthenticated(true);
      setAdminEmail(email);
      setCurrentView("admin-dashboard");
      toast.success("Admin logged in");
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminEmail("");
    setCurrentView("home");
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order["status"]) => {
    const next = orders.map((o) =>
      o.id === orderId ? { ...o, status, updatedAt: new Date() } : o
    );
    persistOrders(next);
    toast.success(`Order updated to ${status}`);
  };

  const handleSaveProduct = (productId: string, updates: Partial<Product>) => {
    const next = productsState.map((p) => (p.id === productId ? { ...p, ...updates } : p));
    persistProducts(next);
    toast.success("Product updated");
  };

  const handleAddProduct = (newProduct: Product) => {
    const next = [newProduct, ...productsState];
    persistProducts(next);
    toast.success("Product added");
  };

  const handleDeleteProduct = (productId: string) => {
    const next = productsState.filter((p) => p.id !== productId);
    persistProducts(next);
    toast.success("Product deleted");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      <Header
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        onNavigate={handleNavigate}
        currentView={currentView}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto my-8 px-4 flex-1 w-full">
        {!isAuthenticated && currentView === "home" && (
          <LoginPage onLogin={handleLogin} />
        )}
        {currentView === "admin-login" && (
          <AdminLoginPage onAdminLogin={handleAdminLogin} onBack={() => handleNavigate("home")} />
        )}
        {isAdminAuthenticated && currentView === "admin-dashboard" && (
          <AdminDashboard
            adminEmail={adminEmail}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onLogoutAdmin={handleAdminLogout}
            onNavigateProducts={() => setCurrentView("admin-products")}
          />
        )}
        {isAuthenticated && currentView === "shop" && (
          <Shop products={productsState} onAddToCart={handleAddToCart} />
        )}
        {isAuthenticated && currentView === "contact" && <ContactPage />}
        {isAuthenticated && currentView === "home" && (
          <Shop products={productsState} onAddToCart={handleAddToCart} />
        )}
        {isAdminAuthenticated && currentView === "admin-products" && (
          <AdminProducts
            products={productsState}
            onSaveProduct={handleSaveProduct}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onBack={() => setCurrentView("admin-dashboard")}
          />
        )}
        {isAuthenticated && currentView === "reservation" && (
          <ReservationForm
            cartItems={cartItems}
            userEmail={userEmail}
            onSubmitOrder={handleSubmitOrder}
            onCancel={handleCancelReservation}
          />
        )}
        {isAuthenticated && currentView === "orders" && (
          <OrderStatus
            orders={orders}
            onBackToShop={() => handleNavigate("shop")}
          />
        )}
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}