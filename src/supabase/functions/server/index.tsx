import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Helper function to get Supabase client
const getSupabaseClient = (serviceRole = false) => {
  const url = Deno.env.get('SUPABASE_URL')!;
  const key = serviceRole 
    ? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    : Deno.env.get('SUPABASE_ANON_KEY')!;
  return createClient(url, key);
};

// Helper function to verify user authentication
const verifyAuth = async (request: Request) => {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { error: 'No token provided', user: null };
  }
  
  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    return { error: 'Unauthorized', user: null };
  }
  
  return { error: null, user };
};

// ============= Auth Routes =============

app.post('/make-server-12079b1e/signup', async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    if (!email || !password || !name || !role) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const supabase = getSupabaseClient(true);
    
    // Create user with admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true,
    });
    
    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    
    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup error: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// ============= Profile Routes =============

app.get('/make-server-12079b1e/profile', async (c) => {
  try {
    const { error, user } = await verifyAuth(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }
    
    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    return c.json({ profile });
  } catch (error) {
    console.log(`Error fetching profile: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// ============= Symptoms Routes =============

app.post('/make-server-12079b1e/symptoms', async (c) => {
  try {
    const { error, user } = await verifyAuth(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }
    
    const symptomsData = await c.req.json();
    
    // Save symptoms data
    const symptomId = `symptom:${user.id}:${Date.now()}`;
    await kv.set(symptomId, {
      userId: user.id,
      ...symptomsData,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ success: true, id: symptomId });
  } catch (error) {
    console.log(`Error saving symptoms: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

app.get('/make-server-12079b1e/symptoms', async (c) => {
  try {
    const { error, user } = await verifyAuth(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }
    
    const symptoms = await kv.getByPrefix(`symptom:${user.id}:`);
    
    return c.json({ symptoms });
  } catch (error) {
    console.log(`Error fetching symptoms: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// ============= Lab Results Routes =============

app.post('/make-server-12079b1e/lab-results', async (c) => {
  try {
    const { error, user } = await verifyAuth(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }
    
    const labData = await c.req.json();
    
    // Calculate free testosterone using Vermeulen formula
    const freeT = calculateFreeTVermuelen(
      labData.totalT,
      labData.shbg,
      labData.albumin || 4.3
    );
    
    const labId = `lab:${user.id}:${Date.now()}`;
    await kv.set(labId, {
      userId: user.id,
      ...labData,
      freeT,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ success: true, id: labId, freeT });
  } catch (error) {
    console.log(`Error saving lab results: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

app.get('/make-server-12079b1e/lab-results', async (c) => {
  try {
    const { error, user } = await verifyAuth(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }
    
    const labResults = await kv.getByPrefix(`lab:${user.id}:`);
    
    return c.json({ labResults });
  } catch (error) {
    console.log(`Error fetching lab results: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// ============= Patient List (Doctor Only) =============

app.get('/make-server-12079b1e/patients', async (c) => {
  try {
    const { error, user } = await verifyAuth(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }
    
    // Verify doctor role
    const profile = await kv.get(`user:${user.id}`);
    if (!profile || profile.role !== 'doctor') {
      return c.json({ error: 'Access denied: Doctor role required' }, 403);
    }
    
    // Get all user profiles
    const allUsers = await kv.getByPrefix('user:');
    const patients = allUsers.filter((u: any) => u.role === 'patient');
    
    // Get latest lab results for each patient
    const patientsWithData = await Promise.all(
      patients.map(async (patient: any) => {
        const labResults = await kv.getByPrefix(`lab:${patient.id}:`);
        const symptoms = await kv.getByPrefix(`symptom:${patient.id}:`);
        
        const latestLab = labResults.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        
        const latestSymptom = symptoms.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        
        return {
          ...patient,
          latestLab,
          latestSymptom,
          labCount: labResults.length,
          symptomCount: symptoms.length,
        };
      })
    );
    
    return c.json({ patients: patientsWithData });
  } catch (error) {
    console.log(`Error fetching patients: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// ============= Recommendations Routes =============

app.post('/make-server-12079b1e/recommendations', async (c) => {
  try {
    const { error, user } = await verifyAuth(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }
    
    const { patientId, recommendations } = await c.req.json();
    
    const recId = `recommendation:${patientId}:${Date.now()}`;
    await kv.set(recId, {
      patientId,
      doctorId: user.id,
      recommendations,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ success: true, id: recId });
  } catch (error) {
    console.log(`Error saving recommendations: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

app.get('/make-server-12079b1e/recommendations', async (c) => {
  try {
    const { error, user } = await verifyAuth(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }
    
    const recommendations = await kv.getByPrefix(`recommendation:${user.id}:`);
    
    return c.json({ recommendations });
  } catch (error) {
    console.log(`Error fetching recommendations: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// ============= Helper Functions =============

// Vermeulen formula for calculating free testosterone
function calculateFreeTVermuelen(totalT: number, shbg: number, albumin: number): number {
  // Constants
  const Ka = 1e9; // Association constant for SHBG (L/mol)
  const Kb = 3.6e4; // Association constant for albumin (L/mol)
  
  // Convert to SI units if needed (assuming ng/dL for T, nmol/L for SHBG, g/dL for albumin)
  const T = totalT * 0.0347; // Convert ng/dL to nmol/L
  const S = shbg; // Already in nmol/L
  const A = albumin * 145; // Convert g/dL to µmol/L then to nmol/L
  
  // Solve quadratic equation
  const a = Ka;
  const b = Ka * S + Kb * A + 1 - Ka * T - Kb * T;
  const c = -T;
  
  const freeT_nmol = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  const freeT_ngdl = freeT_nmol * 28.8; // Convert back to ng/dL
  
  return Math.round(freeT_ngdl * 100) / 100;
}

app.get('/make-server-12079b1e/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
