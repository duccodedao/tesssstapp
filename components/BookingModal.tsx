
import React, { useState } from 'react';
import { StudioService, Order } from '../types';

interface BookingModalProps {
  service: StudioService;
  onClose: () => void;
  onSubmit: (data: Partial<Order>) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ service, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: "09:00",
    location: "",
    phone: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone || !formData.date || !formData.location) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    onSubmit({
      ...formData,
      svcName: service.name,
      total: service.price, // Already calculated total passed in service object
      opts: service.options
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-sm shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-title text-2xl">Xác nhận đặt lịch</h3>
          <button onClick={onClose} className="text-2xl hover:text-neutral-400">&times;</button>
        </div>

        <div className="bg-neutral-50 p-6 mb-8 rounded-sm">
          <p className="text-sm text-neutral-500 mb-1">Gói đã chọn:</p>
          <p className="font-bold text-lg">{service.name}</p>
          {service.options.length > 0 && (
            <p className="text-sm mt-2">Options: {service.options.map(o => o.name).join(', ')}</p>
          )}
          <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between items-center">
            <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">Tổng cộng:</span>
            <span className="font-title text-2xl font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-neutral-500">Ngày chụp (*)</label>
              <input 
                type="date" 
                required 
                className="w-full border border-neutral-200 p-3 rounded-sm focus:ring-1 focus:ring-black outline-none"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-neutral-500">Giờ chụp (*)</label>
              <input 
                type="time" 
                required 
                className="w-full border border-neutral-200 p-3 rounded-sm focus:ring-1 focus:ring-black outline-none"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-neutral-500">Địa điểm chụp (*)</label>
            <input 
              type="text" 
              placeholder="Studio LUX / Ngoại cảnh / Địa chỉ cụ thể..."
              required 
              className="w-full border border-neutral-200 p-3 rounded-sm focus:ring-1 focus:ring-black outline-none"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-neutral-500">Số điện thoại (*)</label>
            <input 
              type="tel" 
              placeholder="09xxx..."
              required 
              className="w-full border border-neutral-200 p-3 rounded-sm focus:ring-1 focus:ring-black outline-none"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 border border-black py-4 uppercase text-xs font-bold hover:bg-neutral-50 transition-colors">Hủy</button>
            <button type="submit" className="flex-1 bg-black text-white py-4 uppercase text-xs font-bold hover:bg-neutral-800 shadow-lg">Đặt ngay</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
