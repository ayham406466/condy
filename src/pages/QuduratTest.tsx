import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Question {
  id: string;
  question_text: string;
  image_url?: string;
  options: string[];
  correct_answer: string;
}

export default function QuduratTest() {
  const { type, subject } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [type, subject]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('type', 'qudurat')
        .eq('category', type)
        .eq('subcategory', subject);

      if (error) throw error;
      if (data) setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setScore(0);
    setShowResults(false);
  };

  if (questions.length === 0) {
    return <div className="text-center p-8">جاري تحميل الأسئلة...</div>;
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">نتيجة الاختبار</h2>
          <p className="text-xl text-center mb-8">
            لقد حصلت على {score} من {questions.length} نقطة
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={restartTest}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              <RotateCcw className="w-5 h-5" />
              إعادة الاختبار
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
            >
              <ArrowRight className="w-5 h-5" />
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <span className="text-gray-600">
              السؤال {currentQuestion + 1} من {questions.length}
            </span>
            <span className="text-gray-600">النقاط: {score}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 text-right mb-4">
              {currentQ.question_text}
            </h2>
            {currentQ.image_url && (
              <img
                src={currentQ.image_url}
                alt="توضيح السؤال"
                className="max-w-full h-auto rounded-lg mb-4"
              />
            )}
          </div>

          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full text-right bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-lg transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}