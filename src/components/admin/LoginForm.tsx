'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || '로그인에 실패했습니다');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('네트워크 오류가 발생했습니다');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-1">
          아이디
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="admin"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="••••••••"
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}
