
import { StudioService, Order, OrderStatus } from './types';

export const ADMIN_EMAIL = "admin@luxstudio.vn";

export const initialServices: StudioService[] = [
  {
    id: "svc-1",
    name: "Standard Portrait",
    price: 1500000,
    desc: "Gói chân dung cơ bản dành cho cá nhân, sinh viên. Chụp tại Studio.",
    options: [
      { name: "Make up chuyên nghiệp", price: 300000 },
      { name: "In ảnh album (10 trang)", price: 500000 }
    ]
  },
  {
    id: "svc-2",
    name: "Concept Fine-art",
    price: 3500000,
    desc: "Gói nghệ thuật cao cấp với Concept thiết kế riêng. Stylist hỗ trợ toàn bộ.",
    options: [
      { name: "Thuê trang phục thiết kế", price: 1000000 },
      { name: "Chụp thêm 1 Concept", price: 1500000 }
    ]
  },
  {
    id: "svc-3",
    name: "Wedding Pre-shoot",
    price: 8000000,
    desc: "Gói chụp ngoại cảnh dành cho các cặp đôi. Đã bao gồm xe di chuyển.",
    options: [
      { name: "Quay phim Behind the Scenes", price: 2000000 }
    ]
  },
  {
    id: "svc-4",
    name: "Commercial Lookbook",
    price: 5000000,
    desc: "Dành cho thương hiệu thời trang. Chụp 20-30 bộ trang phục.",
    options: [
      { name: "Người mẫu chuyên nghiệp", price: 2500000 }
    ]
  }
];

export const mockOrders: Order[] = [
  {
    id: "ord-1",
    uid: "user-123",
    email: "client@example.com",
    phone: "0901234567",
    date: "2024-12-25",
    time: "09:00",
    location: "Studio Quận 1",
    svcName: "Standard Portrait",
    opts: [{ name: "Make up chuyên nghiệp", price: 300000 }],
    total: 1800000,
    status: OrderStatus.DEPOSITED,
    createdAt: "2024-11-20T10:00:00Z"
  }
];
