# 🚀 AI-Powered Recruitment Platform

A modern, full-stack recruitment platform built with React, FastAPI, and Supabase. Features AI-powered resume matching, real-time applications, and comprehensive recruiter tools.

## ✨ Features

### For Candidates
- 🔐 **Secure Authentication** - Email/password and Google OAuth
- 📄 **AI Resume Analysis** - Automatic skill extraction and job matching
- 🎯 **Smart Job Recommendations** - ML-powered job suggestions
- 💾 **Save Jobs** - Bookmark interesting positions
- 📊 **Application Tracking** - Monitor application status
- 🔍 **Advanced Search** - Filter by location, salary, type, etc.

### For Recruiters
- 📝 **Job Posting** - Create detailed job listings with rich metadata
- 👥 **Application Management** - View, rank, and manage candidates
- ⭐ **Candidate Ranking** - AI-powered candidate scoring
- 📈 **Analytics Dashboard** - Track job performance and applications
- 💬 **Messaging System** - Communicate with candidates
- 📅 **Interview Scheduling** - Manage interview workflows

### Technical Features
- 🤖 **ML-Powered Matching** - TF-IDF and spaCy NLP for resume analysis
- 🔒 **Row-Level Security** - Secure data access with Supabase RLS
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Real-time Updates** - Live application status changes
- 🎨 **Modern UI** - Clean, professional interface

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Supabase JS** - Database client

### Backend
- **FastAPI** - High-performance Python API
- **spaCy** - NLP for resume analysis
- **scikit-learn** - ML for job matching
- **Supabase** - PostgreSQL database
- **Uvicorn** - ASGI server

### Database
- **PostgreSQL** (via Supabase)
- **Row-Level Security** - Fine-grained access control
- **Real-time subscriptions** - Live updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Supabase account

### 1. Clone Repository
```bash
git clone <repository-url>
cd recruitment-platform
```

### 2. Database Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the schema creation scripts:
   ```sql
   -- First run: create-tables.sql
   -- Then run: enhanced-schema.sql
   ```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Backend Setup
```bash
cd backend
python setup.py  # Installs requirements and downloads models
```

Create `backend/.env`:
```env
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

### 5. Run the Application
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
python main.py
```

Visit http://localhost:5173 to see the application!

## 📁 Project Structure

```
recruitment-platform/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   └── supabaseClient.js
│   └── package.json
├── backend/                 # FastAPI backend
│   ├── main.py             # ML endpoints
│   ├── api.py              # REST API endpoints
│   ├── requirements.txt
│   └── setup.py
├── create-tables.sql       # Basic database schema
├── enhanced-schema.sql     # Extended schema with new features
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Backend (.env)**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
API_HOST=0.0.0.0
API_PORT=8001
```

### Supabase Setup

1. **Create Project** - New project at supabase.com
2. **Run SQL Scripts** - Execute schema files in SQL Editor
3. **Configure Storage** - Create 'resumes' bucket for file uploads
4. **Set RLS Policies** - Already included in schema files

## 🎯 Usage Guide

### For Candidates

1. **Sign Up** - Create account and select "Candidate" role
2. **Browse Jobs** - Search and filter available positions
3. **View Details** - Click any job card to see full details
4. **Apply** - Upload resume and submit application
5. **Track Progress** - Monitor application status in dashboard

### For Recruiters

1. **Sign Up** - Create account and select "Recruiter" role
2. **Post Jobs** - Create detailed job listings
3. **Manage Applications** - Review and rank candidates
4. **Schedule Interviews** - Coordinate with candidates
5. **Track Analytics** - Monitor job performance

## 🔌 API Endpoints

### Jobs
- `GET /api/jobs` - List jobs with filtering
- `GET /api/jobs/{id}` - Get job details
- `POST /api/jobs` - Create job (recruiter only)
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job

### Applications
- `GET /api/applications` - User's applications
- `GET /api/jobs/{id}/applications` - Job applications (recruiter)
- `PUT /api/applications/{id}` - Update application status

### ML Endpoints
- `POST /parse-resume` - Extract text and skills from PDF
- `POST /recommend` - Get job recommendations
- `POST /score-job` - Calculate match score

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run lint
```

### Backend Testing
```bash
cd backend
python -m pytest  # (tests not included in this version)
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment platform

### Backend (Railway/Heroku)
1. Create `Procfile`: `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
2. Set environment variables
3. Deploy with git push

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**"Profile not found" error**
- Run the enhanced schema SQL in Supabase
- Use the Profile Repair component in the app

**Backend connection failed**
- Check if backend is running on port 8001
- Verify CORS settings in main.py

**Resume upload fails**
- Create 'resumes' storage bucket in Supabase
- Check storage policies

**Jobs not loading**
- Verify database schema is created
- Check RLS policies in Supabase

### Getting Help

1. Check the [Issues](link-to-issues) page
2. Review Supabase logs for database errors
3. Check browser console for frontend errors
4. Verify all environment variables are set

## 🎉 What's New in This Version

### ✅ Implemented Features
- Complete REST API with authentication
- Job details page with rich metadata
- Application management dashboard for recruiters
- Enhanced database schema with 40+ new fields
- Candidate ranking and rating system
- Interview scheduling framework
- Messaging system foundation
- Saved jobs functionality
- Advanced filtering and sorting
- Professional UI/UX improvements

### 🔄 Recent Updates
- Fixed recruiter login issues
- Added profile repair functionality
- Enhanced error handling
- Improved responsive design
- Added comprehensive documentation

### 🚧 Coming Soon
- Email notifications
- Video interview integration
- Advanced analytics
- Mobile app
- LinkedIn integration
- Bulk operations
- Admin dashboard

---

**Built with ❤️ for the developer community**