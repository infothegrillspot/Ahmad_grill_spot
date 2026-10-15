import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

const app = express();
app.use(express.json({ limit: '15mb' }));

// Cloudflare D1 Helper Function
async function queryD1(sql: string, params: (string | number | boolean | null)[] = []) {
  const token = process.env.CLOUDFLARE_API_KEY || 'cfat_PFxTthI2rEo43ShG7PXR4d81kQc2Y89rDGtj2nxA9502ca30';
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '5847d87426a6e542bb9b8a61fa6e4fdc';
  const databaseId = process.env.CLOUDFLARE_DATABASE_UUID || 'c41385c3-6bbd-4b69-88c3-d3d155c17cf7';

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    }
  );

  const data = await response.json();
  if (!data.success) {
    console.error('Cloudflare D1 Error:', JSON.stringify(data.errors));
    throw new Error(data.errors?.[0]?.message || 'Cloudflare D1 query failed');
  }

  return data.result?.[0]?.results || [];
}

// -------------------------------------------------------------
// Cloudflare D1 API Endpoints
// -------------------------------------------------------------

// Health & Connection Check
app.get('/api/d1/health', async (_req, res) => {
  try {
    const tables = await queryD1('SELECT name FROM sqlite_master WHERE type="table";');
    res.json({
      status: 'connected',
      database: 'Cloudflare D1 SQL',
      databaseId: process.env.CLOUDFLARE_DATABASE_UUID,
      tables: tables.map((t: any) => t.name),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Accounts: Get User Profile
app.get('/api/d1/account/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await queryD1('SELECT * FROM users WHERE id = ? LIMIT 1;', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const u = users[0];
    res.json({
      id: u.id,
      name: u.name || u.displayName,
      email: u.email,
      phoneNumber: u.phone,
      address: u.address,
      loyaltyPoints: u.flame_points ?? 0,
      photoURL: u.photoURL,
    });
  } catch (error: any) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: error.message });
  }
});

// Accounts: Create or Update Profile
app.post('/api/d1/account', async (req, res) => {
  try {
    const { id, name, email, phoneNumber, loyaltyPoints, photoURL, address } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const existing = await queryD1('SELECT id FROM users WHERE id = ? LIMIT 1;', [id]);

    if (existing.length > 0) {
      await queryD1(
        `UPDATE users SET 
          name = COALESCE(?, name),
          displayName = COALESCE(?, displayName),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          address = COALESCE(?, address),
          photoURL = COALESCE(?, photoURL),
          flame_points = COALESCE(?, flame_points),
          updatedAt = datetime('now')
        WHERE id = ?;`,
        [name || null, name || null, email || null, phoneNumber || null, address || null, photoURL || null, loyaltyPoints ?? null, id]
      );
    } else {
      await queryD1(
        `INSERT INTO users (id, name, displayName, email, phone, address, photoURL, flame_points, role)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'customer');`,
        [id, name || 'Customer', name || 'Customer', email || '', phoneNumber || '', address || '', photoURL || '', loyaltyPoints ?? 50]
      );
    }

    res.json({ success: true, message: 'Account saved to Cloudflare D1 SQL' });
  } catch (error: any) {
    console.error('Error saving account to D1:', error);
    res.status(500).json({ error: error.message });
  }
});

// Orders: Get orders for a user
app.get('/api/d1/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await queryD1(
      `SELECT * FROM orders WHERE customer_id = ? OR userId = ? ORDER BY created_at DESC;`,
      [userId, userId]
    );

    const formatted = orders.map((o: any) => {
      let items = [];
      try {
        items = JSON.parse(o.items_json || o.itemsJson || '[]');
      } catch (e) {
        items = [];
      }
      return {
        id: o.id,
        userId: o.customer_id || o.userId,
        customerName: o.customer_name || o.customerName,
        phoneNumber: o.customer_phone || o.phone,
        email: o.customer_email,
        branch: o.address || 'The Grill Spot - Wapda Town',
        branchAddress: o.delivery_address || o.address,
        paymentMethod: o.payment_method || 'Cash on Delivery',
        estimatedTime: 'Completed',
        subtotal: o.subtotal || 0,
        tax: 0,
        discount: o.discount || 0,
        grandTotal: o.total || o.grandTotal || 0,
        status: o.order_status || o.status || 'placed',
        items,
        createdAt: o.created_at || o.createdAt,
      };
    });

    res.json(formatted);
  } catch (error: any) {
    console.error('Error fetching orders from D1:', error);
    res.status(500).json({ error: error.message });
  }
});

