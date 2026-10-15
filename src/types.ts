export interface AddOnOption {
  id: string;
  name: string;
  price: number;
}

export interface ChoiceGroup {
  id: string;
  name: string;
  required: boolean;
  options: {
    id: string;
    name: string;
    priceDelta?: number;
  }[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  tagBadge?: 'New' | 'Popular' | 'Best Seller' | 'Crispy';
  image: string;
  choiceGroups?: ChoiceGroup[];
  addOns?: AddOnOption[];
}

export interface CartItem {
  cartId: string;
  item: MenuItem;
  quantity: number;
  selectedChoices: Record<string, string>; // choiceGroupId -> optionName
  selectedAddOns: AddOnOption[];
  instructions?: string;
  totalItemPrice: number;
}

export interface Branch {
  id: string;
  name: string;
  area: string;
  address: string;
  isOpen: boolean;
  phone: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  loyaltyPoints: number;
  offerNotifications: boolean;
  photoURL?: string;
}

export interface UserAddress {
  id: string;
  title: string;
  address: string;
  phone: string;
  isDefault?: boolean;
}

export interface OrderRecord {
  id: string;
  userId: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  orderType: 'pickup' | 'delivery';
  branch: string;
  branchAddress: string;
  instructions: string;
  paymentMethod: string;
  estimatedTime: string;
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  status: 'placed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  items: {
    name: string;
    quantity: number;
    price: number;
    details: string;
  }[];
  createdAt: string;
}
