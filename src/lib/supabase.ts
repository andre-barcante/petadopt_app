import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'http://13.221.93.157:8000';
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzgxMjg3NTY3LCJleHAiOjIwOTY2NDc1Njd9.' +
  'yykhQEuo_9idyB5OpE1BI0inM6c7RrtiO-F2tpODIAg';

const fetchWithTimeout = (url: RequestInfo, options?: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
};

export const supabase = createClient(SUPABASE_URL, ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: { fetch: fetchWithTimeout },
});
