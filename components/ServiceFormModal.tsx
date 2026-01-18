
import React, { useState, useEffect } from 'react';
import { StudioService, ServiceOption } from '../types';

interface ServiceFormModalProps {
  service?: StudioService | null;
  onClose: () => void;
  onSubmit: (svc: StudioService) => void;
}

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({ service, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Omit<StudioService, 'id'>>({
    name: '',
    price: 0,
    desc: '',
    options: []
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        price: service.price,
        desc: service.desc,
        options: service.options || []
      });
    }
  }, [service]);

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { name: '', price: 0 }]
    });
  };

  const handleOptionChange = (index: number, field: keyof ServiceOption, value: string | number) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: service?.id || `svc-${Date.now()}`,
      ...formData
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-sm shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-title text-2xl">{service ? 'Sửa gói dịch vụ' : 'Thêm gói mới'}</h3>
          <button onClick={onClose} className="text-2xl hover:text-neutral-400">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-neutral-500">Tên gói dịch vụ (*)</label>
            <input 
              type="text" 
              required 
              className="w-full border border-neutral-200 p-3 rounded-sm focus:ring-1 focus:ring-black outline-none"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-neutral-500">Giá cơ bản (VND) (*)</label>
              <input 
                type="number" 
                required 
                className="w-full border border-neutral-200 p-3 rounded-sm focus:ring-1 focus:ring-black outline-none"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-neutral-500">Mô tả gói</label>
            <textarea 
              rows={3}
              className="w-full border border-neutral-200 p-3 rounded-sm focus:ring-1 focus:ring-black outline-none"
              value={formData.desc}
              onChange={e => setFormData({ ...formData, desc: e.target.value })}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500">Tùy chọn thêm (Options)</label>
              <button 
                type="button" 
                onClick={handleAddOption}
                className="text-[10px] uppercase font-bold text-blue-600 hover:underline"
              >
                + Thêm tùy chọn
              </button>
            </div>
            <div className="space-y-3">
              {formData.options.map((opt, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input 
                    placeholder="Tên tùy chọn"
                    className="flex-grow border border-neutral-200 p-2 text-sm outline-none"
                    value={opt.name}
                    onChange={e => handleOptionChange(idx, 'name', e.target.value)}
                  />
                  <input 
                    type="number"
                    placeholder="Giá"
                    className="w-32 border border-neutral-200 p-2 text-sm outline-none"
                    value={opt.price}
                    onChange={e => handleOptionChange(idx, 'price', Number(e.target.value))}
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveOption(idx)}
                    className="text-red-400 hover:text-red-600 px-2"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-neutral-100">
            <button type="button" onClick={onClose} className="flex-1 border border-black py-4 uppercase text-xs font-bold hover:bg-neutral-50 transition-colors">Hủy</button>
            <button type="submit" className="flex-1 bg-black text-white py-4 uppercase text-xs font-bold hover:bg-neutral-800 shadow-lg">
              {service ? 'Cập nhật' : 'Tạo gói'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceFormModal;
