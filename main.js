let price = 0;
let priceType = 0;
let priceAge = 0;
let priceSize = 0;

const form = document.querySelector("form");

const priceEstimator = {
  Maison: {
    typePrice: 20,
    agePrice: {
      "Avant 1949": 40,
      "Entre 1950 et 1997": 30,
      "Entre 1997 et 2012": 20,
      "Après 2012": 5,
    },
  },
  Appartement: {
    typePrice: 15,
    agePrice: {
      "Avant 1949": 20,
      "Entre 1950 et 1997": 15,
      "Entre 1997 et 2012": 10,
      "Après 2012": 0,
    },
  },
  Immeuble: {
    typePrice: 15,
    agePrice: {
      "Avant 1949": 250,
      "Entre 1950 et 1997": 200,
      "Entre 1997 et 2012": 150,
      "Après 2012": 50,
    },
  },
  Bureau: {
    typePrice: 15,
    agePrice: {
      "Avant 1949": 20,
      "Entre 1950 et 1997": 15,
      "Entre 1997 et 2012": 10,
      "Après 2012": 0,
    },
  },
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const getData = new FormData(e.currentTarget);
  const dataObject = Object.fromEntries(getData.entries());

  // Récupération des informations
  const bienType = dataObject.bien;
  const bienAge = dataObject.annee_construction;
  const bienSize = Number(dataObject.surface);
  const bienCity = dataObject.city;
  const bienChauffage = dataObject.chauffage; 
  const bienPiece = dataObject.piece;
  const bienPrenom = dataObject.prenom;
  const bienNom = dataObject.nom; 
  const bienEmail = dataObject.email; 
  const bienPhone = dataObject.tel;
  const bienOptin = dataObject.optin_commercial;
  const bienRaison = dataObject.raison;
  const bienAdresse = dataObject.localisation;
  const bienCP = dataObject.cp;


  // Calcul du prix pour le type de bien immo
  priceType = priceEstimator[bienType].typePrice;

  // Calcul du prix pour l'année de construction
  priceAge = priceEstimator[bienType].agePrice[bienAge];

  // Calcul par rapport à la surface
  // Algorithme de prix dégressif pour les m2. Pour le moment mis en standby le temps d'avoir des retours terrain.
  /* if (bienSize < 10) {
    priceSize = bienSize * 9;
  } else if (bienSize <= 20) {
    priceSize = bienSize * 8;
  } else if (bienSize <= 30) {
    priceSize = bienSize * 3.9;
  } else if (bienSize <= 50) {
    const dizaines = Math.floor((bienSize - 30) / 10) + 3;
    const prixUnitaire = 3.9 * 0.9 ** dizaines;
    priceSize = bienSize * prixUnitaire;
  } else if (bienSize <= 100) {
    priceSize = bienSize * 2.5;
  } else if (bienSize <= 200) {
    priceSize = bienSize * 1.9;
  } else if (bienSize <= 1000) {
    const dizainesBis = Math.floor((bienSize - 30) / 10) + 3;
    const prixUnitaireBis = 2.3 * 0.991 ** dizainesBis;
    priceSize = bienSize * prixUnitaireBis;
  } else {
    priceSize = bienSize * 0.9;
  } */ 
  if(bienSize <= 50) {
    priceSize = 80
  } else if (bienSize > 50 && bienSize <= 100) {
    priceSize = 100
  } else if (bienSize > 100 && bienSize <= 150) {
    priceSize = 130
  } else if (bienSize > 150 && bienSize <= 200) {
    priceSize = 165
  } else if (bienSize > 200 && bienSize <= 250) {
    priceSize = 200
  } else if (bienSize > 250 && bienSize <= 300) {
    priceSize = 235
  } else {
    priceSize = 270
  }

  price = priceType + priceAge + priceSize;

  // Calcul final du prix du DPE 
  console.log(`Pour un ${bienType} de ${bienSize} m2, construit ${bienAge}, DPE à partir de ${price.toFixed(2)} €`)

  const dpePrice = document.querySelector('#dpe-price')
  dpePrice.textContent = `Votre DPE à partir de ${price.toFixed(2)} € HT`

  const result = document.querySelector('#result')
  result.classList.add("is-visible")
  result.textContent = `Pour un ${bienType} de ${bienSize} m2, construit ${bienAge}, le prix de départ votre DPE est estimé à ${price.toFixed(2)} € HT`

  /**
   * Envoi des information via Webhook pour les récupérer
   */

  fetch('https://hook.eu1.make.com/ft5i9xzexag8m2j8ub02tfkfv5rm3n3b', {
    method: 'POST', 
    body: JSON.stringify({
      prenom: bienPrenom,
      nom: bienNom, 
      type: bienType,
      chauffage: bienChauffage, 
      age: bienAge, 
      ville: bienCity, 
      email: bienEmail, 
      tel: bienPhone, 
      optin: bienOptin,
      piece: bienPiece,
      surface: bienSize,
      price: price,
      raison: bienRaison,
      cp: bienCP,
      adresse: bienAdresse
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))
})

/**
 * 
 * 
 * Fonctionnalité multistep
 * 
 * 
 */


const steps = Array.from(form.getElementsByClassName('step'));
const prevBtns = Array.from(form.getElementsByClassName('btn-prev'));
const nextBtns = Array.from(form.getElementsByClassName('btn-next'));

// ajout des écouteurs d'événements
prevBtns.forEach(prevBtn => {
  prevBtn.addEventListener('click', goToPrevStep);
})

nextBtns.forEach(nextBtn => {
  nextBtn.addEventListener('click', goToNextStep);
  nextBtn.disabled = true;
});

form.addEventListener('input', checkInputs);

// fonction pour naviguer vers la prochaine étape
function goToNextStep(event) {
  const currentStep = form.querySelector('.current');
  const nextStepNum = parseInt(event.target.dataset.step);
  const nextStep = document.querySelector(`#step${nextStepNum}`);

  currentStep.classList.remove('current', 'is-visible');
  nextStep.classList.add('current', 'is-visible');
}

// fonction pour naviguer vers l'étape précédente
function goToPrevStep() {
  const currentStep = form.querySelector('.current');
  const prevStepNum = parseInt(currentStep.dataset.step) - 1;
  const prevStep = form.querySelector(`#step${prevStepNum}`);

  currentStep.classList.remove('current', 'is-visible');
  prevStep.classList.add('current', 'is-visible');
}

// fonction pour vérifier si tous les champs requis sont remplis avant de débloquer le bouton suivant
function checkInputs() {
  const currentStep = form.querySelector('.current');
  const nextBtn = form.querySelector(`#next-button-${currentStep.dataset.step}`);
  const inputs = Array.from(currentStep.querySelectorAll('input[required]'));

  const areAllInputsFilled = inputs.every(input => input.value !== '');

  if (areAllInputsFilled) {
    nextBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
  }
}
