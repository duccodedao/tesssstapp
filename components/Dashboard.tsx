
import React, { useState, useMemo } from 'react';
import { User, Order, StudioService, OrderStatus } from '../types';

interface DashboardProps {
  currentUser: User | null;
  orders: Order[];
  services: StudioService[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onDeliver: (id: string, link: string, pass: string) => void;
  onOpenServiceForm: (svc: StudioService | null) => void;
  onDeleteService: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  currentUser, orders, services, onUpdateStatus, onDeliver, onOpenServiceForm, onDeleteService 
}) => {
  const [activeTab, setActiveTab] = useState(currentUser?.isAdmin ? 'admin-orders' : 'my-orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliverData, setDeliverData] = useState<{ id: string, link: string, pass: string } | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = !searchTerm || 
        o.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.phone.includes(searchTerm) || 
        o.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = !statusFilter || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const scheduleOrders = useMemo(() => {
    return orders.filter(o => o.date === scheduleDate && (o.status === OrderStatus.DEPOSITED || o.status === OrderStatus.COMPLETED));
  }, [orders, scheduleDate]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === OrderStatus.PENDING).length;
    const deposited = orders.filter(o => o.status === OrderStatus.DEPOSITED).length;
    const completed = orders.filter(o => o.status === OrderStatus.COMPLETED).length;
    const cancelled = orders.filter(o => o.status === OrderStatus.CANCELLED).length;
    const rate = (total - cancelled) > 0 ? ((completed / (total - cancelled)) * 100).toFixed(1) : "0";
    return { total, pending, deposited, completed, rate };
  }, [orders]);

  if (!currentUser) return <div className="p-20 text-center">Vui lòng đăng nhập</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="font-title text-3xl mb-12">Khu vực quản lý</h2>

      <div className="flex flex-wrap gap-4 border-b border-neutral-200 mb-12">
        <TabButton id="my-orders" label="Đơn của tôi" active={activeTab} onClick={setActiveTab} />
        {currentUser.isAdmin && (
          <>
            <TabButton id="admin-orders" label="Tất cả đơn (Admin)" active={activeTab} onClick={setActiveTab} />
            <TabButton id="admin-schedule" label="Lịch chụp (Admin)" active={activeTab} onClick={setActiveTab} />
            <TabButton id="admin-services" label="Gói dịch vụ (Admin)" active={activeTab} onClick={setActiveTab} />
          </>
        )}
      </div>

      <div className="animate-fade-in">
        {activeTab === 'my-orders' && (
          <OrderTable orders={orders.filter(o => o.uid === currentUser.uid)} />
        )}

        {activeTab === 'admin-orders' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <StatCard label="Tổng đơn" value={stats.total} color="green" />
              <StatCard label="Đã cọc" value={stats.deposited} color="blue" />
              <StatCard label="Chờ duyệt" value={stats.pending} color="yellow" />
              <StatCard label="Tỷ lệ hoàn thành" value={`${stats.rate}%`} color="red" />
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <input 
                className="flex-grow border border-neutral-200 p-3 outline-none focus:ring-1 focus:ring-black"
                placeholder="Tìm khách hàng, SĐT, địa điểm..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <select 
                className="border border-neutral-200 p-3 outline-none"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <OrderTable 
              orders={filteredOrders} 
              isAdmin 
              onUpdateStatus={onUpdateStatus} 
              onDeliverClick={(id) => setDeliverData({ id, link: '', pass: '' })}
            />
          </div>
        )}

        {activeTab === 'admin-schedule' && (
          <div className="max-w-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold uppercase tracking-widest text-xs">Lịch đã duyệt</h3>
              <input 
                type="date" 
                className="border border-neutral-200 p-2 rounded-sm" 
                value={scheduleDate} 
                onChange={e => setScheduleDate(e.target.value)}
              />
            </div>
            {scheduleOrders.length > 0 ? (
              <div className="space-y-4">
                {scheduleOrders.map(o => (
                  <div key={o.id} className="bg-neutral-50 p-6 flex justify-between items-center border border-neutral-100 rounded-sm">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-lg">{o.time}</span>
                        <span className="text-neutral-400">|</span>
                        <span className="font-semibold">{o.svcName}</span>
                      </div>
                      <p className="text-sm text-neutral-500">{o.location}</p>
                      <p className="text-xs mt-2">{o.email} - {o.phone}</p>
                    </div>
                    <Badge status={o.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-neutral-50 rounded-sm border border-dashed border-neutral-200 text-neutral-400">
                Không có lịch nào được duyệt trong ngày này.
              </div>
            )}
          </div>
        )}

        {activeTab === 'admin-services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {services.map(s => (
               <div key={s.id} className="border border-neutral-200 p-8 rounded-sm hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-lg mb-2">{s.name}</h4>
                    <p className="text-2xl font-title mb-4">{new Intl.NumberFormat('vi-VN').format(s.price)}đ</p>
                    <p className="text-sm text-neutral-500 mb-6 line-clamp-2">{s.desc}</p>
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-neutral-50">
                    <button onClick={() => onOpenServiceForm(s)} className="text-[10px] uppercase font-bold text-neutral-400 hover:text-black transition-colors">Sửa</button>
                    <button onClick={() => onDeleteService(s.id)} className="text-[10px] uppercase font-bold text-red-400 hover:text-red-600 transition-colors">Xóa</button>
                  </div>
               </div>
             ))}
             <button 
                onClick={() => onOpenServiceForm(null)}
                className="border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center p-12 text-neutral-400 hover:text-black hover:border-black transition-all group"
             >
               <i className="fas fa-plus text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
               <span className="text-xs uppercase font-bold tracking-widest">Tạo gói mới</span>
             </button>
          </div>
        )}
      </div>

      {deliverData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-8 rounded-sm">
            <h3 className="font-title text-2xl mb-6">Trả ảnh khách hàng</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-2">Link Google Drive / Gallery</label>
                <input 
                  className="w-full border p-3" 
                  value={deliverData.link} 
                  onChange={e => setDeliverData({ ...deliverData, link: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-2">Mật khẩu truy cập (Nếu có)</label>
                <input 
                  className="w-full border p-3" 
                  value={deliverData.pass} 
                  onChange={e => setDeliverData({ ...deliverData, pass: e.target.value })} 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setDeliverData(null)} className="flex-1 border border-black py-4 text-xs font-bold uppercase">Hủy</button>
                <button 
                  onClick={() => {
                    onDeliver(deliverData.id, deliverData.link, deliverData.pass);
                    setDeliverData(null);
                  }} 
                  className="flex-1 bg-black text-white py-4 text-xs font-bold uppercase"
                >
                  Gửi ảnh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ id: string, label: string, active: string, onClick: (id: string) => void }> = ({ id, label, active, onClick }) => (
  <button 
    onClick={() => onClick(id)}
    className={`pb-4 px-2 text-xs uppercase tracking-widest font-bold transition-all border-b-2 ${active === id ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
  >
    {label}
  </button>
);

const StatCard: React.FC<{ label: string, value: string | number, color: string }> = ({ label, value, color }) => {
  const colors: Record<string, string> = {
    green: 'border-green-500 bg-green-50',
    blue: 'border-blue-500 bg-blue-50',
    yellow: 'border-yellow-500 bg-yellow-50',
    red: 'border-red-500 bg-red-50'
  };
  return (
    <div className={`p-6 border-l-4 rounded-sm ${colors[color]}`}>
      <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

const OrderTable: React.FC<{ 
  orders: Order[], 
  isAdmin?: boolean, 
  onUpdateStatus?: (id: string, s: OrderStatus) => void,
  onDeliverClick?: (id: string) => void
}> = ({ orders, isAdmin, onUpdateStatus, onDeliverClick }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-neutral-100 text-[10px] uppercase font-bold tracking-widest text-neutral-400">
          <th className="py-4 pr-4">Ngày/Giờ chụp</th>
          <th className="py-4 px-4">Thông tin khách</th>
          <th className="py-4 px-4">Gói / Địa điểm</th>
          <th className="py-4 px-4">Tổng tiền</th>
          <th className="py-4 px-4">Trạng thái</th>
          <th className="py-4 pl-4 text-right">Hành động</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100">
        {orders.length === 0 ? (
          <tr><td colSpan={6} className="py-12 text-center text-neutral-400">Không có đơn hàng nào.</td></tr>
        ) : (
          orders.map(o => (
            <tr key={o.id} className="text-sm group">
              <td className="py-6 pr-4">
                <div className="font-bold">{o.date}</div>
                <div className="text-xs text-neutral-400">{o.time}</div>
              </td>
              <td className="py-6 px-4">
                <div className="font-medium">{o.email}</div>
                <div className="text-xs text-neutral-500">{o.phone}</div>
              </td>
              <td className="py-6 px-4">
                <div className="font-medium">{o.svcName}</div>
                <div className="text-xs text-neutral-500 italic truncate max-w-[150px]">{o.location}</div>
              </td>
              <td className="py-6 px-4 font-medium">
                {new Intl.NumberFormat('vi-VN').format(o.total)}đ
              </td>
              <td className="py-6 px-4">
                {isAdmin ? (
                  <select 
                    className="border-none bg-neutral-100 p-2 text-xs font-bold rounded-sm outline-none"
                    value={o.status}
                    onChange={(e) => onUpdateStatus?.(o.id, e.target.value as OrderStatus)}
                  >
                    {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <Badge status={o.status} />
                )}
              </td>
              <td className="py-6 pl-4 text-right">
                {isAdmin && o.status !== OrderStatus.COMPLETED && (
                  <button 
                    onClick={() => onDeliverClick?.(o.id)}
                    className="text-[10px] uppercase font-bold border border-black px-4 py-2 hover:bg-black hover:text-white transition-all"
                  >
                    Trả ảnh
                  </button>
                )}
                {!isAdmin && o.status === OrderStatus.COMPLETED && o.deliveryLink && (
                  <a 
                    href={o.deliveryLink} 
                    target="_blank" 
                    className="text-[10px] uppercase font-bold bg-green-500 text-white px-4 py-2 rounded-sm shadow-md"
                  >
                    Nhận ảnh
                  </a>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const Badge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const styles: Record<string, string> = {
    [OrderStatus.PENDING]: 'bg-amber-50 text-amber-600',
    [OrderStatus.DEPOSITED]: 'bg-blue-50 text-blue-600',
    [OrderStatus.COMPLETED]: 'bg-green-50 text-green-600',
    [OrderStatus.CANCELLED]: 'bg-red-50 text-red-600',
  };
  return (
    <span className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

export default Dashboard;
