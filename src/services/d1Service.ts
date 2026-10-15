import { UserProfile, UserAddress, OrderRecord } from '../types.ts';

export interface D1ImageRecord {
  id: string;
  user_id: string;
  image_url: string;
  title: string;
  category: string;
  created_at: string;
}

export const d1Service = {
  // Check Health & Connection
  async checkHealth(): Promise<{ status: string; tables: string[] }> {
    try {
      const res = await fetch('/api/d1/health');
      return await res.json();
    } catch (e) {
      console.error('Failed to check D1 health:', e);
      return { status: 'error', tables: [] };
    }
  },

  // Save Account Profile
  async saveAccount(profile: UserProfile): Promise<boolean> {
    try {
      const res = await fetch('/api/d1/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to save account to Cloudflare D1:', err);
      return false;
    }
  },

  // Fetch Account Profile
  async getAccount(userId: string): Promise<Partial<UserProfile> | null> {
    try {
      const res = await fetch(`/api/d1/account/${userId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch account from Cloudflare D1:', err);
      return null;
    }
  },

  // Save Order
  async saveOrder(order: OrderRecord): Promise<boolean> {
    try {
      const res = await fetch('/api/d1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to save order to Cloudflare D1:', err);
      return false;
    }
  },

  // Fetch Orders for user
  async getOrders(userId: string): Promise<OrderRecord[]> {
    try {
      const res = await fetch(`/api/d1/orders/${userId}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch orders from Cloudflare D1:', err);
      return [];
    }
  },

  // Save Address
  async saveAddress(address: UserAddress, userId: string): Promise<boolean> {
    try {
      const res = await fetch('/api/d1/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...address, userId }),
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to save address to Cloudflare D1:', err);
      return false;
    }
  },

  // Fetch Addresses for user
  async getAddresses(userId: string): Promise<UserAddress[]> {
    try {
      const res = await fetch(`/api/d1/addresses/${userId}`);
      if (!res.ok) return [];
      const rows = await res.json();
      return rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        address: r.address,
        phone: r.phone,
        isDefault: Boolean(r.is_default),
      }));
    } catch (err) {
      console.error('Failed to fetch addresses from Cloudflare D1:', err);
      return [];
    }
  },

  // Delete Address
  async deleteAddress(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/d1/addresses/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (err) {
      console.error('Failed to delete address from Cloudflare D1:', err);
      return false;
    }
  },

  // Toggle Favourite
  async toggleFavourite(userId: string, itemId: string): Promise<boolean> {
    try {
      const res = await fetch('/api/d1/favourites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId }),
      });
      const data = await res.json();
      return data.saved;
    } catch (err) {
      console.error('Failed to toggle favourite in Cloudflare D1:', err);
      return false;
    }
  },

  // Fetch Favourites
  async getFavourites(userId: string): Promise<string[]> {
    try {
      const res = await fetch(`/api/d1/favourites/${userId}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch favourites from Cloudflare D1:', err);
      return [];
    }
  },

  // Save Image (Food photo, recipe, receipt or profile)
  async saveImage(userId: string, imageUrl: string, title: string, category: string): Promise<boolean> {
    try {
      const res = await fetch('/api/d1/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, imageUrl, title, category }),
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to save image to Cloudflare D1:', err);
      return false;
    }
  },

  // Fetch Saved Images
  async getImages(userId: string): Promise<D1ImageRecord[]> {
    try {
      const res = await fetch(`/api/d1/images/${userId}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch images from Cloudflare D1:', err);
      return [];
    }
  },
};
