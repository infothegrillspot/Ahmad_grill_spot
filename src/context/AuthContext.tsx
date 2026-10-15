import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  fbSignOut, 
  onAuthStateChanged, 
  FirebaseUser,
  db,
  handleFirestoreError,
  OperationType
} from '../firebase.ts';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserProfile, UserAddress } from '../types.ts';
import { d1Service, D1ImageRecord } from '../services/d1Service.ts';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile;
  addresses: UserAddress[];
  favourites: string[];
  images: D1ImageRecord[];
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
  toggleOfferNotifications: () => Promise<void>;
  toggleFavourite: (itemId: string) => Promise<void>;
  saveAddress: (address: Omit<UserAddress, 'id'>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  saveImage: (imageUrl: string, title?: string, category?: string) => Promise<boolean>;
  refreshImages: () => Promise<void>;
  isDemoUser: boolean;
  loginAsScreenshotUser: () => void;
  d1Connected: boolean;
}

const DEFAULT_SCREENSHOT_PROFILE: UserProfile = {
  id: 'guest-customer-uid',
  name: 'Guest Customer',
  email: '',
  phoneNumber: '',
  loyaltyPoints: 0.0,
  offerNotifications: false,
};

const DEFAULT_ADDRESSES: UserAddress[] = [
  {
    id: 'addr-1',
    title: 'Home',
    address: 'Sector C, Wapda Town, Lahore',
    phone: '',
    isDefault: true,
  },
  {
    id: 'addr-2',
    title: 'Office',
    address: 'Main Boulevard, Gulberg III, Lahore',
    phone: '',
    isDefault: false,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_SCREENSHOT_PROFILE);
  const [addresses, setAddresses] = useState<UserAddress[]>(DEFAULT_ADDRESSES);
  const [favourites, setFavourites] = useState<string[]>(['crispy-situation-mint', 'little-sheikh']);
  const [images, setImages] = useState<D1ImageRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(true);
  const [d1Connected, setD1Connected] = useState<boolean>(true);

  // Sync with Cloudflare D1 SQL and Firebase auth state
  useEffect(() => {
    // Check D1 health
    d1Service.checkHealth().then((health) => {
      setD1Connected(health.status === 'connected');
    });

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        setIsDemoUser(false);
        const uid = fbUser.uid;

        // 1. Try to load user profile from Cloudflare D1 SQL
        let d1Profile = await d1Service.getAccount(uid);

        let finalProfile: UserProfile = {
          id: uid,
          name: d1Profile?.name || fbUser.displayName || 'The Grill Spot Customer',
          email: d1Profile?.email || fbUser.email || '',
          phoneNumber: d1Profile?.phoneNumber || fbUser.phoneNumber || '',
          loyaltyPoints: d1Profile?.loyaltyPoints ?? 150.0,
          offerNotifications: false,
          photoURL: fbUser.photoURL || undefined,
        };

        // 2. Also check / sync with Firestore for double redundancy
        const path = `users/${uid}`;
        try {
          const userDoc = await getDoc(doc(db, path));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            finalProfile = {
              ...finalProfile,
              name: data.name || finalProfile.name,
              phoneNumber: data.phoneNumber || finalProfile.phoneNumber,
              loyaltyPoints: data.loyaltyPoints ?? finalProfile.loyaltyPoints,
              offerNotifications: data.offerNotifications ?? false,
            };
          } else {
            await setDoc(doc(db, path), {
              ...finalProfile,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.warn('Firestore fallback sync:', error);
        }

        // Persist to Cloudflare D1 SQL
        await d1Service.saveAccount(finalProfile);
        setProfile(finalProfile);

        // 3. Load addresses & favourites & images from Cloudflare D1 SQL
        const [d1Addrs, d1Favs, d1Imgs] = await Promise.all([
          d1Service.getAddresses(uid),
          d1Service.getFavourites(uid),
          d1Service.getImages(uid),
        ]);

        if (d1Addrs.length > 0) setAddresses(d1Addrs);
        if (d1Favs.length > 0) setFavourites(d1Favs);
        setImages(d1Imgs);
      } else {
        setUser(null);
        setIsDemoUser(true);
        setProfile(DEFAULT_SCREENSHOT_PROFILE);

        // Sync screenshot user with D1
        d1Service.saveAccount(DEFAULT_SCREENSHOT_PROFILE).catch(() => {});
        d1Service.getImages('guest-customer-uid').then(setImages).catch(() => {});
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (user) {
        await fbSignOut(auth);
      }
      setUser(null);
      setIsDemoUser(true);
      setProfile(DEFAULT_SCREENSHOT_PROFILE);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const loginAsScreenshotUser = () => {
    setIsDemoUser(true);
    setProfile(DEFAULT_SCREENSHOT_PROFILE);
    d1Service.saveAccount(DEFAULT_SCREENSHOT_PROFILE).catch(() => {});
  };

  const updateProfileData = async (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);

    // Save to Cloudflare D1 SQL
    await d1Service.saveAccount(updated);

    // Save to Firestore if Firebase user
    if (user) {
      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, path), {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  };

  const toggleOfferNotifications = async () => {
    const nextVal = !profile.offerNotifications;
    await updateProfileData({ offerNotifications: nextVal });
  };

  const toggleFavourite = async (itemId: string) => {
    const currentUserId = user ? user.uid : profile.id;
    setFavourites((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );

    // Save to Cloudflare D1 SQL
    await d1Service.toggleFavourite(currentUserId, itemId);
  };

  const saveAddress = async (newAddr: Omit<UserAddress, 'id'>) => {
    const currentUserId = user ? user.uid : profile.id;
    const addr: UserAddress = {
      ...newAddr,
      id: 'addr-' + Date.now(),
    };
    setAddresses((prev) => [addr, ...prev]);

    // Save to Cloudflare D1 SQL
    await d1Service.saveAddress(addr, currentUserId);
  };

  const deleteAddress = async (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    // Delete from Cloudflare D1 SQL
    await d1Service.deleteAddress(id);
  };

  const saveImage = async (imageUrl: string, title: string = 'Saved Item Image', category: string = 'food') => {
    const currentUserId = user ? user.uid : profile.id;
    const ok = await d1Service.saveImage(currentUserId, imageUrl, title, category);
    if (ok) {
      const refreshed = await d1Service.getImages(currentUserId);
      setImages(refreshed);
    }
    return ok;
  };

  const refreshImages = async () => {
    const currentUserId = user ? user.uid : profile.id;
    const imgs = await d1Service.getImages(currentUserId);
    setImages(imgs);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        addresses,
        favourites,
        images,
        isLoading,
        signInWithGoogle,
        signOut,
        updateProfileData,
        toggleOfferNotifications,
        toggleFavourite,
        saveAddress,
        deleteAddress,
        saveImage,
        refreshImages,
        isDemoUser,
        loginAsScreenshotUser,
        d1Connected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
