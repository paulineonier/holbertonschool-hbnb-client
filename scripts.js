// Fonction pour extraire l'ID du lieu depuis les paramètres de l'URL
function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Fonction pour vérifier l'authentification de l'utilisateur
function checkAuthentication() {
    const token = getCookie('token');
    const addReviewSection = document.getElementById('add-review');

    if (!token) {
        addReviewSection.style.display = 'none';
    } else {
        addReviewSection.style.display = 'block';
        // Store the token for later use
        return token;
    }
    return null;
}

// Fonction pour obtenir la valeur d'un cookie par son nom
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Fonction pour récupérer les détails du lieu depuis l'API
async function fetchPlaceDetails(token, placeId) {
    const response = await fetch(`https://your-api-url/places/${placeId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const place = await response.json();
        displayPlaceDetails(place);
    } else {
        console.error('Erreur lors de la récupération des détails du lieu.');
    }
}

// Fonction pour gérer la réponse de l'API
function handleResponse(response) {
    if (response.ok) {
        alert('Review submitted successfully!');
        document.getElementById('review-form').reset(); // Réinitialiser le formulaire
    } else {
        alert('Failed to submit review. Please try again.');
    }
}

// Fonction pour afficher les détails du lieu sur la page
function displayPlaceDetails(place) {
    const placeDetailsSection = document.getElementById('place-details');
    placeDetailsSection.innerHTML = `
        <h1>${place.name}</h1>
        <p>${place.description}</p>
        <p><strong>Localisation :</strong> ${place.location}</p>
        <div>
            ${place.images.map(img => `<img src="${img}" alt="${place.name}" class="place-image-large">`).join('')}
        </div>
    `;
}

// Fonction principale pour gérer le chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const placeId = getPlaceIdFromURL();
    const token = checkAuthentication();

    if (placeId && token) {
        fetchPlaceDetails(token, placeId);
    }

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const comment = document.getElementById('comment').value;
            const rating = document.getElementById('rating').value;

            await addReview(token, placeId, comment, rating);
        });
    }
});

// Fonction pour ajouter une révision pour un lieu
async function addReview(token, placeId, comment, rating) {
    const response = await fetch(`https://your-api-url/places/${placeId}/reviews`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment, rating })
    });

    if (response.ok) {
        alert('Révision ajoutée avec succès !');
    } else {
        alert('Erreur lors de l\'ajout de la révision.');
    }
}
