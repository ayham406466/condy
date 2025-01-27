import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(username, password);
      
      if (isAdmin) {
        if (username === 'Ayham Mohammed' && password === '548620') {
          navigate('/admin');
          return;
        }
        toast.error('بيانات المسؤول غير صحيحة');
        return;
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('خطأ في تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <GraduationCap className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">تدريب القدرات والتحصيلي</h1>
          <h2 className="text-xl text-gray-600 mb-1">مدرسة سلمان الفارسي</h2>
          <p className="text-lg text-gray-500 mb-4">مكة النسيم</p>
          <div className="text-sm text-gray-500">
            <p>المصمم: ايهم محمد</p>
            <p>اعداد الأسئلة: محمود زمزمي</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-right text-gray-700 mb-2">اسم المستخدم</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border rounded-lg pl-10 text-right"
                required
              />
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="block text-right text-gray-700 mb-2">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg pl-10 text-right"
                required
              />
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <label className="text-sm text-gray-600">تسجيل الدخول كمسؤول</label>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="rounded text-indigo-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            تسجيل الدخول
          </button>

          <div className="text-center">
            <Link to="/register" className="text-indigo-600 hover:underline">
              إنشاء حساب جديد
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}