import pandas as pd
from collections import Counter

def process_job_data(df: pd.DataFrame):
    # Standardize columns by lowering case and stripping whitespace
    df.columns = [str(col).strip().lower().replace(' ', '_') for col in df.columns]
    
    # Try to map columns heuristically if exact matching fails
    col_mapping = {
        'job_title': ['job_title', 'title', 'job', 'position'],
        'company': ['company', 'employer', 'organization'],
        'location': ['location', 'city', 'region'],
        'skills': ['skills', 'required_skills', 'qualifications'],
        'experience': ['experience_level', 'experience', 'level', 'seniority']
    }
    
    mapped_df = pd.DataFrame()
    for target, possible_names in col_mapping.items():
        found = False
        for name in possible_names:
            if name in df.columns:
                mapped_df[target] = df[name]
                found = True
                break
        if not found:
            mapped_df[target] = ['Unknown'] * len(df)
            
    # Remove empty rows
    mapped_df = mapped_df.dropna(how='all')
            
    # Process
    # 1. Top 10 job titles
    top_titles = mapped_df['job_title'].value_counts().head(10).to_dict()
    
    # 2. Most required skills
    # Skills are typically separated by commas or semicolons
    skills_series = mapped_df['skills'].dropna().astype(str)
    all_skills = []
    for skill_str in skills_series:
        split_skills = [s.strip() for s in skill_str.replace(';', ',').split(',')]
        all_skills.extend([s for s in split_skills if s and s.lower() != 'unknown'])
        
    top_skills = dict(Counter(all_skills).most_common(10))
    
    # 3. Top hiring companies
    top_companies = mapped_df['company'].value_counts().head(10).to_dict()
    
    # 4. Job distribution by location
    locations = mapped_df['location'].value_counts().head(10).to_dict()
    
    # 5. Experience level breakdown
    experience_levels = mapped_df['experience'].value_counts().to_dict()
    
    return {
        'top_titles': top_titles,
        'top_skills': top_skills,
        'top_companies': top_companies,
        'locations': locations,
        'experience_levels': experience_levels,
        'total_jobs': len(mapped_df)
    }
