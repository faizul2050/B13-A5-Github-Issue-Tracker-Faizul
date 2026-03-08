/**
 * 1. Global Element Selection
 */
const loginPage = document.getElementById('loginPage');
const dashboard = document.getElementById('dashboard');
const issuesContainer = document.getElementById('issuesContainer');
const loader = document.getElementById('loader');
const issueCount = document.getElementById('issueCount');

/**
 * 2. Authentication Logic
 */
function handleLogin(event) {
    if (event) event.preventDefault(); 

    const user = document.getElementById('usernameInput').value;
    const pass = document.getElementById('passwordInput').value;

    if (user === 'admin' && pass === 'admin123') {
        loginPage.classList.add('hidden');
        dashboard.classList.remove('hidden');
        loadIssues('all');
    } else {
        alert('Credentials Error! Use admin / admin123');
    }
}

/**
 * 3. Data Fetching from API
 */
async function loadIssues(status = 'all', btn = null) {
    showLoader(true);
    
    if(btn) {
        const tabs = btn.parentElement.querySelectorAll('button');
        tabs.forEach(t => {
            t.classList.remove('btn-primary');
            t.classList.add('btn-ghost');
        });
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-ghost');
    }

    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const responseData = await res.json();
        
        // API response structure handle
        const allIssues = Array.isArray(responseData) ? responseData : (responseData.data || []);
        
        let filtered = allIssues;
        if (status !== 'all') {
            filtered = allIssues.filter(item => (item.status || '').toLowerCase() === status);
        }
        displayIssues(filtered);
    } catch (err) {
        console.error("API Error:", err);
        issuesContainer.innerHTML = `<p class="text-center col-span-full py-10">Failed to load issues.</p>`;
    } finally {
        showLoader(false);
    }
}

/**
 * 4. UI Rendering (Issue Cards)
 */