// Orders: Save new order
app.post('/api/d1/orders', async (req, res) => {
  try {
    const order = req.body;
    const itemsJson = JSON.stringify(order.items || []);

    await queryD1(
      `INSERT INTO orders (
        id, customer_id, userId, customer_name, customerName, 
        customer_email, customer_phone, phone, delivery_address, address,
        items_json, itemsJson, subtotal, discount, total, grandTotal,
        payment_method, order_status, status, notes, specialInstructions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        order.id,
        order.userId,
        order.userId,
        order.customerName,
        order.customerName,
        order.email,
        order.phoneNumber,
        order.phoneNumber,
        order.branchAddress,
        order.branch,
        itemsJson,
        itemsJson,
        order.subtotal,
        order.discount,
        order.grandTotal,
        order.grandTotal,
        order.paymentMethod,
        order.status,
        order.status,
        order.instructions || '',
        order.instructions || '',
      ]
    );

    res.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error('Error saving order to D1:', error);
    res.status(500).json({ error: error.message });
  }
});

// Addresses: Get addresses for a user
app.get('/api/d1/addresses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await queryD1(
      `SELECT * FROM addresses WHERE user_id = ? ORDER BY id DESC;`,
      [userId]
    );
    res.json(addresses);
  } catch (error: any) {
    console.error('Error fetching addresses from D1:', error);
    res.status(500).json({ error: error.message });
  }
});

// Addresses: Save address
app.post('/api/d1/addresses', async (req, res) => {
  try {
    const { id, userId, title, address, phone, isDefault } = req.body;
    await queryD1(
      `INSERT OR REPLACE INTO addresses (id, user_id, title, address, phone, is_default)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [id, userId, title, address, phone, isDefault ? 1 : 0]
    );
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error saving address to D1:', error);
    res.status(500).json({ error: error.message });
  }
});

// Addresses: Delete address
app.delete('/api/d1/addresses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await queryD1('DELETE FROM addresses WHERE id = ?;', [id]);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting address from D1:', error);
    res.status(500).json({ error: error.message });
  }
});

// Favourites: Get favourites for a user
app.get('/api/d1/favourites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const rows = await queryD1('SELECT item_id FROM favourites WHERE user_id = ?;', [userId]);
    const itemIds = rows.map((r: any) => r.item_id);
    res.json(itemIds);
  } catch (error: any) {
    console.error('Error fetching favourites from D1:', error);
    res.status(500).json({ error: error.message });
  }
});

// Favourites: Toggle favourite
app.post('/api/d1/favourites', async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    const existing = await queryD1(
      'SELECT id FROM favourites WHERE user_id = ? AND item_id = ? LIMIT 1;',
      [userId, itemId]
    );

    if (existing.length > 0) {
      await queryD1('DELETE FROM favourites WHERE user_id = ? AND item_id = ?;', [userId, itemId]);
      res.json({ saved: false });
    } else {
      const favId = `fav-${Date.now()}`;
      await queryD1(
        'INSERT INTO favourites (id, user_id, item_id, created_at) VALUES (?, ?, ?, datetime("now"));',
        [favId, userId, itemId]
      );
      res.json({ saved: true });
    }
  } catch (error: any) {
    console.error('Error toggling favourite in D1:', error);
    res.status(500).json({ error: error.message });
  }
});

// Images: Save image (Base64 or URL)
app.post('/api/d1/images', async (req, res) => {
  try {
    const { id, userId, imageUrl, title, category } = req.body;
    const imgId = id || `img-${Date.now()}`;
    await queryD1(
      `INSERT INTO images (id, user_id, image_url, title, category, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'));`,
      [imgId, userId || 'anonymous', imageUrl, title || 'Upload', category || 'general']
    );
    res.json({ success: true, imageId: imgId });
  } catch (error: any) {
    console.error('Error saving image to D1:', error);
    res.status(500).json({ error: error.message });
  }
});

// Images: Get images for a user or general
app.get('/api/d1/images/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const images = await queryD1(
      `SELECT * FROM images WHERE user_id = ? OR user_id = 'public' ORDER BY created_at DESC;`,
      [userId]
    );
    res.json(images);
  } catch (error: any) {
    console.error('Error fetching images from D1:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// Vite Server Integration
// -------------------------------------------------------------
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT} with Cloudflare D1 SQL integration`);
  });
}

startServer();
