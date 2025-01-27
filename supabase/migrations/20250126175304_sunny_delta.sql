/*
  # Initial Schema Setup

  1. Tables
    - users (handled by Supabase Auth)
    - questions
      - id (uuid, primary key)
      - type (text) - 'qudurat' or 'tahsili'
      - category (text) - 'quantitative', 'verbal', 'physics', etc.
      - subcategory (text) - 'roots', 'fractions', etc.
      - question_text (text)
      - image_url (text, nullable)
      - options (jsonb)
      - correct_answer (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for read access
*/

CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  category text NOT NULL,
  subcategory text,
  question_text text NOT NULL,
  image_url text,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access for authenticated users"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow admin to manage questions (handled through admin interface)
CREATE POLICY "Allow admin to manage questions"
  ON questions
  FOR ALL
  TO authenticated
  USING (auth.email() = 'Ayham.Mohammed@example.com');