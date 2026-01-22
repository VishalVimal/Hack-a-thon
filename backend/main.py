from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import spacy
from pypdf import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import io
import re

app = FastAPI(title="Recruitment Platform - ML & API", version="1.0.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


try:
    nlp = spacy.load("en_core_web_sm")
except:
    print("Downloading model...")
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

class JobScoreRequest(BaseModel):
    resume_text: str
    job_description: str

class RecommendationRequest(BaseModel):
    resume_text: str
    jobs: list[dict] 

def extract_text_from_pdf(file_bytes):
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        if not text.strip():
            raise ValueError("No text could be extracted from PDF")
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")

def extract_skills(text):
    doc = nlp(text)
    skills = set()
    
   
    for ent in doc.ents:
        if ent.label_ in ["ORG", "PRODUCT", "GPE", "LANGUAGE"]:
            skills.add(ent.text)
    
 
    keywords = [
       
        "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Scala", "R", "MATLAB",
       
        "React", "Angular", "Vue", "Next.js", "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring", "ASP.NET",
        "HTML", "CSS", "SASS", "LESS", "Bootstrap", "Tailwind", "jQuery",
        
        "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Oracle", "SQL Server", "SQLite", "DynamoDB", "Cassandra",
       
        "AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "GitLab", "CircleCI", "Terraform", "Ansible",
        
        "Machine Learning", "Deep Learning", "AI", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Keras", "NLP", "Computer Vision",
        
        "Git", "GitHub", "Jira", "Confluence", "Slack", "Figma", "Adobe XD", "Sketch", "Postman",
        
        "React Native", "Flutter", "iOS", "Android", "Xamarin",
       
        "Agile", "Scrum", "REST API", "GraphQL", "Microservices", "CI/CD", "Testing", "Unit Testing", "Integration Testing",
        "Linux", "Unix", "Windows", "MacOS", "Bash", "PowerShell"
    ]
    
    text_lower = text.lower()
    for kw in keywords:
        if re.search(r'\b' + re.escape(kw.lower()) + r'\b', text_lower):
            skills.add(kw)

    exp_pattern = r'(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)'
    exp_matches = re.findall(exp_pattern, text, re.IGNORECASE)
    
    return {
        "skills": sorted(list(skills)),
        "years_of_experience": max([int(y) for y in exp_matches], default=0)
    }

@app.get("/")
def read_root():
    return {"message": "Recruitment Portal ML Service Ready", "status": "healthy", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "services": {
            "nlp_model": "loaded" if nlp else "not loaded",
            "api": "running"
        }
    }

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        from security import hash_pdf_with_metadata, SecurityValidator
        
        contents = await file.read()
        
        SecurityValidator.validate_file_size(len(contents), max_size_mb=10)
        
        safe_filename = SecurityValidator.sanitize_filename(file.filename)
        
        pdf_hash_data = hash_pdf_with_metadata(contents, user_id="system")
        
        text = extract_text_from_pdf(contents)
        skill_data = extract_skills(text)
        
        return {
            "filename": safe_filename,
            "extracted_text_preview": text[:300] + "..." if len(text) > 300 else text,
            "skills": skill_data["skills"],
            "years_of_experience": skill_data["years_of_experience"],
            "total_skills_found": len(skill_data["skills"]),
            "full_text": text,
            "security_metadata": {
                "file_hash": pdf_hash_data["file_hash"],
                "file_size": pdf_hash_data["file_size"],
                "processed_at": pdf_hash_data["timestamp"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")

@app.post("/score-job")
def score_job(req: JobScoreRequest):
    documents = [req.resume_text, req.job_description]
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(documents)

    score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    percentage = round(score * 100, 2)
    
    feature_names = vectorizer.get_feature_names_out()
    resume_vector = tfidf_matrix[0].toarray()[0]
    job_vector = tfidf_matrix[1].toarray()[0]
    
    missing_keywords = []
    for i, val in enumerate(job_vector):
        if val > 0 and resume_vector[i] == 0:
            missing_keywords.append(feature_names[i])
            

    missing_keywords = sorted(missing_keywords, key=lambda x: job_vector[list(feature_names).index(x)], reverse=True)[:5]

    return {
        "match_score": percentage,
        "missing_keywords": missing_keywords,
        "feedback": "Great match!" if percentage > 70 else "Consider adding more relevant keywords."
    }

@app.post("/recommend")
def recommend_jobs(req: RecommendationRequest):
    if not req.jobs:
        return {"recommendations": []}
    
    if not req.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty")

    try:

        job_descriptions = []
        for job in req.jobs:
            desc = job.get('description', '')
            title = job.get('title', '')
            skills = ' '.join(job.get('skills_required', []))
            requirements = job.get('requirements', '')
            job_text = f"{title} {desc} {skills} {requirements}"
            job_descriptions.append(job_text)
        
        documents = [req.resume_text] + job_descriptions
        
        vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        tfidf_matrix = vectorizer.fit_transform(documents)
   
        cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    
        related_docs_indices = cosine_similarities.argsort()[::-1]
        
        recommendations = []
        for i in related_docs_indices:
            if cosine_similarities[i] > 0.05:  
                job = req.jobs[i].copy()
                job['score'] = round(cosine_similarities[i] * 100, 1)
                recommendations.append(job)
        
        return {"recommendations": recommendations[:10]}  # Top 10
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
