//-------------------------1. osa Ostukorv ------------------------suurendaArtikkel
// et kood ei laseks läbi vigu
"use strict";
//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');
lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: toodeInfo.querySelector(".toode_hind").innerText,
            kogus: 1,
            summa: parseInt(toodeInfo.querySelector(".toode_hind").innerText)
        };
        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);
        if (!onKorvis) {
            lisaArtikkel(toode); // selle funktsiooni loome allpool
            korv.push(toode);
            nupuOhjamine(lisaKorviNupp, toode); // selle funktsiooni loome allpool
        }
    });
});

//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
    korviSisu.insertAdjacentHTML('beforeend', `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>
      <h3 class="korv_artikkel_summa">${toode.summa}</h3>    
      <div class="korv_artikkel_buttons">  
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `);

    lisaKorviJalus(); // selle funktsiooni lisame allpool
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));

            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => vahendaArtikkel(toode, korvArtikkelD, lisaKorviNupp));

            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
    uuendaSumma();
}

//toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = ++korvArtikkel.kogus;

            korvArtikkelD.querySelector('.korv_artikkel_summa').innerText = (korvArtikkel.summa = parseInt(korvArtikkel.summa) + parseInt(korvArtikkel.hind));
            uuendaSumma();
        }
    });
}

//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks.
function vahendaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            if (parseInt(korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText) > 1) {
                korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = --korvArtikkel.kogus;
                korvArtikkelD.querySelector('.korv_artikkel_summa').innerText = (korvArtikkel.summa -= korvArtikkel.hind);
                uuendaSumma();
            }
            else eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp);
        }
    });
}

//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();
    korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;
    uuendaSumma();
    if (korv.length < 1) {
        document.querySelector('.korv-jalus').remove();
    }
}

//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
      <div class="korv-jalus">
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <h3 class="korv-summa">Kogusumma: </h3>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `);
        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => kassa());
    }
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
    });

    document.querySelector('.korv-jalus').remove();

    lisaKorviNupud.forEach(lisaOstukorviNupp => {
        lisaKorviNupp.innerText = 'Lisa ostukorvi';
        lisaKorviNupp.disabled = false;
    });
}


//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.

function uuendaSumma() {
    const summa = korv.reduce((kokku, korvArtikkel) => {
        return kokku + parseInt(korvArtikkel.summa, 10);
    }, 0);

    const summaElement = document.querySelector('.korv-summa');
    if (summaElement) {
        summaElement.innerText = `Kogusumma: ${summa}`;
    }
}

//-------------------------2. osa Taimer ------------------------

//taimer
function alustaTaimer(kestvus, kuva) {
    let start = Date.now(),
        vahe,
        minutid,
        sekundid;

    function taimer() {
        let vahe = kestvus - Math.floor((Date.now() - start) / 1000);

        let minutid = Math.floor(vahe / 60);
        let sekundid = Math.floor(vahe % 60);

        if (minutid < 10) {
            minutid = "0" + minutid;
        }
        if (sekundid < 10) {
            sekundid = "0" + sekundid;
        }

        kuva.textContent = minutid + ":" + sekundid;

        if (vahe < 0) {
            clearInterval(vahe);
            document.getElementById("time").innerHTML = "alusta uuesti";
        };
    };
    taimer();
    setInterval(taimer, 1000);

};

window.onload = function () {
    let taimeriAeg = 60 * 2,
    kuva = document.getElementById("time");
    alustaTaimer(taimeriAeg, kuva);
};


//-------------------------3. osa Tarne vorm ------------------------

/* Ülesanne 5.3: täienda vormi sisendi kontrolli:
- eesnime ja perenime väljal ei tohi olla numbreid;
- telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid;
- üks raadionuppudest peab olema valitud;
- lisa oma valikul üks lisaväli ning sellele kontroll. Märgi see nii HTML kui JavaScripti
  koodis "minu kood" kommentaariga. */

const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const kinnitus = document.getElementById("kinnitus");
const telefon = document.getElementById("telefon");

const postiindeks = document.getElementById("postiindeks"); // minu kood

const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    if (eesnimi.value.trim() === "") {
        errors.push("Sisesta eesnimi")
    }

    // https://stackabuse.com/bytes/check-if-a-string-contains-numbers-in-javascript/
    const eesnimesNumbrid = /\d/.test(eesnimi.value);

    if (eesnimesNumbrid) {
        console.log("The input contains at least one number.");
        errors.push("Eesnimes ei tohi olla numberid.");
    }

    if (perenimi.value.trim() === "") {
        errors.push("Sisesta perenimi")
    }

    const perenimesNumbrid = /\d/.test(perenimi.value);

    if (perenimesNumbrid) {
        console.log("The input contains at least one number.");
        errors.push("Perenimes ei tohi olla numberid.");
    }

    if (telefon.value.length < 6 || !(/^\d+$/.test(telefon.value))) {
        errors.push("Telefoninumbris ei tohi olla peale numbrite midagi ning see peab olema pikem kui 6 märki.");
    }

    // https://stackoverflow.com/questions/13060313/checking-if-at-least-one-radio-button-has-been-selected-javascript
    if(document.querySelector('input[name="tarne"]:checked') == null) {
        errors.push("Vali tarneviisidest vähemalt üks.");
    }

    if (postiindeks.value.length !== 5 || !(/^\d+$/.test(postiindeks.value))){
        errors.push("Postiindeks peab olema 5-kohaline number.");
    }

    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }

    if (errors.length > 0) {
        e.preventDefault();
        errorMessage.innerHTML = errors.join(', ');
    }
    else {
        errorMessage.innerHTML = "";

    }

})




