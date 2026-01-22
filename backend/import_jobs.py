import csv
import random
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# First, we need a recruiter user ID. Let's use the service role to create one or fetch existing
def get_or_create_recruiter():
    """Get an existing recruiter or create a default one"""
    # Try to fetch an existing recruiter
    response = supabase.table('profiles').select('*').eq('role', 'recruiter').limit(1).execute()
    
    if response.data and len(response.data) > 0:
        print(f"✅ Using existing recruiter: {response.data[0]['email']}")
        return response.data[0]['id']
    else:
        print("⚠️  No recruiter found. Please create a recruiter account through the UI first.")
        return None

def clean_text(text):
    """Clean and truncate text for database"""
    if not text or text == '':
        return None
    # Remove excessive whitespace
    text = ' '.join(text.split())
    # Limit length
    return text[:5000] if len(text) > 5000 else text

def parse_salary(salary_range):
    """Parse salary range into min and max"""
    if not salary_range or salary_range == '':
        return None, None
    
    try:
        # Try to extract numbers from salary range
        parts = salary_range.replace('$', '').replace(',', '').split('-')
        if len(parts) == 2:
            min_sal = int(float(parts[0].strip()) * 1000) if 'k' in salary_range.lower() else int(parts[0].strip())
            max_sal = int(float(parts[1].strip()) * 1000) if 'k' in salary_range.lower() else int(parts[1].strip())
            return min_sal, max_sal
    except:
        pass
    
    return None, None

def import_jobs_from_csv(csv_file, num_jobs=20, recruiter_id=None):
    """Import sample jobs from CSV file"""
    
    if not recruiter_id:
        print("❌ No recruiter ID provided")
        return
    
    jobs_imported = 0
    jobs_to_insert = []
    
    print(f"📂 Reading jobs from {csv_file}...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        all_jobs = list(csv_reader)
        
        # Filter out fraudulent jobs and select random sample
        legit_jobs = [job for job in all_jobs if job.get('fraudulent', '1') == '0']
        selected_jobs = random.sample(legit_jobs, min(num_jobs, len(legit_jobs)))
        
        print(f"📊 Found {len(legit_jobs)} legitimate jobs, importing {len(selected_jobs)}...")
        
        for job in selected_jobs:
            salary_min, salary_max = parse_salary(job.get('salary_range', ''))
            
            # Map employment type
            job_type_map = {
                'Full-time': 'full-time',
                'Part-time': 'part-time',
                'Contract': 'contract',
                'Internship': 'internship',
                'Other': 'full-time'
            }
            
            employment_type = job.get('employment_type', 'Full-time')
            job_type = job_type_map.get(employment_type, 'full-time')
            
            # Map experience level
            exp_level_map = {
                'Internship': 'entry',
                'Entry level': 'entry',
                'Associate': 'entry',
                'Mid-Senior level': 'mid',
                'Executive': 'senior',
                'Director': 'lead',
                'Not Applicable': 'mid'
            }
            
            required_exp = job.get('required_experience', 'Mid-Senior level')
            experience_level = exp_level_map.get(required_exp, 'mid')
            
            # Extract skills from requirements
            requirements_text = job.get('requirements', '')
            skills_required = []
            
            # Simple skill extraction
            skill_keywords = ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 
                            'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue', 'MongoDB', 'PostgreSQL']
            
            for skill in skill_keywords:
                if skill.lower() in requirements_text.lower():
                    skills_required.append(skill)
            
            job_data = {
                'recruiter_id': recruiter_id,
                'title': clean_text(job.get('title', 'Untitled Position')),
                'description': clean_text(job.get('description', 'No description available')),
                'requirements': clean_text(job.get('requirements', '')),
                'location': job.get('location', 'Remote')[:100],
                'company_name': clean_text(job.get('company_profile', '').split('.')[0])[:100] or 'Company',
                'salary_min': salary_min,
                'salary_max': salary_max,
                'job_type': job_type,
                'experience_level': experience_level,
                'skills_required': skills_required if skills_required else None,
                'benefits': clean_text(job.get('benefits', '')),
                'remote_ok': job.get('telecommuting', '0') == '1',
                'status': 'open',
                'industry': job.get('industry', '')[:50] if job.get('industry') else None
            }
            
            jobs_to_insert.append(job_data)
    
    # Batch insert jobs
    if jobs_to_insert:
        print(f"💾 Inserting {len(jobs_to_insert)} jobs into database...")
        try:
            response = supabase.table('jobs').insert(jobs_to_insert).execute()
            jobs_imported = len(response.data) if response.data else 0
            print(f"✅ Successfully imported {jobs_imported} jobs!")
        except Exception as e:
            print(f"❌ Error inserting jobs: {e}")
    
    return jobs_imported

if __name__ == "__main__":
    print("🚀 Starting job import from CSV...\n")
    
    # Get or create recruiter
    recruiter_id = get_or_create_recruiter()
    
    if recruiter_id:
        # Import 20 sample jobs
        imported = import_jobs_from_csv('fake_job_postings.csv', num_jobs=20, recruiter_id=recruiter_id)
        print(f"\n🎉 Import complete! {imported} jobs added to the database.")
        print("📱 Refresh your app to see the new job listings!")
    else:
        print("\n⚠️  Please create a recruiter account first:")
        print("1. Go to http://localhost:5174/auth?mode=register")
        print("2. Sign up as a Recruiter")
        print("3. Run this script again")
