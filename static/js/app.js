// Global state to store the latest analysis response data
let currentAnalysisData = null;

// Chart Instances
let titleChartInstance = null;
let expChartInstance = null;
let locChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const sampleBtn = document.getElementById('sampleBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const fileInput = document.getElementById('csvFile');

    analyzeBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a CSV file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        await performAnalysis('/api/analyze', {
            method: 'POST',
            body: formData
        });
    });

    sampleBtn.addEventListener('click', async () => {
        await performAnalysis('/api/sample', { method: 'GET' });
    });

    downloadBtn.addEventListener('click', async () => {
        if (!currentAnalysisData) return;
        
        try {
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentAnalysisData)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'analysis_report.json';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                alert('Download failed.');
            }
        } catch (err) {
            console.error('Error downloading:', err);
            alert('Error downloading report.');
        }
    });
});

async function performAnalysis(url, options) {
    const loader = document.getElementById('loader');
    const dashboard = document.getElementById('dashboard');
    const downloadBtn = document.getElementById('downloadBtn');
    
    loader.style.display = 'block';
    
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Server error');
        }
        
        currentAnalysisData = data;
        updateDashboard(data);
        
        dashboard.classList.remove('hidden');
        downloadBtn.classList.remove('hidden');
    } catch (err) {
        console.error('Analysis failed:', err);
        alert(`Analysis failed: ${err.message}`);
    } finally {
        loader.style.display = 'none';
    }
}

function updateDashboard(data) {
    // 1. Update Summary Cards
    document.getElementById('valTotalJobs').innerText = data.total_jobs;
    document.getElementById('valUniqueTitles').innerText = Object.keys(data.top_titles).length;
    document.getElementById('valCompanies').innerText = Object.keys(data.top_companies).length;

    // 2. Update Lists
    updateList('skillsList', data.top_skills);
    updateList('companiesList', data.top_companies);

    // 3. Render Charts
    renderBarChart(data.top_titles);
    renderPieChart(data.experience_levels);
    renderLocationChart(data.locations);
}

function updateList(elementId, itemsObj) {
    const ul = document.getElementById(elementId);
    ul.innerHTML = ''; // Clear existing
    
    // Convert object to array and sort by value desc
    const sorted = Object.entries(itemsObj).sort((a, b) => b[1] - a[1]);
    
    for (const [key, val] of sorted) {
        const li = document.createElement('li');
        li.innerHTML = `<span class="list-label">${key}</span> <span class="list-count">${val}</span>`;
        ul.appendChild(li);
    }
}

// Chart configurations
Chart.defaults.color = '#94a3b8';

function renderBarChart(titleData) {
    const ctx = document.getElementById('jobTitlesChart').getContext('2d');
    
    if (titleChartInstance) {
        titleChartInstance.destroy();
    }
    
    // Sort and limit items
    const sorted = Object.entries(titleData).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(item => item[0]);
    const dVals = sorted.map(item => item[1]);

    const gradients = ctx.createLinearGradient(0, 0, 0, 400);
    gradients.addColorStop(0, '#60a5fa');
    gradients.addColorStop(1, '#3b82f6');

    titleChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Job Postings',
                data: dVals,
                backgroundColor: gradients,
                borderRadius: 4,
                borderWidth: 0
            }]
        },
        options: {
            indexAxis: 'y', // horizontal bar chart
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    grid: { display: false }
                }
            }
        }
    });
}

function renderPieChart(expData) {
    const ctx = document.getElementById('experienceChart').getContext('2d');
    
    if (expChartInstance) {
        expChartInstance.destroy();
    }
    
    const labels = Object.keys(expData);
    const dVals = Object.values(expData);
    
    // Palette
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

    expChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: dVals,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#f8fafc', padding: 20 }
                }
            }
        }
    });
}

function renderLocationChart(locData) {
    const ctx = document.getElementById('locationChart').getContext('2d');
    
    if (locChartInstance) {
        locChartInstance.destroy();
    }
    
    const sorted = Object.entries(locData).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(item => item[0]);
    const dVals = sorted.map(item => item[1]);

    locChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jobs per Location',
                data: dVals,
                backgroundColor: '#8b5cf6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    beginAtZero: true
                }
            }
        }
    });
}