function displayIssues(issues) {
    issuesContainer.innerHTML = ''; 
    issueCount.innerText = issues.length || 0;

    if (!issues || issues.length === 0) {
        issuesContainer.innerHTML = `<p class="text-center col-span-full py-10 text-gray-400">No issues found.</p>`;
        return;
    }

    issues.forEach(issue => {
        const issueId = issue.id || '000';
        const issueTitle = issue.title || 'Untitled Issue';
        const issueAuthor = issue.author || 'Anonymous';
        const issueStatus = (issue.status || 'open').toLowerCase();
        const issuePriority = issue.priority || 'Low';

        const isOpen = issueStatus === 'open' || issueStatus === 'opened';
        const topBorder = isOpen ? 'border-t-[#00AB6B]' : 'border-t-[#A855F7]';
        const statusIcon = isOpen 
            ? 'fa-circle-dot text-[#00AB6B] bg-green-50' 
            : 'fa-circle-check text-[#A855F7] bg-purple-50';
        
        let priorityClass = "";
        const p = issuePriority.toLowerCase();
        if (p === 'high') priorityClass = "bg-red-500 text-white";
        else if (p === 'medium') priorityClass = "bg-yellow-400 text-slate-800";
        else priorityClass = "bg-[#CBD5E1] text-slate-700";

        const card = document.createElement('div');
        card.className = `card bg-white border border-gray-200 border-t-4 ${topBorder} shadow-sm hover:shadow-md transition-all cursor-default`;
        
        card.innerHTML = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <div class="w-8 h-8 flex items-center justify-center rounded-full ${statusIcon.split(' ').slice(1).join(' ')}">
                        <i class="fa-solid ${statusIcon.split(' ')[0]} text-sm"></i>
                    </div>
                    <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase ${priorityClass}">
                        ${issuePriority}
                    </span>
                </div>

                <h2 onclick="showDetails(${issueId})" class="font-bold text-slate-800 hover:text-primary cursor-pointer mb-2 text-lg leading-tight">
                    ${issueTitle}
                </h2>
                
                <p class="text-sm text-slate-400 line-clamp-2 mb-4">
                    ${issue.description || 'No description available for this issue.'}
                </p>
                
                <div class="flex gap-2">
                    <span class="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-500 border border-red-100 rounded-full text-[11px] font-bold">
                        <i class="fa-solid fa-face-angry"></i> BUG
                    </span>
                    <span class="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[11px] font-bold">
                        <i class="fa-solid fa-circle-nodes"></i> HELP WANTED
                    </span>
                </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-100">
                <p class="text-xs text-slate-500 font-semibold">#${issueId} by ${issueAuthor}</p>
                <p class="text-xs text-slate-400 mt-1">${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-US') : 'N/A'}</p>
            </div>
        `;
        issuesContainer.appendChild(card);
    });
}

/**
 * 5. Search Functionality
 */
async function handleSearch() {
    const query = document.getElementById('searchInput').value;
    if(!query) return loadIssues('all');
    
    showLoader(true);
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`);
        const data = await res.json();
        const results = Array.isArray(data) ? data : (data.data || []);
        displayIssues(results);
    } catch (err) {
        console.error("Search failed", err);
    } finally {
        showLoader(false);
    }
}

/**
 * 6. Detailed Issue View (Modal)
 */
async function showDetails(id) {
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const responseData = await res.json();
        
        // API sometimes wraps data in a 'data' property
        const issue = responseData.data ? responseData.data : responseData;

        const title = issue.title || "No Title Provided";
        const author = issue.author || "Guest User";
        const description = issue.description || "No description provided.";
        const priority = issue.priority || "Low";
        const status = (issue.status || "open").toLowerCase();
        const date = issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-GB') : "No Date";

        const isOpen = status === 'open' || status === 'opened';
        const headerColor = isOpen ? 'bg-[#00AB6B]' : 'bg-[#A855F7]';
        const statusBadge = isOpen ? 'bg-[#00AB6B]' : 'bg-[#A855F7]';
        
        let modalPriorityBg = "";
        const p = priority.toLowerCase();
        if (p === 'high') modalPriorityBg = "bg-red-500 text-white";
        else if (p === 'medium') modalPriorityBg = "bg-yellow-400 text-slate-800";
        else modalPriorityBg = "bg-[#CBD5E1] text-slate-700";

        document.getElementById('modalHeaderColor').className = `h-2 w-full ${headerColor}`;
        
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.innerText = title;
        modalTitle.className = "text-2xl font-bold text-slate-800 mb-3";
        
        document.getElementById('modalBody').innerHTML = `
            <div class="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <span class="${statusBadge} text-white px-3 py-0.5 rounded-full text-xs font-semibold capitalize">
                    ${status}
                </span>
                <span>•</span>
                <span>Opened by <span class="text-slate-500 font-medium">${author}</span></span>
                <span>•</span>
                <span>${date}</span>
            </div>

            <div class="flex gap-2 mb-8">
                <span class="flex items-center gap-1.5 px-3 py-0.5 bg-red-50 text-red-500 border border-red-100 rounded-full text-[10px] font-bold">
                    <i class="fa-solid fa-face-angry"></i> BUG
                </span>
                <span class="flex items-center gap-1.5 px-3 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-bold">
                    <i class="fa-solid fa-circle-nodes"></i> HELP WANTED
                </span>
            </div>

            <div class="text-slate-500 leading-relaxed mb-10 text-[15px]">
                ${description}
            </div>

            <div class="bg-[#F8FAFC] rounded-xl p-6 flex justify-between items-center mb-4">
                <div>
                    <h4 class="text-slate-400 text-sm mb-1 font-medium">Assignee:</h4>
                    <p class="font-bold text-slate-800 text-lg">${author}</p>
                </div>
                <div class="text-right">
                    <h4 class="text-slate-400 text-sm mb-1 font-medium">Priority:</h4>
                    <span class="px-4 py-1.5 ${modalPriorityBg} rounded-full font-bold text-[10px] uppercase tracking-wider">
                        ${priority}
                    </span>
                </div>
            </div>

            <div class="flex justify-end mt-8">
                <form method="dialog">
                    <button class="btn bg-[#4F16FF] hover:bg-[#4312D6] text-white border-none px-10 rounded-xl font-bold h-12">Close</button>
                </form>
            </div>
        `;
        
        document.getElementById('issueModal').showModal();
    } catch (err) {
        console.error("Modal Error:", err);
    }
}

/**
 * 7. Loader Utility
 */
function showLoader(state) {
    if(state) {
        loader.classList.remove('hidden');
        issuesContainer.innerHTML = '';
    } else {
        loader.classList.add('hidden');
    }
}