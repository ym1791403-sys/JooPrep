-- ============================================================================
-- JooPrep Platform (v2) — Complete Supabase Database Schema
-- Database: PostgreSQL (Supabase)
-- ============================================================================

-- 1. Profiles Table (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text not null,
  college text default 'كلية الحاسبات والمعلومات',
  academic_year text default 'الفرقة الأولى',
  daily_quota_viva integer default 3,
  daily_quota_prep integer default 5,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Quiz Attempts Table (Logs MCQ scores for all 6 subjects)
create table if not exists public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  subject_id text not null,
  subject_name text not null,
  score integer not null,
  total_questions integer not null,
  percentage integer not null,
  mode text default 'practice',
  answers jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 3. Viva Oral Defense Sessions (Code analysis and dialog evaluations)
create table if not exists public.viva_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  persona text not null,
  language text default 'mixed',
  level integer default 2,
  code_snippet text,
  final_score numeric(4,2),
  dialogue jsonb default '[]'::jsonb,
  evaluation_summary text,
  created_at timestamptz default now()
);

-- 4. Error Notebook Table (Tracks recurring mistakes)
create table if not exists public.error_notebook (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  subject_id text not null,
  question_id text not null,
  question_text text not null,
  user_answer text not null,
  correct_answer text not null,
  error_pattern text,
  explanation text,
  resolved boolean default false,
  created_at timestamptz default now()
);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.viva_history enable row level security;
alter table public.error_notebook enable row level security;

-- Profiles: Users can view and update their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Quiz Attempts: Users can view and insert their own attempts
create policy "Users can view own quiz attempts" on public.quiz_attempts
  for select using (auth.uid() = user_id);

create policy "Users can insert own quiz attempts" on public.quiz_attempts
  for insert with check (auth.uid() = user_id);

-- Viva History: Users can view and insert their own viva sessions
create policy "Users can view own viva sessions" on public.viva_history
  for select using (auth.uid() = user_id);

create policy "Users can insert own viva sessions" on public.viva_history
  for insert with check (auth.uid() = user_id);

-- Error Notebook: Users can manage their own error items
create policy "Users can view own errors" on public.error_notebook
  for select using (auth.uid() = user_id);

create policy "Users can insert own errors" on public.error_notebook
  for insert with check (auth.uid() = user_id);

create policy "Users can update own errors" on public.error_notebook
  for update using (auth.uid() = user_id);

create policy "Users can delete own errors" on public.error_notebook
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- Automatic Profile Creator Trigger on auth.users Sign Up
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, college, academic_year)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'طالب هندسة وحاسبات'),
    coalesce(new.raw_user_meta_data->>'college', 'كلية الحاسبات والمعلومات'),
    coalesce(new.raw_user_meta_data->>'academic_year', 'الفرقة الأولى')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
