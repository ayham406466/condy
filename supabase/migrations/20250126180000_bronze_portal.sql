/*
  # Add sample questions for Qudurat and Tahsili tests

  1. New Data
    - Sample questions for Qudurat (quantitative and verbal)
    - Sample questions for Tahsili (physics, chemistry, biology)
  
  2. Security
    - Uses existing RLS policies
*/

-- Qudurat Quantitative Questions (Roots)
INSERT INTO questions (type, category, subcategory, question_text, options, correct_answer) VALUES
('qudurat', 'quantitative', 'roots', 'ما هو الجذر التربيعي للعدد 144؟', 
  '["10", "12", "14", "16"]', 
  '12');

INSERT INTO questions (type, category, subcategory, question_text, options, correct_answer) VALUES
('qudurat', 'quantitative', 'roots', 'إذا كان س² = 25، فما قيمة س؟', 
  '["+5", "-5", "±5", "25"]', 
  '±5');

-- Qudurat Quantitative Questions (Fractions)
INSERT INTO questions (type, category, subcategory, question_text, options, correct_answer) VALUES
('qudurat', 'quantitative', 'fractions', 'ما ناتج 3/4 + 1/2؟', 
  '["5/4", "4/6", "7/4", "1.25"]', 
  '5/4');

-- Tahsili Physics Questions
INSERT INTO questions (type, category, question_text, options, correct_answer) VALUES
('tahsili', 'physics', 'ما وحدة قياس القوة في النظام الدولي؟', 
  '["نيوتن", "جول", "باسكال", "واط"]', 
  'نيوتن');

-- Tahsili Chemistry Questions
INSERT INTO questions (type, category, question_text, options, correct_answer) VALUES
('tahsili', 'chemistry', 'ما هو العدد الذري للهيدروجين؟', 
  '["1", "2", "3", "4"]', 
  '1');

-- Tahsili Biology Questions
INSERT INTO questions (type, category, question_text, options, correct_answer) VALUES
('tahsili', 'biology', 'ما هي أصغر وحدة بناء في جسم الكائن الحي؟', 
  '["الخلية", "النواة", "الجين", "البروتين"]', 
  'الخلية');