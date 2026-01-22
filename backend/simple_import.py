"""
Simple Job Importer - Uses CSV to create sample jobs

Run this from backend folder: python simple_import.py
"""

import csv
import random
import json

def parse_salary(salary_range):
    """Parse salary range into min and max"""
    if not salary_range or salary_range == '':
        return None, None
    
    try:
        parts = salary_range.replace('$', '').replace(',', '').split('-')
        if len(parts) == 2:
            min_sal = int(float(parts[0].strip()) * 1000) if 'k' in salary_range.lower() else int(parts[0].strip())
            max_sal = int(float(parts[1].strip()) * 1000) if 'k' in salary_range.lower() else int(parts[1].strip())
            return min_sal, max_sal
    except:
        pass
    
    return None, None

def clean_text(text, max_len=5000):
    """Clean text for SQL"""
    if not text or text == '':
        return None
    text = ' '.join(text.split())
    text = text.replace("'", "''")  # Escape single quotes for SQL
    return text[:max_len] if len(text) > max_len else text

def generate_sql_insert(csv_file, num_jobs=20):
    """Generate SQL INSERT statements from CSV"""
    
    print(f"📂 Reading jobs from {csv_file}...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        all_jobs = list(csv_reader)
        
        # Filter legitimate jobs and select random sample
        legit_jobs = [job for job in all_jobs if job.get('fraudulent', '1') == '0']
        selected_jobs = random.sample(legit_jobs, min(num_jobs, len(legit_jobs)))
        
        print(f"📊 Found {len(legit_jobs)} legitimate jobs, generating SQL for {len(selected_jobs)}...")
        
        sql_statements = []
        
        for idx, job in enumerate(selected_jobs, 1):
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
            
            # Extract skills
            requirements_text = job.get('requirements', '')
            skills_required = []
            skill_keywords = ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 
                            'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue', 'MongoDB', 'PostgreSQL',
                            'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Kubernetes', 'Git', 'Linux']
            
            for skill in skill_keywords:
                if skill.lower() in requirements_text.lower():
                    skills_required.append(skill)
            
            # Build SQL
            title = clean_text(job.get('title', 'Position'))
            description = clean_text(job.get('description', 'Job description'))
            requirements = clean_text(job.get('requirements', ''))
            location = clean_text(job.get('location', 'Remote'), 100)
            company_name = clean_text(job.get('company_profile', '').split('.')[0], 100) or 'Company'
            benefits = clean_text(job.get('benefits', ''))
            industry = clean_text(job.get('industry', ''), 50)
            remote_ok = 'true' if job.get('telecommuting', '0') == '1' else 'false'
            
            # Format skills array for PostgreSQL
            skills_array = "NULL" if not skills_required else "ARRAY[" + ",".join([f"'{s}'" for s in skills_required]) + "]"
            
            print(f"  {idx}. {title[:50]}...")
            
            sql_statements.append(f"""
-- Job {idx}: {title[:50]}
INSERT INTO jobs (
    title, description, requirements, location, company_name,
    salary_min, salary_max, job_type, experience_level, skills_required,
    benefits, remote_ok, status, industry
) VALUES (
    '{title}',
    '{description}',
    {f"'{requirements}'" if requirements else 'NULL'},
    '{location}',
    '{company_name}',
    {salary_min if salary_min else 'NULL'},
    {salary_max if salary_max else 'NULL'},
    '{job_type}',
    '{experience_level}',
    {skills_array},
    {f"'{benefits}'" if benefits else 'NULL'},
    {remote_ok},
    'open',
    {f"'{industry}'" if industry else 'NULL'}
);
""")
        
        return sql_statements

if __name__ == "__main__":
    print("🚀 Generating SQL statements for job import...\n")
    
    sql_statements = generate_sql_insert('../fake_job_postings.csv', num_jobs=20)
    
    # Write to file
    output_file = 'import_jobs.sql'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- Import Sample Jobs from CSV\n")
        f.write("-- Generated SQL statements\n")
        f.write("-- Note: These jobs need a recruiter_id. Update after creation.\n\n")
        f.write('\n'.join(sql_statements))
    
    print(f"\n✅ SQL file generated: {output_file}")
    print(f"📝 Contains {len(sql_statements)} INSERT statements")
    print("\n📋 Next steps:")
    print("1. Open Supabase Dashboard → SQL Editor")
    print("2. Copy contents of import_jobs.sql")
    print("3. Update recruiter_id in the SQL (or we can add default)")
    print("4. Run the SQL")
    print("\nOr use the alternative method below...")
