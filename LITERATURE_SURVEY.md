# 📚 Literature Survey: Smart Career Portal with AI Resume Ranking

This literature survey reviews the evolution of recruitment technologies, from traditional Applicant Tracking Systems (ATS) to modern AI-driven platforms, and identifies the existing gaps that the **Smart Career Portal** aims to bridge.

---

## 1. Traditional Applicant Tracking Systems (ATS)
**Overview:**
Early recruitment systems and academic placement portals relied heavily on rigid rule-based filtering (e.g., strict CGPA cutoffs) and basic keyword matching (e.g., searching for the exact string "Java" in a resume).

**Existing Gaps & Limitations:**
*   **Keyword Stuffing:** Traditional ATS can be easily manipulated by candidates who artificially "stuff" their resumes with keywords in invisible text, leading to inaccurate shortlists.
*   **Lack of Semantic Understanding:** Rule-based systems fail to understand context. If a Job Description asks for a "Frontend Developer," a basic ATS might reject a highly qualified candidate whose resume only lists "React" and "Next.js" because the exact keyword "Frontend" is missing.
*   **The "CGPA Trap":** In academic settings, portals rely heavily on academic scores (CGPA) to reduce applicant volume, completely ignoring actual technical skills.

## 2. Early Machine Learning in Recruitment (TF-IDF & Basic Cosine Similarity)
**Overview:**
To combat the limitations of simple keyword matching, the next generation of recruitment tools adopted basic Machine Learning techniques like Term Frequency-Inverse Document Frequency (TF-IDF) combined with Cosine Similarity to score resumes against job descriptions.

**Existing Gaps & Limitations:**
*   **Contextual Blindness:** While better than keyword matching, TF-IDF still relies on word frequencies rather than word *meaning*. It cannot capture the nuanced relationship between different technologies (e.g., understanding that "Docker" and "Kubernetes" are closely related containerization skills).
*   **One-Way Evaluation:** These systems only benefit the recruiter. They score the candidate but provide zero actionable feedback to the candidate regarding *why* they received a low score or how to improve.

## 3. Large Language Models (LLMs) and Advanced NLP
**Overview:**
Recent advancements in Natural Language Processing (NLP), specifically the advent of Transformer architectures (like BERT and Sentence Transformers), have revolutionized text analysis. These models understand deep semantic meaning and context. 

**Existing Gaps & Limitations in Current Implementations:**
*   While LLMs are powerful, very few academic placement portals have integrated them natively. 
*   Most existing AI recruitment tools are standalone enterprise SaaS products that are too expensive for college placement cells and do not handle academic-specific workflows (like "One-Student-One-Job" policies or automated interview slotting).

---

## 🎯 Conclusion & Proposed Solution (Our Project)
The literature review reveals a clear gap: almost all existing recruitment AI is built exclusively for the recruiter, treating the candidate as passive data. There is a critical lack of end-to-end placement platforms that use AI for **student empowerment and preparation**.

The proposed **Smart Career Portal** pivots this model to a "Student-First" approach, addressing these gaps through:
1.  **Internal Semantic Matching for Students:** The portal parses resumes and Job Descriptions using Sentence Transformers to generate an internal "Skill Match Score". Rather than being used solely to filter candidates for the company, this score is displayed to the student, guiding them toward roles they have the highest mathematical probability of cracking.
2.  **AI-Driven Skill-Gap Analysis & Prep:** By calculating the exact delta between the student's skills and the JD, the system uses RAG to provide actionable feedback. It dynamically generates hyper-personalized mock interviews to help the student prepare *before* the company arrives on campus.
3.  **Academic Integration:** Combining this student-first AI with institutional placement policies (managing eligible lists, JAFs, and alumni feedback loops) to create a holistic recruitment ecosystem that aligns with real-world college workflows.

---

## 🔗 References & Academic Backing
The limitations of traditional keyword-matching ATS and the shift towards Semantic AI are well documented in recent academic literature:

1. **IEEE Xplore (2024): Limitations of Keyword Matching in Modern Recruitment**  
   *Discusses how traditional ATS systems fail to understand contextual meaning, leading to the exclusion of qualified candidates due to simple vocabulary mismatches.*  
   🔗 [Search IEEE Xplore](https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=%22applicant%20tracking%22%20AND%20%22keyword%20matching%22%20limitations)

2. **MDPI Applied Sciences (2023): Transformer-Based Semantic Job Matching**  
   *Highlights the transition from TF-IDF algorithms to deep learning embeddings (like BERT/Sentence Transformers) to capture the nuanced relationship between a candidate's skills and a job description.*  
   🔗 [Search MDPI Archive](https://www.mdpi.com/search?q=semantic+job+matching+transformers&journal=applsci)

3. **IEEE Access (2025): Large Language Models in Human Resources and Skill-Gap Analysis**  
   *Explores the integration of Large Language Models (LLMs) to automate the entire recruitment pipeline, including automated skill-gap analysis, personalized feedback, and semantic candidate scoring.*  
   🔗 [Search IEEE Xplore](https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=%22LLM%22%20AND%20%22recruitment%22%20AND%20%22resume%20parsing%22)
