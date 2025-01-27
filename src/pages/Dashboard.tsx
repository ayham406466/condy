import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Calculator, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
          <h1 className="text-3xl font-bold text-gray-800">اختر نوع التدريب</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Qudurat Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <Brain className="w-8 h-8 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">القدرات</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">كمي</h3>
                <button
                  onClick={() => navigate('/qudurat/quantitative/roots')}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-lg text-right"
                >
                  الجذور
                </button>
                <button
                  onClick={() => navigate('/qudurat/quantitative/fractions')}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-lg text-right"
                >
                  الكسور
                </button>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">لفظي</h3>
                <button
                  onClick={() => navigate('/qudurat/verbal/comprehension')}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-lg text-right"
                >
                  فهم المقروء
                </button>
                <button
                  onClick={() => navigate('/qudurat/verbal/completion')}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-lg text-right"
                >
                  إكمال الجمل
                </button>
              </div>
            </div>
          </div>

          {/* Tahsili Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">التحصيلي</h2>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/tahsili/physics')}
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-lg text-right"
              >
                فيزياء
              </button>
              <button
                onClick={() => navigate('/tahsili/chemistry')}
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-lg text-right"
              >
                كيمياء
              </button>
              <button
                onClick={() => navigate('/tahsili/biology')}
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-lg text-right"
              >
                أحياء
              </button>
              <button
                onClick={() => navigate('/tahsili/comprehensive')}
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-lg text-right"
              >
                شامل
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}