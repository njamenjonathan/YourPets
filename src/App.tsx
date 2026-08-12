import React from 'react';
import { PetStoreProvider, usePetStore } from './context/PetStoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';

import { QuickViewModal } from './components/QuickViewModal';
import { AiQuizModal } from './components/AiQuizModal';
import { ReserveModal } from './components/ReserveModal';
import { LiveChatDrawer } from './components/LiveChatDrawer';
import { AuthModal } from './components/AuthModal';
import { PetBreedIdentifierModal } from './components/PetBreedIdentifierModal';

import { HomeView } from './views/HomeView';
import { BrowseView } from './views/BrowseView';
import { PetDetailView } from './views/PetDetailView';
import { WishlistView } from './views/WishlistView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { UserDashboardView } from './views/UserDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { HealthGuaranteeView } from './views/HealthGuaranteeView';
import { PetCareView } from './views/PetCareView';
import { BreedersView } from './views/BreedersView';
import { FaqsView } from './views/FaqsView';
import { ContactView } from './views/ContactView';

const MainContent: React.FC = () => {
  const { activeTab, notification } = usePetStore();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'browse':
        return <BrowseView />;
      case 'pet-detail':
        return <PetDetailView />;
      case 'wishlist':
        return <WishlistView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-tracking':
        return <OrderTrackingView />;
      case 'dashboard':
        return <UserDashboardView />;
      case 'admin':
        return <AdminDashboardView />;
      case 'health-guarantee':
        return <HealthGuaranteeView />;
      case 'pet-care':
        return <PetCareView />;
      case 'breeders':
        return <BreedersView />;
      case 'faqs':
        return <FaqsView />;
      case 'contact':
        return <ContactView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] dark:bg-[#121417] text-[#1a1c1c] dark:text-[#f0f1f1] transition-colors">
      <Header />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 pt-24">
        <section key={activeTab} className="page-transition" aria-live="polite">
          {renderActiveTab()}
        </section>
      </main>

      <Footer />
      <MobileBottomNav />

      {/* Global Modals & Drawers */}
      <QuickViewModal />
      <AiQuizModal />
      <ReserveModal />
      <LiveChatDrawer />
      <AuthModal />
      <PetBreedIdentifierModal />

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-[#002045] text-white px-6 py-3 rounded-full text-xs font-semibold shadow-2xl border border-white/20 animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          {notification}
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <PetStoreProvider>
      <MainContent />
    </PetStoreProvider>
  );
}

export default App;
