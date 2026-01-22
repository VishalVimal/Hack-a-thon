#!/usr/bin/env python3
"""
Setup script for the recruitment platform backend
"""

import os
import subprocess
import sys

def install_requirements():
    """Install Python requirements"""
    print("Installing Python requirements...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def download_spacy_model():
    """Download spaCy English model"""
    print("Downloading spaCy English model...")
    subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])

def create_env_file():
    """Create .env file with default values"""
    env_content = """# Supabase Configuration
SUPABASE_URL=https://lixbzbmgkxnbqkuwtdje.supabase.co
SUPABASE_SERVICE_KEY=your-service-key-here

# API Configuration
API_HOST=0.0.0.0
API_PORT=8001
"""
    
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write(env_content)
        print("Created .env file with default configuration")
        print("Please update SUPABASE_SERVICE_KEY in .env file")
    else:
        print(".env file already exists")

def main():
    """Main setup function"""
    print("Setting up Recruitment Platform Backend...")
    
    try:
        install_requirements()
        download_spacy_model()
        create_env_file()
        
        print("\n✅ Backend setup complete!")
        print("\nNext steps:")
        print("1. Update SUPABASE_SERVICE_KEY in .env file")
        print("2. Run the enhanced schema SQL in Supabase dashboard")
        print("3. Start the server with: python main.py")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Setup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()