let price = 0;
let priceType = 0;
let priceAge = 0;
let priceSize = 0;

const priceEstimator = {
  Maison: {
    typePrice: 15,
    agePrice: {
      "Avant 1950": 50,
      "Entre 1950 et 1980": 40,
      "Entre 1980 et 2000": 30,
      "Entre 2000 et 2012": 20,
      "Après 2012": 10,
    },
  },
  Appartement: {
    typePrice: 0,
    agePrice: {
      "Avant 1950": 25,
      "Entre 1950 et 1980": 20,
      "Entre 1980 et 2000": 15,
      "Entre 2000 et 2012": 10,
      "Après 2012": 0,
    },
  },
  Immeuble: {
    typePrice: 0,
    agePrice: {
      "Avant 1950": 250,
      "Entre 1950 et 1980": 200,
      "Entre 1980 et 2000": 150,
      "Entre 2000 et 2012": 100,
      "Après 2012": 50,
    },
  },
  Bureau: {
    typePrice: 0,
    agePrice: {
      "Avant 1950": 25,
      "Entre 1950 et 1980": 20,
      "Entre 1980 et 2000": 15,
      "Entre 2000 et 2012": 10,
      "Après 2012": 0,
    },
  },
};

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const getData = new FormData(e.currentTarget);
  const dataObject = Object.fromEntries(getData.entries());

  // Récupération des informations
  const bienType = dataObject.bien;
  const bienAge = dataObject.annee_construction;
  const bienSize = Number(dataObject.surface);

  // Calcul du prix pour le type de bien immo
  priceType = priceEstimator[bienType].typePrice;

  // Calcul du prix pour l'année de construction
  priceAge = priceEstimator[bienType].agePrice[bienAge];

  // Calcul du prix en fonction des m2
  if (bienSize < 10) {
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
  }

  price = priceType + priceAge + priceSize;

  // Calcul final du prix du DPE 
  console.log(`Pour un ${bienType} de ${bienSize} m2, construit ${bienAge}, le prix de votre DPE est estimé à ${price.toFixed(2)} €`)

  const result = document.querySelector('#result')
  result.textContent = `Pour un ${bienType} de ${bienSize} m2, construit ${bienAge}, le prix de votre DPE est estimé à ${price.toFixed(2)} €`

})