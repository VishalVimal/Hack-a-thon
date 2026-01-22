export const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
}

export const API_ENDPOINTS = {
    parseResume: `${config.apiUrl}/parse-resume`,
    scoreJob: `${config.apiUrl}/score-job`,
    recommend: `${config.apiUrl}/recommend`,
    health: `${config.apiUrl}/health`
}
