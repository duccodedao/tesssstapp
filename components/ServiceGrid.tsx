
import React, { useState } from 'react';
import { StudioService, ServiceOption } from '../types';

interface ServiceGridProps {
  services: StudioService[];
  onBooking: (svc: StudioService) => void;
  isAdmin?: boolean;
  onEdit?: (svc: StudioService) => void;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ services, onBooking, isAdmin, onEdit }) => {
  return (
    <div className="flex overflow-x-auto gap-8 pb-8 hide-scrollbar snap-x">
      {services.map(s => (
        <ServiceCard key={s.id} service={s} onBooking={onBooking} isAdmin={isAdmin} onEdit={onEdit} />
      ))}
    </div>
  );
};

const ServiceCard: React.FC<{ 
  service: StudioService, 
  onBooking: (svc: StudioService) => void,
  isAdmin?: boolean,
  onEdit?: (svc: StudioService) => void
}> = ({ service, onBooking, isAdmin, onEdit }) => {
  const [selectedOpts, setSelectedOpts] = useState<ServiceOption[]>([]);
  
  const toggleOpt = (opt: ServiceOption) => {
    setSelectedOpts(prev => 
      prev.find(o => o.name === opt.name) 
        ? prev.filter(o => o.name !== opt.name) 
        : [...prev, opt]
    );
  };

  const totalPrice = service.price + selectedOpts.reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="min-w-[320px] md:min-w-[380px] bg-white border border-neutral-200 p-8 rounded-sm snap-start hover:shadow-2xl transition-all group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-xl tracking-tight">{service.name}</h3>
        <div className="font-title text-2xl font-bold text-black">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
        </div>
      </div>
      <p className="text-neutral-500 text-sm mb-8 leading-relaxed h-12 overflow-hidden italic">
        {service.desc}
      </p>

      {service.options && service.options.length > 0 && (
        <div className="border-t border-neutral-100 pt-6 mb-8">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-4 text-neutral-400">Tùy chọn thêm:</p>
          <div className="space-y-3">
            {service.options.map((opt, idx) => (
              <label key={idx} className="flex justify-between items-center text-sm cursor-pointer hover:text-black transition-colors">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    className="accent-black w-4 h-4" 
                    onChange={() => toggleOpt(opt)}
                  />
                  <span className="text-neutral-600">{opt.name}</span>
                </div>
                <span className="font-medium text-black">+{new Intl.NumberFormat('vi-VN').format(opt.price)}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={() => onBooking({ ...service, options: selectedOpts, price: totalPrice })}
        className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-neutral-800 transition-colors"
      >
        Đăng ký gói này
      </button>

      {isAdmin && onEdit && (
        <button 
          onClick={() => onEdit(service)}
          className="w-full mt-2 text-[10px] uppercase font-bold text-neutral-400 hover:text-black"
        >
          Sửa Gói (Admin)
        </button>
      )}
    </div>
  );
};

export default ServiceGrid;
