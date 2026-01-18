
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import ServiceGrid from './components/ServiceGrid';
import Dashboard from './components/Dashboard';
import BookingModal from './components/BookingModal';
import ServiceFormModal from './components/ServiceFormModal';
import { StudioService, Order, User, OrderStatus } from './types';
import { initialServices, mockOrders, ADMIN_EMAIL } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'dashboard'>('home');
  const [services, setServices] = useState<StudioService[]>(initialServices);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<StudioService | null>(null);
  
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<StudioService | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Mock Authentication
  const login = () => {
    const mockUser: User = {
      uid: "user-123",
      email: "client@example.com",
      displayName: "Guest User",
      photoURL: "https://picsum.photos/100",
      isAdmin: false
    };
    setCurrentUser(mockUser);
    showToast("Đăng nhập thành công");
  };

  const loginAdmin = () => {
    const mockAdmin: User = {
      uid: "VYIs9XHLR9RMStwtcdwMrOIo33w1",
      email: ADMIN_EMAIL,
      displayName: "Lux Studio Admin",
      photoURL: "https://picsum.photos/101",
      isAdmin: true
    };
    setCurrentUser(mockAdmin);
    showToast("Đăng nhập Admin thành công");
  };

  const logout = () => {
    setCurrentUser(null);
    setView('home');
    showToast("Đã đăng xuất");
  };

  const handleBooking = (svc: StudioService) => {
    if (!currentUser) {
      showToast("Vui lòng đăng nhập để đặt lịch");
      login(); 
      return;
    }
    setSelectedService(svc);
    setIsBookingOpen(true);
  };

  const submitBooking = (newOrderData: Partial<Order>) => {
    if (!currentUser) return;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      uid: currentUser.uid,
      email: currentUser.email,
      createdAt: new Date().toISOString(),
      status: OrderStatus.PENDING,
      ...newOrderData
    } as Order;
    
    setOrders(prev => [newOrder, ...prev]);
    setIsBookingOpen(false);
    showToast("Đã gửi yêu cầu đặt lịch!");
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    if (!currentUser?.isAdmin) return;

    if (status === OrderStatus.DEPOSITED || status === OrderStatus.COMPLETED) {
      const currentOrder = orders.find(o => o.id === orderId);
      if (currentOrder) {
        const conflict = orders.find(o => 
          o.id !== orderId &&
          o.date === currentOrder.date &&
          o.time === currentOrder.time &&
          o.location === currentOrder.location &&
          (o.status === OrderStatus.DEPOSITED || o.status === OrderStatus.COMPLETED)
        );
        if (conflict) {
          if (!window.confirm(`CẢNH BÁO: Lịch ngày ${currentOrder.date} lúc ${currentOrder.time} tại ${currentOrder.location} đã TRÙNG với đơn hàng khác. Bạn vẫn muốn tiếp tục?`)) {
            return;
          }
        }
      }
    }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast("Đã cập nhật trạng thái");
  };

  const deliverJob = (orderId: string, link: string, pass: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { 
      ...o, 
      status: OrderStatus.COMPLETED, 
      deliveryLink: link, 
      deliveryPass: pass 
    } : o));
    showToast("Đã trả ảnh thành công");
  };

  const openServiceEdit = (svc: StudioService | null) => {
    setEditingService(svc);
    setIsServiceModalOpen(true);
  };

  const saveService = (svc: StudioService) => {
    setServices(prev => {
      const exists = prev.find(s => s.id === svc.id);
      if (exists) return prev.map(s => s.id === svc.id ? svc : s);
      return [...prev, svc];
    });
    setIsServiceModalOpen(false);
    showToast(editingService ? "Đã cập nhật gói dịch vụ" : "Đã tạo gói dịch vụ mới");
  };

  const deleteService = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa gói dịch vụ này?")) {
      setServices(prev => prev.filter(s => s.id !== id));
      showToast("Đã xóa gói dịch vụ");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentUser={currentUser} 
        onLogin={login} 
        onLoginAdmin={loginAdmin}
        onLogout={logout} 
        onGoHome={() => setView('home')} 
        onGoDash={() => setView('dashboard')}
      />

      <main className="flex-grow">
        {view === 'home' ? (
          <>
            <Hero />
            <Marquee />
            <section id="services" className="max-w-7xl mx-auto px-4 py-16">
              <h2 className="font-title text-4xl md:text-5xl text-center mb-12">Gói chụp (Services)</h2>
              <ServiceGrid 
                services={services} 
                onBooking={handleBooking} 
                isAdmin={currentUser?.isAdmin || false}
                onEdit={openServiceEdit}
              />
            </section>
          </>
        ) : (
          <Dashboard 
            currentUser={currentUser} 
            orders={orders} 
            services={services}
            onUpdateStatus={updateOrderStatus}
            onDeliver={deliverJob}
            onOpenServiceForm={openServiceEdit}
            onDeleteService={deleteService}
          />
        )}
      </main>

      <footer className="bg-neutral-50 border-t border-neutral-200 py-8 text-center text-sm text-neutral-500">
        <p>&copy; 2024 LUX Photography Studio. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <button onClick={loginAdmin} className="hover:text-black">Demo Admin</button>
          <button onClick={login} className="hover:text-black">Demo Client</button>
        </div>
      </footer>

      {isBookingOpen && selectedService && (
        <BookingModal 
          service={selectedService} 
          onClose={() => setIsBookingOpen(false)} 
          onSubmit={submitBooking}
        />
      )}

      {isServiceModalOpen && (
        <ServiceFormModal 
          service={editingService} 
          onClose={() => setIsServiceModalOpen(false)} 
          onSubmit={saveService} 
        />
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-md shadow-2xl z-[2000] text-sm font-medium transition-all">
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;
