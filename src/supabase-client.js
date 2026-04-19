import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://ssazubuyypxxckdffngl.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzYXp1YnV5eXB4eGNrZGZmbmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDg3NjMsImV4cCI6MjA5MjAyNDc2M30.jKxG9k4KDSNM4AqgzxRc1xm587lJ0KXNn-AJw-QSxCM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)