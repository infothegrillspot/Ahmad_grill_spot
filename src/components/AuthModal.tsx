import React, { useState } from 'react';
import { X, LogIn, AlertCircle, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, loginAsScreenshotUser, user, profile, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setError('Google Sign-In failed or popup was closed. You can also use the demo account below.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsScreenshotUser();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pt-2">
          <div className="w-14 h-14 rounded-2xl bg-[#E32626]/10 text-[#E32626] flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-zinc-900">Firebase Authentication</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Sign in to track orders, save multiple addresses, and collect loyalty rewards!
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {user ? (
          <div className="mt-6 space-y-4">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center space-x-3">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#E32626] text-white flex items-center justify-center font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
              <div className="overflow-hidden text-left">
                <div className="font-bold text-xs text-zinc-900 truncate">{profile.name}</div>
                <div className="text-[11px] text-zinc-500 truncate">{profile.email}</div>
              </div>
            </div>

            <button
              onClick={async () => {
                await signOut();
                onClose();
              }}
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold py-3 rounded-xl transition-all"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {/* Real Firebase Google Sign-In */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-800 text-xs font-bold py-3 px-4 rounded-xl shadow-xs flex items-center justify-center space-x-3 transition-all active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Opening Google Sign-In...' : 'Continue with Google'}</span>
            </button>

            {/* Google Requirement Notice */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-center">
              <p className="text-[11px] text-amber-900 font-medium">
                🔒 A Google account and valid contact phone number are required to place orders and track delivery.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
