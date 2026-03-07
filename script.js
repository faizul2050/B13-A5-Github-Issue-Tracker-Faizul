/**1. Global Element Selection*/
const loginPage = document.getElementById('loginPage');
const dashboard = document.getElementById('dashboard');
const issuesContainer = document.getElementById('issuesContainer');
const loader = document.getElementById('loader');
const issueCount = document.getElementById('issueCount');

/**2. Login Function*/
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