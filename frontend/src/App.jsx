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
import VideoNewsSection from './components/VideoNewsSection/VideoNewsSection';
import Catalog from './components/Catalog/Catalog';

import { useCart } from './hooks/useCart';
import { useProducts } from './hooks/useProducts';
import { useMediaQuery } from './hooks/useMediaQuery';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('pokemart-theme') || 'light');
  const location = useLocation();
  const isAuthPage = location.pathname === '/register';

  const { cartItems, isCartOpen, setIsCartOpen, addItemToCart, removeItemFromCart, updateItemQuantity, cartTotal } = useCart();
  const { popularCards, dealCards, catalogCards, status, statusMessage, loadCards } = useProducts();
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

  const HomePage = () => (
    <>
      {/* <HeroSection theme={theme} /> */}
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

          <Route
            path="/catalog"
            element={
              <Catalog
                cards={catalogCards}
                status={status}
                statusMessage={statusMessage}
                onAdd={addItemToCart}
                onSearch={loadCards}
              />
            }
          />
        </Routes>
      </main>

      <Footer backendStatus="offline" />
    </>
  );
}

export default App;