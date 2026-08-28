
// Génère un numéro de série aléatoire
function genererNumeroSerie() {

    const prefixe = "CP";
    const annee = new Date().getFullYear();
    const numero = Math.floor(10000000 + Math.random() * 90000000);

    return `${prefixe}-${annee}-${numero}`;
}


const serial = document.getElementById("serial");

const codePromo = localStorage.getItem("codePromo");

if (serial) {

    if (codePromo) {

        serial.textContent = codePromo;

    } else {

        serial.textContent = genererNumeroSerie();

    }

}


const historique = document.querySelectorAll("button")[0];

historique.addEventListener("click", function () {

    alert("Aucune opération disponible.");

});



const remboursement = document.querySelectorAll("button")[1];

remboursement.addEventListener("click", function () {

    alert("Votre demande de remboursement est actuellement indisponible.");

});


const deconnexion = document.querySelectorAll("button")[2];

deconnexion.addEventListener("click", function () {

    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {

        // Remise à zéro
        localStorage.removeItem("tentatives");
        localStorage.removeItem("codePromo");

        // Retour à la page de vérification
        window.location.href = "verification.html";

    }

});
