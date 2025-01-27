import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, User, Lock, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registrationCode !== '7190') {
      toast.error('كود التسجيل غير صحيح');
      return;
    }

    try {
      await register(username, password);
      toast.success('تم إنشاء الحساب بنجاح');
      navigate('/');
    } catch (error) {
      toast.error('حدث خطأ في التسجيل');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <GraduationCap className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">إنشاء حساب جديد</h1>
          <h2 className="text-xl text-gray-600">مدرسة سلمان الفارسي</h2>
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

          <div>
            <label className="block text-right text-gray-700 mb-2">كود التسجيل</label>
            <div className="relative">
              <input
                type="text"
                value={registrationCode}
                onChange={(e) => setRegistrationCode(e.target.value)}
                className="w-full p-3 border rounded-lg pl-10 text-right"
                required
              />
              <Key className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            إنشاء حساب
          </button>

          <div className="text-center">
            <Link to="/" className="text-indigo-600 hover:underline">
              العودة لتسجيل الدخول
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}