"""
Browser Console Job Importer
Generates JavaScript code to run in browser console
"""

import csv
import random
import json

def create_browser_import(csv_file, num_jobs=20):
    """Create JavaScript code for browser console import"""
    
    print(f"📂 Reading jobs from {csv_file}...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        all_jobs = list(csv_reader)
        
        legit_jobs = [job for job in all_jobs if job.get('fraudulent', '1') == '0']
        selected_jobs = random.sample(legit_jobs, min(num_jobs, len(legit_jobs)))
        
        print(f"📊 Generating browser import script for {len(selected_jobs)} jobs...")
        
        jobs_data = []
        
        for job in selected_jobs:
            # Parse salary
            salary_min, salary_max = None, None
            salary_range = job.get('salary_range', '')
            if salary_range:
                try:
                    parts = salary_range.replace('$', '').replace(',', '').split('-')
                    if len(parts) == 2:
                        salary_min = int(float(parts[0].strip()) * 1000) if 'k' in salary_range.lower() else int(parts[0].strip())
                        salary_max = int(float(parts[1].strip()) * 1000) if 'k' in salary_range.lower() else int(parts[1].strip())
                except:
                    pass
            
            # Map job type
            job_type_map = {
                'Full-time': 'full-time',
                'Part-time': 'part-time',
                'Contract': 'contract',
                'Internship': 'internship',
                'Other': 'full-time'
            }
            job_type = job_type_map.get(job.get('employment_type', 'Full-time'), 'full-time')
            
            # Map experience
            exp_map = {
                'Internship': 'entry', 'Entry level': 'entry', 'Associate': 'entry',
                'Mid-Senior level': 'mid', 'Executive': 'senior', 'Director': 'lead'
            }
            exp_level = exp_map.get(job.get('required_experience', 'Mid-Senior level'), 'mid')
            
            # Extract skills
            requirements_text = job.get('requirements', '')
            skills = []
            for skill in ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'AWS', 'Docker']:
                if skill.lower() in requirements_text.lower():
                    skills.append(skill)
            
            job_data = {
                'title': (job.get('title', 'Position') or 'Position')[:200],
                'description': (job.get('description', 'Job description') or 'Job description')[:5000],
                'requirements': (job.get('requirements', '') or None),
                'location': (job.get('location', 'Remote') or 'Remote')[:100],
                'company_name': (job.get('company_profile', '').split('.')[0] or 'Company')[:100],
                'salary_min': salary_min,
                'salary_max': salary_max,
                'job_type': job_type,
                'experience_level': exp_level,
                'skills_required': skills if skills else None,
                'benefits': job.get('benefits', None),
                'remote_ok': job.get('telecommuting', '0') == '1',
                'status': 'open',
                'industry': (job.get('industry', '') or None)
            }
            
            jobs_data.append(job_data)
        
        # Generate JavaScript code
        js_code = f"""
// 🚀 Job Import Script - Paste this in Browser Console
// Make sure you're logged in as a recruiter first!

(async function importJobs() {{
    console.log('🚀 Starting job import...');
    
    // Get current user session
    const {{ data: {{ session }} }} = await supabase.auth.getSession();
    
    if (!session) {{
        console.error('❌ Not logged in! Please login first.');
        return;
    }}
    
    const userId = session.user.id;
    console.log('✅ Logged in as:', session.user.email);
    
    // Jobs to import
    const jobs = {json.dumps(jobs_data, indent=2)};
    
    console.log(`📦 Importing ${{jobs.length}} jobs...`);
    
    // Add recruiter_id to each job
    const jobsWithRecruiter = jobs.map(job => ({{
        ...job,
        recruiter_id: userId
    }}));
    
    // Insert jobs
    const {{ data, error }} = await supabase
        .from('jobs')
        .insert(jobsWithRecruiter);
    
    if (error) {{
        console.error('❌ Error importing jobs:', error);
    }} else {{
        console.log('✅ Successfully imported', jobs.length, 'jobs!');
        console.log('🎉 Refresh the page to see new job listings!');
    }}
}})();
"""
        
        return js_code

if __name__ == "__main__":
    print("🚀 Creating browser-based job import script...\n")
    
    js_code = create_browser_import('../fake_job_postings.csv', num_jobs=20)
    
    # Write to file
    output_file = 'browser_import.js'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_code)
    
    print(f"\n✅ JavaScript file generated: {output_file}")
    print("\n📋 How to use:")
    print("1. Open http://localhost:5174 in your browser")
    print("2. Login as a RECRUITER")
    print("3. Open Browser Console (F12 → Console tab)")
    print("4. Copy all contents from browser_import.js")
    print("5. Paste into console and press Enter")
    print("6. Wait for 'Successfully imported' message")
    print("7. Refresh page to see jobs!")
    print("\n🎉 Much easier than SQL!")
