
export enum OrderStatus {
  PENDING = "Chờ xác nhận",
  DEPOSITED = "Đã cọc",
  COMPLETED = "Hoàn thành",
  CANCELLED = "Đã hủy"
}

export interface ServiceOption {
  name: string;
  price: number;
}

export interface StudioService {
  id: string;
  name: string;
  price: number;
  desc: string;
  options: ServiceOption[];
}

export interface Order {
  id: string;
  uid: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  svcName: string;
  opts: ServiceOption[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  deliveryLink?: string;
  deliveryPass?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  isAdmin: boolean;
}
