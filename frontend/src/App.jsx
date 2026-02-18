import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';

import HeroSection from './components/Hero';
import CartPanel from './components/CartPanel';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import PopularCarousel from './components/Home/PopularCarousel';
import DealsSection from './components/Home/DealsSection';
import RegisterForm from './components/Auth/RegisterForm';

import { useCart } from './hooks/useCart';
import { useProducts } from './hooks/useProducts';
import { useMediaQuery } from './hooks/useMediaQuery';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('pokemart-theme') || 'light');
  const location = useLocation();
  const isAuthPage = location.pathname === '/register';

  const { cartItems, isCartOpen, setIsCartOpen, addItemToCart, removeItemFromCart, updateItemQuantity, cartTotal } = useCart();
  const { popularCards, dealCards, status, statusMessage, loadCards } = useProducts();
  const isMobile = useMediaQuery('(max-width: 540px)');

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

  // Componente para la HomePage
  const HomePage = () => (
    <>
      <HeroSection theme={theme} />
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
      />

      <main style={{ minHeight: '80vh', paddingTop: location.pathname === '/' ? '0' : '0' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </main>

      <Footer backendStatus="online" />
    </>
  );
}

export default App;