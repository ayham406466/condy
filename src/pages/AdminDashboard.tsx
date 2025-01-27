import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, Calculator } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createClient } from '@supabase/supabase-js';
import Latex from 'react-latex';
import toast from 'react-hot-toast';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('add');
  const [newQuestion, setNewQuestion] = useState({
    type: 'qudurat',
    category: 'quantitative',
    subcategory: 'roots',
    questionText: '',
    imageUrl: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    latexEnabled: false
  });

  const [sections, setSections] = useState({
    qudurat: {
      quantitative: ['roots', 'fractions'],
      verbal: ['comprehension', 'completion']
    },
    tahsili: ['physics', 'chemistry', 'biology']
  });

  const [newSection, setNewSection] = useState({
    type: 'qudurat',
    category: '',
    name: ''
  });

  const [calculatorInput, setCalculatorInput] = useState('');
  const [latexOutput, setLatexOutput] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('questions')
        .insert([{
          type: newQuestion.type,
          category: newQuestion.category,
          subcategory: newQuestion.subcategory,
          question_text: newQuestion.latexEnabled ? `$${newQuestion.questionText}$` : newQuestion.questionText,
          image_url: newQuestion.imageUrl,
          options: newQuestion.options.map(opt => newQuestion.latexEnabled ? `$${opt}$` : opt),
          correct_answer: newQuestion.latexEnabled ? `$${newQuestion.correctAnswer}$` : newQuestion.correctAnswer
        }]);

      if (error) throw error;
      
      setNewQuestion({
        type: 'qudurat',
        category: 'quantitative',
        subcategory: 'roots',
        questionText: '',
        imageUrl: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        latexEnabled: false
      });
      
      toast.success('تم إضافة السؤال بنجاح');
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('حدث خطأ في إضافة السؤال');
    }
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSections(prev => {
      if (newSection.type === 'qudurat') {
        return {
          ...prev,
          qudurat: {
            ...prev.qudurat,
            [newSection.category]: [
              ...(prev.qudurat[newSection.category as keyof typeof prev.qudurat] || []),
              newSection.name
            ]
          }
        };
      } else {
        return {
          ...prev,
          tahsili: [...prev.tahsili, newSection.name]
        };
      }
    });
    setNewSection({ type: 'qudurat', category: '', name: '' });
    toast.success('تم إضافة القسم بنجاح');
  };

  const handleDeleteSection = (type: string, category: string | null, sectionName: string) => {
    setSections(prev => {
      if (type === 'qudurat' && category) {
        return {
          ...prev,
          qudurat: {
            ...prev.qudurat,
            [category]: prev.qudurat[category as keyof typeof prev.qudurat].filter(
              section => section !== sectionName
            )
          }
        };
      } else if (type === 'tahsili') {
        return {
          ...prev,
          tahsili: prev.tahsili.filter(section => section !== sectionName)
        };
      }
      return prev;
    });
    toast.success('تم حذف القسم بنجاح');
  };

  const handleCalculatorInput = (value: string) => {
    if (value === 'clear') {
      setCalculatorInput('');
      setLatexOutput('');
      return;
    }

    if (value === 'backspace') {
      setCalculatorInput(prev => prev.slice(0, -1));
      return;
    }

    let newInput = calculatorInput + value;
    setCalculatorInput(newInput);

    // Convert to LaTeX
    let latexString = newInput;
    
    // Advanced mathematical notations
    latexString = latexString
      .replace(/sqrt\((.*?)\)/g, '\\sqrt{$1}') // Square root
      .replace(/cbrt\((.*?)\)/g, '\\sqrt[3]{$1}') // Cube root
      .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}') // Fractions
      .replace(/\^2/g, '^{2}') // Square
      .replace(/\^3/g, '^{3}') // Cube
      .replace(/pi/g, '\\pi') // Pi symbol
      .replace(/theta/g, '\\theta') // Theta symbol
      .replace(/infinity/g, '\\infty'); // Infinity symbol

    setLatexOutput(latexString);
  };

  const calculatorButtons = [
    ['sqrt()', 'cbrt()', '^2', '^3'],
    ['7', '8', '9', '+'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '×'],
    ['0', '.', '/', 'pi'],
    ['(', ')', 'theta', 'infinity'],
    ['clear', 'backspace']
  ];

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
          <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'add' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
            >
              إضافة سؤال
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'sections' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
            >
              إدارة الأقسام
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'calculator' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
            >
              الحاسبة العلمية
            </button>
          </div>

          {activeTab === 'add' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-right text-gray-700 mb-2">نوع الاختبار</label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})}
                    className="w-full p-3 border rounded-lg text-right"
                  >
                    <option value="qudurat">قدرات</option>
                    <option value="tahsili">تحصيلي</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-right text-gray-700 mb-2">القسم</label>
                  <select
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                    className="w-full p-3 border rounded-lg text-right"
                  >
                    {newQuestion.type === 'qudurat' ? (
                      <>
                        <option value="quantitative">كمي</option>
                        <option value="verbal">لفظي</option>
                      </>
                    ) : (
                      <>
                        <option value="physics">فيزياء</option>
                        <option value="chemistry">كيمياء</option>
                        <option value="biology">أحياء</option>
                      </>
                    )}
                  </select>
                </div>

                {newQuestion.type === 'qudurat' && newQuestion.category === 'quantitative' && (
                  <div>
                    <label className="block text-right text-gray-700 mb-2">القسم الفرعي</label>
                    <select
                      value={newQuestion.subcategory}
                      onChange={(e) => setNewQuestion({...newQuestion, subcategory: e.target.value})}
                      className="w-full p-3 border rounded-lg text-right"
                    >
                      {sections.qudurat.quantitative.map(section => (
                        <option key={section} value={section}>{section}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 mb-4">
                <label className="text-sm text-gray-600">تمكين الصيغ الرياضية</label>
                <input
                  type="checkbox"
                  checked={newQuestion.latexEnabled}
                  onChange={(e) => setNewQuestion({...newQuestion, latexEnabled: e.target.checked})}
                  className="rounded text-indigo-600"
                />
              </div>

              <div>
                <label className="block text-right text-gray-700 mb-2">نص السؤال</label>
                <textarea
                  value={newQuestion.questionText}
                  onChange={(e) => setNewQuestion({...newQuestion, questionText: e.target.value})}
                  className="w-full p-3 border rounded-lg text-right"
                  rows={4}
                />
                {newQuestion.latexEnabled && newQuestion.questionText && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <Latex>{`$${newQuestion.questionText}$`}</Latex>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-right text-gray-700 mb-2">رابط الصورة (اختياري)</label>
                <input
                  type="url"
                  value={newQuestion.imageUrl}
                  onChange={(e) => setNewQuestion({...newQuestion, imageUrl: e.target.value})}
                  className="w-full p-3 border rounded-lg text-right"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-right text-gray-700">الخيارات</label>
                {newQuestion.options.map((option, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion({...newQuestion, options: newOptions});
                      }}
                      className="w-full p-3 border rounded-lg text-right"
                      placeholder={`الخيار ${index + 1}`}
                    />
                    {newQuestion.latexEnabled && option && (
                      <div className="mt-1 p-2 bg-gray-50 rounded-lg">
                        <Latex>{`$${option}$`}</Latex>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-right text-gray-700 mb-2">الإجابة الصحيحة</label>
                <input
                  type="text"
                  value={newQuestion.correctAnswer}
                  onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                  className="w-full p-3 border rounded-lg text-right"
                />
                {newQuestion.latexEnabled && newQuestion.correctAnswer && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <Latex>{`$${newQuestion.correctAnswer}$`}</Latex>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                إضافة السؤال
              </button>
            </form>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-6">
              <form onSubmit={handleAddSection} className="space-y-4">
                <div>
                  <label className="block text-right text-gray-700 mb-2">نوع الاختبار</label>
                  <select
                    value={newSection.type}
                    onChange={(e) => setNewSection({...newSection, type: e.target.value})}
                    className="w-full p-3 border rounded-lg text-right"
                  >
                    <option value="qudurat">قدرات</option>
                    <option value="tahsili">تحصيلي</option>
                  </select>
                </div>

                {newSection.type === 'qudurat' && (
                  <div>
                    <label className="block text-right text-gray-700 mb-2">القسم</label>
                    <select
                      value={newSection.category}
                      onChange={(e) => setNewSection({...newSection, category: e.target.value})}
                      className="w-full p-3 border rounded-lg text-right"
                    >
                      <option value="quantitative">كمي</option>
                      <option value="verbal">لفظي</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-right text-gray-700 mb-2">اسم القسم الجديد</label>
                  <input
                    type="text"
                    value={newSection.name}
                    onChange={(e) => setNewSection({...newSection, name: e.target.value})}
                    className="w-full p-3 border rounded-lg text-right"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  إضافة قسم جديد
                </button>
              </form>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">الأقسام الحالية</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">قدرات - كمي</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {sections.qudurat.quantitative.map(section => (
                        <div key={section} className="bg-gray-50 p-2 rounded flex justify-between items-center">
                          <button
                            onClick={() => handleDeleteSection('qudurat', 'quantitative', section)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {section}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">قدرات - لفظي</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {sections.qudurat.verbal.map(section => (
                        <div key={section} className="bg-gray-50 p-2 rounded flex justify-between items-center">
                          <button
                            onClick={() => handleDeleteSection('qudurat', 'verbal', section)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {section}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">تحصيلي</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {sections.tahsili.map(section => (
                        <div key={section} className="bg-gray-50 p-2 rounded flex justify-between items-center">
                          <button
                            onClick={() => handleDeleteSection('tahsili', null, section)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {section}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-right mb-4 min-h-[50px] bg-white p-3 rounded">
                  <Latex>{latexOutput || 'النتيجة ستظهر هنا'}</Latex>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {calculatorButtons.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      {row.map((btn) => (
                        <button
                          key={btn}
                          onClick={() => handleCalculatorInput(btn)}
                          className={`p-3 ${
                            btn === 'clear' || btn === 'backspace'
                              ? 'bg-red-100 hover:bg-red-200 col-span-2'
                              : 'bg-white hover:bg-gray-50'
                          } rounded-lg shadow transition-colors`}
                        >
                          {btn === 'backspace' ? '⌫' : btn === 'clear' ? 'مسح' : btn}
                        </button>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-600 text-right">
                يمكنك نسخ الصيغة الرياضية واستخدامها في السؤال أو الخيارات
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}