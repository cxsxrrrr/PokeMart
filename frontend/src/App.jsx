import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';

import HeroSection2 from './components/Hero/Hero2';
import CartPanel from './components/CartPanel';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import PopularCarousel from './components/Home/PopularCarousel';
import DealsSection from './components/Home/DealsSection';
import HowItWorksSection from './components/HowItWorks';
import RegisterForm from './components/Auth/RegisterForm';
import LoginForm from './components/Auth/LoginForm';
import LogoutForm from './components/Auth/LogoutForm';
import VideoNewsSection from './components/VideoNewsSection/VideoNewsSection';
import Catalog from './components/Catalog/Catalog';
import About from './components/About/About';
import Dashboard from './components/Dashboard/Dashboard';
import Terms from './components/Legal/Terms';
import Privacy from './components/Legal/Privacy';
import NegotiationChat from './components/Dashboard/NegotiationChat';
import HomeFeed from './components/Home/HomeFeed';

import { useCart } from './hooks/useCart';
import { useProducts } from './hooks/useProducts';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('pokemart-theme') || 'light');
  const location = useLocation();
  const isAuthPage = location.pathname === '/register' || location.pathname === '/login';

  const { cartItems, isCartOpen, setIsCartOpen, addItemToCart, removeItemFromCart, updateItemQuantity, cartTotal, loading: cartLoading } = useCart();
  const { popularCards, dealCards, catalogCards, status, statusMessage, loadCards } = useProducts();
  const isMobile = useMediaQuery('(max-width: 540px)');
  const { user, checkCurrentUser } = useAuth();

  useEffect(() => {
    checkCurrentUser();
  }, [checkCurrentUser]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('pokemart-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const HomePage = () => (
    <>
      <HeroSection2 />
      <HowItWorksSection />
      <PopularCarousel
        cards={popularCards}
        status={status}
        statusMessage={statusMessage}
        onAdd={addItemToCart}
        isMobile={isMobile}
      />
      <DealsSection
        cards={dealCards}
        status={status}
        statusMessage={statusMessage}
        onAdd={addItemToCart}
      />
      <VideoNewsSection />
    </>
  );

  return (
    <>
      <GlobalStyle />

      {!isAuthPage && (
        <Header
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onSearch={loadCards}
          user={user}
        />
      )}

      <CartPanel
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onIncrease={(id) => updateItemQuantity(id, 1)}
        onDecrease={(id) => updateItemQuantity(id, -1)}
        onRemove={removeItemFromCart}
        total={cartTotal}
        loading={cartLoading}
      />

      <main style={{ minHeight: '80vh', paddingTop: (location.pathname === '/' && !user) ? '0' : '45px' }}>
        <Routes>
          <Route path="/" element={user ? <HomeFeed onAdd={addItemToCart} /> : <HomePage />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <LoginForm />} />
          <Route path="/dashboard/negotiations/:id" element={user ? <NegotiationChat /> : <LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<LogoutForm />} />
          <Route path="/catalog" element={<Catalog onAdd={addItemToCart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer backendStatus="offline" />}
    </>
  );
}

export default App;