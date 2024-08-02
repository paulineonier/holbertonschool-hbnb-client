document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            try {
                const response = await fetch('https://your-api-url/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    document.cookie = `token=${data.access_token}; path=/`;
                    window.location.href = 'index.html';
                } else {
                    errorMessage.style.display = 'block';
                    errorMessage.textContent = 'Échec de la connexion : ' + response.statusText;
                }
            } catch (error) {
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Une erreur est survenue : ' + error.message;
            }
        });
    }
});
