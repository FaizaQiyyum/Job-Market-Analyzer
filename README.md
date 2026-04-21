# Job Market Analyzer 🚀

Hey there! Welcome to the Job Market Analyzer. 

I built this project to help make sense of job listings data. When you're looking at hundreds (or thousands) of job postings, it's really hard to see the bigger picture. Are companies really hiring for Python? Is everyone looking for senior devs, or are there entry-level roles too? 

This app takes a CSV file of job postings and instantly builds a clean, readable dashboard to answer those questions.

## What's under the hood?
I wanted to keep things simple, lightweight, and **100% free**. No paid APIs, no expensive cloud services, just solid open-source tech:
- **Backend**: Python with Flask. I used `pandas` to do the heavy lifting of crunching the CSV data because it's crazy fast at that kind of thing.
- **Frontend**: Vanilla HTML, CSS, and plain JavaScript. No massive frameworks to configure. 
- **Charts**: `Chart.js` handles the bar and pie charts. It's totally free, open-source, and looks great.

## Features
- **Upload your own data**: Got a CSV of jobs? Upload it and get instant analytics.
- **Built-in Sample Data**: If you just want to test it out, I included a `sample_data.csv` so you can click one button and see how it looks.
- **Insightful Metrics**: It breaks down top job titles, most required skills, who the top hiring companies are, where the jobs are located, and the experience levels they want.
- **Dark Mode UI**: Because who wants to burn their eyes staring at bright white dashboards all day?

## How to run it locally

If you just cloned this and want to spin it up on your own machine, it's super easy.

1. **Install the dependencies:**
   Make sure you have Python installed, then run:
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the server:**
   ```bash
   python app.py
   ```

3. **Check it out:**
   Open your browser.

That's it! Try clicking the "Use Sample Data" button first to see it in action, then try throwing your own CSV at it. 

Enjoy!
