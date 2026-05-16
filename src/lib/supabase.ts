import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client only if credentials are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Audit logging function
export const logAuditEvent = async (
  action: string,
  module: string,
  details?: Record<string, any>
) => {
  try {
    // Skip logging if supabase client is not initialized
    if (!supabase) {
      console.warn('Supabase client not initialized. Skipping audit log.');
      return;
    }
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No authenticated user for audit log');
      return;
    }

    // Insert audit log entry
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action,
        module,
        details: details || {},
        timestamp: new Date().toISOString(),
        ip_address: '127.0.0.1', // In a real app, you'd get the actual IP
        user_agent: navigator.userAgent
      });

    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (error) {
    console.error('Error in audit logging:', error);
    // Don't throw error to prevent app crashes
  }
};