'use client'
import { useState } from 'react';
import { request } from '../services/api';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddChildModal({ isOpen, onClose, onSuccess }: AddChildModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!code) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await request('/Students/bind', 'POST', { accessCode: code });
    if (res.ok) {
      onSuccess();
      onClose();
      setCode('');
    } else {
      const data = await res.json();
      setError(data.message || 'Ошибка');
    }
    } catch (err) {
      setError('Ошибка сервера. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white p-8 rounded-4xl shadow-2xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-brand">Добавить ребенка</h2>
        <p className="text-gray-500 text-lg">Введите код доступа, чтобы привязать профиль спортсмена.</p>
        
        <div>
          <input 
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="КОД-123"
            className="w-full p-5 border-2 border-gray-100 rounded-2xl text-center text-3xl font-mono uppercase focus:border-brand outline-none transition-all bg-gray-50"
          />
          {error && <p className="text-red-500 mt-2 text-center font-medium">{error}</p>}
        </div>

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 text-gray-500 font-semibold hover:bg-gray-100 rounded-2xl transition-all">
            Отмена
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-4 bg-brand text-white rounded-2xl font-bold hover:bg-[#04346e] disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            {loading ? 'Проверка...' : 'Добавить'}
          </button>
        </div>
      </div>
    </div>
  );
}