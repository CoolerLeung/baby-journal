import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Baby } from 'lucide-react';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const err = isRegister
      ? await register({ email: email || undefined, password, nickname: nickname || undefined })
      : await login(email, password);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf9f5] dark:bg-stone-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-4"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto mb-4">
            <Baby className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-headline font-bold text-[#41684a]">时光手账</h1>
          <p className="text-sm text-stone-500 mt-1">Baby Journal</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 rounded-2xl p-8 shadow-lg flex flex-col gap-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="px-4 py-3 bg-surface-container-low rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 bg-surface-container-low rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-3 bg-surface-container-low rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-on-primary py-3 rounded-full font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? '...' : isRegister ? 'Register' : 'Login'}
          </button>

          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-sm text-primary hover:text-primary-dim transition-colors"
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
