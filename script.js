/* ======================================================
   SAFEERA MADINAH
   JAVASCRIPT
====================================================== */


/* ======================================================
   DATA
====================================================== */

const safeeraWhatsApp = "6282165870953";


const counters = {

  adult: 2,
  child: 0,
  infant: 0

};



/* ======================================================
   FORMAT RUPIAH
====================================================== */

function rupiah(number) {

  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }
  ).format(number);

}



/* ======================================================
   COUNTER
====================================================== */

function changeCounter(type, amount) {

  counters[type] += amount;


  if (type === "adult" && counters[type] < 1) {

    counters[type] = 1;

  }


  if (type !== "adult" && counters[type] < 0) {

    counters[type] = 0;

  }


  document.getElementById(
    type + "Count"
  ).textContent = counters[type];


  calculateEstimate();

}



/* ======================================================
   GET RADIO
====================================================== */

function getCheckedValue(name) {

  const selected =
    document.querySelector(
      `input[name="${name}"]:checked`
    );


  return selected
    ? Number(selected.value)
    : 0;

}



function getCheckedLabel(name) {

  const selected =
    document.querySelector(
      `input[name="${name}"]:checked`
    );


  return selected
    ? selected.dataset.label
    : "";

}



/* ======================================================
   CALCULATOR
====================================================== */

function calculateEstimate() {

  const adult = counters.adult;

  const child = counters.child;

  const infant = counters.infant;


  const totalTravellers =
    adult + child + infant;


  /*
    Untuk versi awal:
    dewasa & anak dihitung penuh.
    bayi 30%.

    Formula dapat diganti nanti
    sesuai harga sebenarnya.
  */

  const billableEquivalent =
    adult +
    child +
    (infant * 0.3);


  /* VISA */

  const visaPrice =
    getCheckedValue("visa");


  const visaTotal =
    visaPrice *
    billableEquivalent;



  /* HOTEL */

  const makkahNights =
    Number(
      document.getElementById(
        "makkahNights"
      ).value
    );


  const madinahNights =
    Number(
      document.getElementById(
        "madinahNights"
      ).value
    );


  const hotelNightPrice =
    getCheckedValue(
      "hotelCategory"
    );


  const totalHotelNights =
    makkahNights +
    madinahNights;


  const hotelTotal =
    hotelNightPrice *
    totalHotelNights *
    billableEquivalent;



  /* TRANSPORT */

  const transportElement =
    document.getElementById(
      "transportType"
    );


  const transportPrice =
    Number(
      transportElement.value
    );


  const transportTotal =
    transportPrice *
    billableEquivalent;



  /* ADD ONS */

  let addonTotal = 0;


  const mutawwif =
    document.getElementById(
      "mutawwifAddon"
    );


  const handling =
    document.getElementById(
      "handlingAddon"
    );


  const haramain =
    document.getElementById(
      "haramainAddon"
    );


  const ziarah =
    document.getElementById(
      "ziarahAddon"
    );


  /*
    Mutawwif diasumsikan
    satu hari per booking,
    bukan per jamaah.
  */

  if (mutawwif.checked) {

    addonTotal +=
      Number(mutawwif.value);

  }


  if (handling.checked) {

    addonTotal +=
      Number(handling.value) *
      billableEquivalent;

  }


  if (haramain.checked) {

    addonTotal +=
      Number(haramain.value) *
      billableEquivalent;

  }


  if (ziarah.checked) {

    addonTotal +=
      Number(ziarah.value) *
      billableEquivalent;

  }



  /* GRAND TOTAL */

  const grandTotal =
    visaTotal +
    hotelTotal +
    transportTotal +
    addonTotal;


  const perPerson =
    grandTotal /
    Math.max(
      totalTravellers,
      1
    );



  /* UPDATE UI */

  document.getElementById(
    "summaryTravellers"
  ).textContent =
    totalTravellers + " pax";


  document.getElementById(
    "summaryVisa"
  ).textContent =
    rupiah(visaTotal);


  document.getElementById(
    "summaryHotel"
  ).textContent =
    rupiah(hotelTotal);


  document.getElementById(
    "summaryTransport"
  ).textContent =
    rupiah(transportTotal);


  document.getElementById(
    "summaryAddon"
  ).textContent =
    rupiah(addonTotal);


  document.getElementById(
    "grandTotal"
  ).textContent =
    rupiah(grandTotal);


  document.getElementById(
    "pricePerPerson"
  ).textContent =
    rupiah(perPerson);


  return {

    adult,
    child,
    infant,

    totalTravellers,

    visaPrice,
    visaTotal,

    visaLabel:
      getCheckedLabel("visa"),

    makkahNights,
    madinahNights,

    hotelCategory:
      getCheckedLabel(
        "hotelCategory"
      ),

    hotelTotal,

    transportLabel:
      transportElement
        .options[
          transportElement.selectedIndex
        ]
        .text,

    transportTotal,

    addonTotal,

    grandTotal,

    perPerson,

    mutawwif:
      mutawwif.checked,

    handling:
      handling.checked,

    haramain:
      haramain.checked,

    ziarah:
      ziarah.checked

  };

}



/* ======================================================
   SEND ESTIMATE WHATSAPP
====================================================== */

