import { supabase } from "@/integrations/supabase/client";

// Simple utility functions for soft delete operations
export const softDeleteRecord = async (table: string, id: string, userId?: string) => {
  try {
    const updateData: any = { deleted_at: new Date().toISOString() };
    let query = supabase.from(table as any).update(updateData).eq('id', id);
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { error } = await query;
    return { error };
  } catch (error) {
    return { error };
  }
};

export const restoreRecord = async (table: string, id: string, userId?: string) => {
  try {
    const updateData: any = { deleted_at: null };
    let query = supabase.from(table as any).update(updateData).eq('id', id);
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { error } = await query;
    return { error };
  } catch (error) {
    return { error };
  }
};

export const permanentDeleteRecord = async (table: string, id: string, userId?: string) => {
  try {
    let query = supabase.from(table as any).delete().eq('id', id);
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { error } = await query;
    return { error };
  } catch (error) {
    return { error };
  }
};

// Helper to modify queries to exclude deleted records
export const excludeDeleted = (query: any) => {
  return query.is('deleted_at', null);
};

// Helper to get only active (non-deleted) records
export const getActiveRecords = (table: string) => {
  return supabase.from(table as any).select('*').is('deleted_at', null);
};

// Table mappings for type safety
export const SOFT_DELETE_TABLES = {
  campaigns: 'campaigns',
  contacts: 'contacts',
  deals: 'deals',
  tasks: 'tasks',
  email_campaigns: 'email_campaigns',
  email_templates: 'email_templates',
  competitor_profiles: 'competitor_profiles',
  personas: 'personas'
} as const;

export type SoftDeleteTable = keyof typeof SOFT_DELETE_TABLES;