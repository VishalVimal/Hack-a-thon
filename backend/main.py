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

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load NLP model
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
    jobs: list[dict] # List of job objects from Supabase

def extract_text_from_pdf(file_bytes):
    reader = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def extract_skills(text):
    doc = nlp(text)
    # Basic skill extraction using NOUNs and PROPNs, plus a simple keyword list could be added
    # For this hackathon, we'll return named entities of type 'ORG', 'PRODUCT', 'WORK_OF_ART', 'GPE' as a proxy for skills/context
    # and also just specific keywords if we had a list.
    
    skills = set()
    for ent in doc.ents:
        if ent.label_ in ["ORG", "PRODUCT", "Language"]:
            skills.add(ent.text)
            
    # Fallback/Add common tech keywords (simple regex for demo)
    keywords = ["Python", "Java", "React", "JavaScript", "SQL", "AWS", "Docker", "Kubernetes", "Machine Learning", "AI", "Figma", "Design", "TypeScript"]
    for kw in keywords:
        if re.search(r'\b' + re.escape(kw) + r'\b', text, re.IGNORECASE):
            skills.add(kw)
            
    return list(skills)

@app.get("/")
def read_root():
    return {"message": "Recruitment Portal ML Service Ready"}

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    contents = await file.read()
    text = extract_text_from_pdf(contents)
    skills = extract_skills(text)
    
    return {
        "filename": file.filename,
        "extracted_text_preview": text[:200] + "...",
        "skills": skills,
        "full_text": text # Send back text for client to use in scoring
    }

@app.post("/score-job")
def score_job(req: JobScoreRequest):
    documents = [req.resume_text, req.job_description]
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(documents)
    
    # Cosine Similarity between Resume (idx 0) and Job (idx 1)
    score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    percentage = round(score * 100, 2)
    
    # Missing keywords analysis
    feature_names = vectorizer.get_feature_names_out()
    resume_vector = tfidf_matrix[0].toarray()[0]
    job_vector = tfidf_matrix[1].toarray()[0]
    
    missing_keywords = []
    for i, val in enumerate(job_vector):
        if val > 0 and resume_vector[i] == 0:
            missing_keywords.append(feature_names[i])
            
    # Sort missing keywords by importance (tfidf value in job doc)
    # top 5 missing
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

    job_descriptions = [job['description'] + " " + " ".join(job.get('skills_required', [])) for job in req.jobs]
    documents = [req.resume_text] + job_descriptions
    
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(documents)
    
    # Compare Resume (0) with all Jobs (1..N)
    cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    
    # Get top indices
    related_docs_indices = cosine_similarities.argsort()[::-1]
    
    recommendations = []
    for i in related_docs_indices:
        if cosine_similarities[i] > 0.1: # Threshold
            job = req.jobs[i]
            job['score'] = round(cosine_similarities[i] * 100, 1)
            recommendations.append(job)
            
    return {"recommendations": recommendations[:5]} # Top 5

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