function sendEstimateToWhatsApp() {

  const data =
    calculateEstimate();


  const addons = [];


  if (data.mutawwif) {
    addons.push(
      "Mutawwif / Guide"
    );
  }


  if (data.handling) {
    addons.push(
      "Handling Jamaah"
    );
  }


  if (data.haramain) {
    addons.push(
      "Kereta Haramain"
    );
  }


  if (data.ziarah) {
    addons.push(
      "Ziarah"
    );
  }


  const addonText =
    addons.length
      ? addons.join(", ")
      : "Tidak ada";


  const message =

`Assalamu'alaikum Safeera,

Saya ingin konsultasi mengenai estimasi perjalanan berikut:

*ESTIMASI SAFEERA*

Jamaah:
• Dewasa: ${data.adult}
• Anak: ${data.child}
• Bayi: ${data.infant}

Visa:
• ${data.visaLabel}

Hotel:
• Makkah: ${data.makkahNights} malam
• Madinah: ${data.madinahNights} malam
• Kategori: ${data.hotelCategory}

Transportasi:
• ${data.transportLabel}

Add-on:
• ${addonText}

*Total estimasi: ${rupiah(data.grandTotal)}*

Mohon dibantu cek harga dan ketersediaan aktual. Terima kasih.`;


  const url =
    `https://wa.me/${safeeraWhatsApp}?text=${encodeURIComponent(message)}`;


  window.open(
    url,
    "_blank"
  );

}



/* ======================================================
   AUTO CALCULATE
====================================================== */

document
  .querySelectorAll(
    '#kalkulator input, #kalkulator select'
  )
  .forEach(element => {

    element.addEventListener(
      "change",
      calculateEstimate
    );

  });



/* ======================================================
   MOBILE MENU
====================================================== */

const menuButton =
  document.getElementById(
    "menuButton"
  );


const navLinks =
  document.getElementById(
    "navLinks"
  );


menuButton.addEventListener(
  "click",
  () => {

    navLinks.classList.toggle(
      "active"
    );


    document.body.classList.toggle(
      "menu-open"
    );


    const icon =
      menuButton.querySelector("i");


    if (
      navLinks.classList.contains(
        "active"
      )
    ) {

      icon.className =
        "fa-solid fa-xmark";

    } else {

      icon.className =
        "fa-solid fa-bars";

    }

  }
);



/* CLOSE MENU */

document
  .querySelectorAll(
    ".nav-links > a"
  )
  .forEach(link => {

    link.addEventListener(
      "click",
      closeMobileMenu
    );

  });


function closeMobileMenu() {

  navLinks.classList.remove(
    "active"
  );


  document.body.classList.remove(
    "menu-open"
  );


  menuButton.querySelector(
    "i"
  ).className =
    "fa-solid fa-bars";

}



/* ======================================================
   MOBILE DROPDOWN
====================================================== */

const dropdownTrigger =
  document.querySelector(
    ".dropdown-trigger"
  );


const navDropdown =
  document.querySelector(
    ".nav-dropdown"
  );


dropdownTrigger.addEventListener(
  "click",
  () => {

    if (
      window.innerWidth <= 1050
    ) {

      navDropdown.classList.toggle(
        "open"
      );

    }

  }
);



/* ======================================================
   FAQ
====================================================== */

document
  .querySelectorAll(
    ".faq-question"
  )
  .forEach(question => {

    question.addEventListener(
      "click",
      () => {

        const item =
          question.parentElement;


        document
          .querySelectorAll(
            ".faq-item"
          )
          .forEach(other => {

            if (other !== item) {

              other.classList.remove(
                "active"
              );

            }

          });


        item.classList.toggle(
          "active"
        );

      }
    );

  });



/* ======================================================
   HOTEL FILTER
====================================================== */

const filterTabs =
  document.querySelectorAll(
    ".filter-tab"
  );


const hotelCards =
  document.querySelectorAll(
    ".hotel-card"
  );


filterTabs.forEach(tab => {

  tab.addEventListener(
    "click",
    () => {

      filterTabs.forEach(
        item =>
          item.classList.remove(
            "active"
          )
      );


      tab.classList.add(
        "active"
      );


      const city =
        tab.dataset.city;


      hotelCards.forEach(
        card => {

          if (
            city === "all" ||
            card.dataset.city === city
          ) {

            card.classList.remove(
              "hidden"
            );

          } else {

            card.classList.add(
              "hidden"
            );

          }

        }
      );

    }
  );

});



/* ======================================================
   NAVBAR + BACK TOP
====================================================== */

const navbar =
  document.getElementById(
    "navbar"
  );


const backTop =
  document.getElementById(
    "backTop"
  );


window.addEventListener(
  "scroll",
  () => {

    if (window.scrollY > 30) {

      navbar.classList.add(
        "scrolled"
      );

    } else {

      navbar.classList.remove(
        "scrolled"
      );

    }


    if (window.scrollY > 700) {

      backTop.classList.add(
        "show"
      );

    } else {

      backTop.classList.remove(
        "show"
      );

    }

  }
);


backTop.addEventListener(
  "click",
  () => {

    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  }
);



/* ======================================================
   INITIALIZE
====================================================== */

calculateEstimate();
