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

/* =========================================================
   SAFEERA SMART CALCULATOR V2
   Paste at the END of script.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     PRICE CONFIG
     Semua nominal dalam RUPIAH
  ======================================================= */

  const SAFEERA_CALC_PRICES = {

    /* VISA — per pax */
    visa: {
      only: 2500000,
      siskopatuh: 2850000
    },

    /*
      HOTEL
      Harga dibaca langsung dari value <select> HTML.
      Contoh:
      <option value="765600">
    */

    /* MUTAWIF — PER GROUP / PER DAY */
    mutawwifPerDay: 1320000,

    /*
      TRANSPORT
      Ini sementara dibuat sebagai ESTIMASI.
      Ganti angka di bawah jika Safeera sudah punya
      price list transport final.
    */
    transport: {
      shared: {
        label: "Shared / Budget",
        type: "perPax",
        price: 0
      },

      private: {
        label: "Private Car",
        type: "group",
        price: 0
      },

      hiace: {
        label: "Hiace / Van",
        type: "group",
        price: 0
      },

      bus: {
        label: "Bus Group",
        type: "group",
        price: 0
      }
    },

    /*
      HANDLING
      Belum kita isi angka palsu.
      Nanti bisa disamakan dengan price list yang kamu mau.
    */
    handling: {
      arrival: {
        label: "Arrival Handling",
        type: "group",
        price: 0
      },

      hotel: {
        label: "Hotel Handling",
        type: "group",
        price: 0
      },

      departure: {
        label: "Departure Handling",
        type: "group",
        price: 0
      }
    },

    /*
      ZIARAH
      Juga disiapkan sebagai group cost.
    */
    ziarah: {
      makkah: {
        label: "Ziarah Makkah",
        type: "group",
        price: 0
      },

      madinah: {
        label: "Ziarah Madinah",
        type: "group",
        price: 0
      }
    }

  };


  /* =======================================================
     ELEMENTS
  ======================================================= */

  const calculator = document.querySelector("#calculator");

  if (!calculator) {
    return;
  }

  const modeButtons =
    calculator.querySelectorAll(".calc-mode");

  const serviceButtons =
    calculator.querySelectorAll(".calc-service");

  const roomButtons =
    calculator.querySelectorAll(".room-type");

  const paxMinus =
    calculator.querySelector("#paxMinus");

  const paxPlus =
    calculator.querySelector("#paxPlus");

  const paxDisplay =
    calculator.querySelector("#paxDisplay");

  const resultPax =
    calculator.querySelector("#resultPax");

  const resultMode =
    calculator.querySelector("#resultMode");

  const makkahHotel =
    calculator.querySelector("#makkahHotel");

  const madinahHotel =
    calculator.querySelector("#madinahHotel");

  const makkahNights =
    calculator.querySelector("#makkahNights");

  const madinahNights =
    calculator.querySelector("#madinahNights");

  const mutawwifDays =
    calculator.querySelector("#mutawwifDays");

  const transportSelect =
    calculator.querySelector("#calcTransport");

  const resultBreakdown =
    calculator.querySelector("#resultBreakdown");

  const grandTotalElement =
    calculator.querySelector("#grandTotal");

  const perPaxTotalElement =
    calculator.querySelector("#perPaxTotal");

  const whatsappButton =
    calculator.querySelector("#calculatorWhatsapp");

  const resetButton =
    calculator.querySelector("#calculatorReset");


  /* =======================================================
     STATE
  ======================================================= */

  let state = {

    mode: "mandiri",

    pax: 2,

    roomCapacity: 4,

    services: {
      visa: true,
      hotel: true,
      transport: true,
      mutawwif: false,
      handling: false,
      ziarah: false
    }

  };


  /* =======================================================
     FORMAT RUPIAH
  ======================================================= */

  function rupiah(number) {

    const value =
      Number.isFinite(Number(number))
        ? Number(number)
        : 0;

    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
      }
    ).format(value);

  }


  /* =======================================================
     ESCAPE HTML
  ======================================================= */

  function escapeHTML(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }


  /* =======================================================
     GET SELECTED VISA
  ======================================================= */

  function getVisaType() {

    const selected =
      calculator.querySelector(
        'input[name="visaType"]:checked'
      );

    return selected
      ? selected.value
      : "only";

  }


  /* =======================================================
     SERVICE PANEL
  ======================================================= */

  function updateServicePanels() {

    const mapping = {

      visa: "#optionVisa",

      hotel: "#optionHotel",

      transport: "#optionTransport",

      mutawwif: "#optionMutawwif",

      handling: "#optionHandling",

      ziarah: "#optionZiarah"

    };


    Object.entries(mapping).forEach(
      ([service, selector]) => {

        const panel =
          calculator.querySelector(selector);

        if (!panel) return;

        panel.classList.toggle(
          "active",
          state.services[service]
        );

      }
    );

  }


  /* =======================================================
     CREATE RESULT LINE
  ======================================================= */

  function resultLine(
    icon,
    title,
    description,
    price
  ) {

    return `
      <div class="result-line">

        <div class="result-line-left">

          <div class="result-line-icon">
            <i class="${escapeHTML(icon)}"></i>
          </div>

          <div class="result-line-text">

            <strong>
              ${escapeHTML(title)}
            </strong>

            <small>
              ${escapeHTML(description)}
            </small>

          </div>

        </div>

        <div class="result-line-price">
          ${rupiah(price)}
        </div>

      </div>
    `;

  }


  /* =======================================================
     CALCULATE
  ======================================================= */

  function calculate() {

    const pax =
      Math.max(1, Number(state.pax) || 1);

    let total = 0;

    let html = "";

    const whatsappLines = [];


    /* =====================================================
       VISA
    ===================================================== */

    if (state.services.visa) {

      const visaType =
        getVisaType();

      const visaPrice =
        SAFEERA_CALC_PRICES.visa[visaType] || 0;

      const visaTotal =
        visaPrice * pax;

      const visaLabel =
        visaType === "siskopatuh"
          ? "Visa + Siskopatuh"
          : "Visa Only";

      total += visaTotal;

      html += resultLine(
        "fa-solid fa-passport",
        visaLabel,
        `${pax} pax × ${rupiah(visaPrice)}`,
        visaTotal
      );

      whatsappLines.push(
        `• ${visaLabel}: ${rupiah(visaTotal)}`
      );

    }


    /* =====================================================
       HOTEL
    ===================================================== */

    if (state.services.hotel) {

      const capacity =
        Math.max(
          1,
          Number(state.roomCapacity) || 4
        );

      /*
        ceil:
        5 orang quad = 2 kamar.
      */

      const rooms =
        Math.ceil(pax / capacity);


      /* MAKKAH */

      const makkahPrice =
        Number(makkahHotel?.value) || 0;

      const makkahNightCount =
        Math.max(
          0,
          Number(makkahNights?.value) || 0
        );

      const makkahTotal =
        rooms *
        makkahNightCount *
        makkahPrice;

      if (makkahNightCount > 0) {

        total += makkahTotal;

        html += resultLine(
          "fa-solid fa-hotel",
          "Hotel Makkah",
          `${rooms} kamar × ${makkahNightCount} malam`,
          makkahTotal
        );

        whatsappLines.push(
          `• Hotel Makkah (${rooms} kamar × ${makkahNightCount} malam): ${rupiah(makkahTotal)}`
        );

      }


      /* MADINAH */

      const madinahPrice =
        Number(madinahHotel?.value) || 0;

      const madinahNightCount =
        Math.max(
          0,
          Number(madinahNights?.value) || 0
        );

      const madinahTotal =
        rooms *
        madinahNightCount *
        madinahPrice;

      if (madinahNightCount > 0) {

        total += madinahTotal;

        html += resultLine(
          "fa-solid fa-building",
          "Hotel Madinah",
          `${rooms} kamar × ${madinahNightCount} malam`,
          madinahTotal
        );

        whatsappLines.push(
          `• Hotel Madinah (${rooms} kamar × ${madinahNightCount} malam): ${rupiah(madinahTotal)}`
        );

      }

    }


    /* =====================================================
       TRANSPORT
    ===================================================== */

    if (
      state.services.transport &&
      transportSelect
    ) {

      const transportKey =
        transportSelect.value;

      const transport =
        SAFEERA_CALC_PRICES
          .transport[transportKey];

      if (transport) {

        let transportTotal = 0;

        if (transport.type === "perPax") {

          transportTotal =
            transport.price * pax;

        } else {

          transportTotal =
            transport.price;

        }


        total += transportTotal;


        const description =
          transport.price > 0
            ? (
                transport.type === "perPax"
                  ? `${pax} pax`
                  : "Biaya per group"
              )
            : "Harga dikonfirmasi admin";


        html += resultLine(
          "fa-solid fa-bus",
          transport.label,
          description,
          transportTotal
        );


        whatsappLines.push(
          transport.price > 0
            ? `• Transport ${transport.label}: ${rupiah(transportTotal)}`
            : `• Transport ${transport.label}: Minta harga`
        );

      }

    }


    /* =====================================================
       MUTAWIF
    ===================================================== */

    if (state.services.mutawwif) {

      const days =
        Math.max(
          1,
          Number(mutawwifDays?.value) || 1
        );

      const mutawwifTotal =
        SAFEERA_CALC_PRICES
          .mutawwifPerDay * days;

      const mutawwifPerPax =
        mutawwifTotal / pax;

      total += mutawwifTotal;


      html += resultLine(
        "fa-solid fa-user-group",
        "Mutawwif",
        `${days} hari • ${rupiah(mutawwifPerPax)}/pax`,
        mutawwifTotal
      );


      whatsappLines.push(
        `• Mutawwif ${days} hari: ${rupiah(mutawwifTotal)} (${rupiah(mutawwifPerPax)}/pax)`
      );

    }


    /* =====================================================
       HANDLING
    ===================================================== */

    if (state.services.handling) {

      const selectedHandling =
        calculator.querySelectorAll(
          ".handling-addon:checked"
        );


      selectedHandling.forEach(
        checkbox => {

          const item =
            SAFEERA_CALC_PRICES
              .handling[checkbox.value];

          if (!item) return;


          let itemTotal = 0;


          if (item.type === "perPax") {

            itemTotal =
              item.price * pax;

          } else {

            itemTotal =
              item.price;

          }


          total += itemTotal;


          html += resultLine(
            "fa-solid fa-suitcase-rolling",
            item.label,
            item.price > 0
              ? (
                  item.type === "perPax"
                    ? `${pax} pax`
                    : "Biaya per group"
                )
              : "Harga dikonfirmasi admin",
            itemTotal
          );


          whatsappLines.push(
            item.price > 0
              ? `• ${item.label}: ${rupiah(itemTotal)}`
              : `• ${item.label}: Minta harga`
          );

        }
      );

    }


    /* =====================================================
       ZIARAH
    ===================================================== */

    if (state.services.ziarah) {

      const selectedZiarah =
        calculator.querySelectorAll(
          ".ziarah-addon:checked"
        );


      selectedZiarah.forEach(
        checkbox => {

          const item =
            SAFEERA_CALC_PRICES
              .ziarah[checkbox.value];

          if (!item) return;


          let itemTotal = 0;


          if (item.type === "perPax") {

            itemTotal =
              item.price * pax;

          } else {

            itemTotal =
              item.price;

          }


          total += itemTotal;


          html += resultLine(
            "fa-solid fa-location-dot",
            item.label,
            item.price > 0
              ? "Biaya program"
              : "Harga dikonfirmasi admin",
            itemTotal
          );


          whatsappLines.push(
            item.price > 0
              ? `• ${item.label}: ${rupiah(itemTotal)}`
              : `• ${item.label}: Minta harga`
          );

        }
      );

    }


    /* =====================================================
       EMPTY
    ===================================================== */

    if (!html) {

      html = `
        <div
          style="
            padding:25px 10px;
            text-align:center;
            color:rgba(255,255,255,.45);
            font-size:10px;
            line-height:1.7;
          "
        >
          Pilih layanan untuk melihat
          estimasi biaya.
        </div>
      `;

    }


    /* =====================================================
       OUTPUT
    ===================================================== */

    resultBreakdown.innerHTML = html;

    grandTotalElement.textContent =
      rupiah(total);

    perPaxTotalElement.textContent =
      rupiah(total / pax);

    resultPax.textContent =
      pax;

    resultMode.textContent =
      state.mode === "group"
        ? "LA Group"
        : "Umrah Mandiri";


    /* SAVE FOR WHATSAPP */

    calculator.dataset.total =
      String(total);

    calculator.dataset.perPax =
      String(total / pax);

    calculator.dataset.whatsappLines =
      JSON.stringify(whatsappLines);

  }


  /* =======================================================
     MODE BUTTON
  ======================================================= */

  modeButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        modeButtons.forEach(
          item =>
            item.classList.remove("active")
        );

        button.classList.add("active");

        state.mode =
          button.dataset.mode || "mandiri";


        /*
          Group default minimum kita buat 10.
          Mandiri kembali ke 2 jika sebelumnya group.
        */

        if (
          state.mode === "group" &&
          state.pax < 10
        ) {

          state.pax = 10;

        }


        if (
          state.mode === "mandiri" &&
          state.pax > 9
        ) {

          state.pax = 2;

        }


        updatePax();

      }
    );

  });


  /* =======================================================
     PAX
  ======================================================= */

  function updatePax() {

    if (state.mode === "mandiri") {

      state.pax =
        Math.min(
          9,
          Math.max(1, state.pax)
        );

    } else {

      state.pax =
        Math.min(
          100,
          Math.max(10, state.pax)
        );

    }


    paxDisplay.textContent =
      state.pax;

    resultPax.textContent =
      state.pax;

    calculate();

  }


  paxMinus?.addEventListener(
    "click",
    () => {

      state.pax -= 1;

      updatePax();

    }
  );


  paxPlus?.addEventListener(
    "click",
    () => {

      state.pax += 1;

      updatePax();

    }
  );


  /* =======================================================
     SERVICE BUTTONS
  ======================================================= */

  serviceButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const service =
          button.dataset.calcService;

        if (!service) return;


        state.services[service] =
          !state.services[service];


        button.classList.toggle(
          "active",
          state.services[service]
        );


        updateServicePanels();

        calculate();

      }
    );

  });


  /* =======================================================
     ROOM TYPE
  ======================================================= */

  roomButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        roomButtons.forEach(
          item =>
            item.classList.remove("active")
        );

        button.classList.add("active");

        state.roomCapacity =
          Number(button.dataset.capacity) || 4;

        calculate();

      }
    );

  });


  /* =======================================================
     MINI COUNTERS
  ======================================================= */

  calculator
    .querySelectorAll("[data-counter-minus]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const input =
            calculator.querySelector(
              "#" +
              button.dataset.counterMinus
            );

          if (!input) return;


          const min =
            Number(input.min || 0);

          const current =
            Number(input.value || 0);

          input.value =
            Math.max(
              min,
              current - 1
            );

          calculate();

        }
      );

    });


  calculator
    .querySelectorAll("[data-counter-plus]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const input =
            calculator.querySelector(
              "#" +
              button.dataset.counterPlus
            );

          if (!input) return;


          const max =
            Number(input.max || 999);

          const current =
            Number(input.value || 0);

          input.value =
            Math.min(
              max,
              current + 1
            );

          calculate();

        }
      );

    });


  /* =======================================================
     ALL INPUT CHANGES
  ======================================================= */

  calculator
    .querySelectorAll(
      "select, input"
    )
    .forEach(input => {

      input.addEventListener(
        "change",
        calculate
      );

      input.addEventListener(
        "input",
        calculate
      );

    });


  /* =======================================================
     RESET
  ======================================================= */

  resetButton?.addEventListener(
    "click",
    () => {

      state = {

        mode: "mandiri",

        pax: 2,

        roomCapacity: 4,

        services: {
          visa: true,
          hotel: true,
          transport: true,
          mutawwif: false,
          handling: false,
          ziarah: false
        }

      };


      /* MODE */

      modeButtons.forEach(button => {

        button.classList.toggle(
          "active",
          button.dataset.mode === "mandiri"
        );

      });


      /* SERVICE */

      serviceButtons.forEach(button => {

        const service =
          button.dataset.calcService;

        button.classList.toggle(
          "active",
          Boolean(
            state.services[service]
          )
        );

      });


      /* ROOM */

      roomButtons.forEach(button => {

        button.classList.toggle(
          "active",
          Number(button.dataset.capacity) === 4
        );

      });


      /* VALUES */

      const visaOnly =
        calculator.querySelector(
          'input[name="visaType"][value="only"]'
        );

      if (visaOnly) {
        visaOnly.checked = true;
      }


      if (makkahNights) {
        makkahNights.value = 5;
      }

      if (madinahNights) {
        madinahNights.value = 4;
      }

      if (mutawwifDays) {
        mutawwifDays.value = 1;
      }

      if (transportSelect) {
        transportSelect.value = "shared";
      }


      updateServicePanels();

      updatePax();


      calculator.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }
  );


  /* =======================================================
     WHATSAPP QUOTATION
  ======================================================= */

  whatsappButton?.addEventListener(
    "click",
    () => {

      let lines = [];

      try {

        lines =
          JSON.parse(
            calculator.dataset.whatsappLines || "[]"
          );

      } catch (error) {

        lines = [];

      }


      const total =
        Number(
          calculator.dataset.total || 0
        );

      const perPax =
        Number(
          calculator.dataset.perPax || 0
        );


      const message = [
        "Assalamu'alaikum Safeera,",
        "",
        "Saya ingin meminta penawaran perjalanan Umrah.",
        "",
        `Tipe: ${
          state.mode === "group"
            ? "LA Group"
            : "Umrah Mandiri"
        }`,
        `Jumlah Jamaah: ${state.pax} pax`,
        "",
        "Rincian:",
        ...lines,
        "",
        `TOTAL ESTIMASI: ${rupiah(total)}`,
        `ESTIMASI / PAX: ${rupiah(perPax)}`,
        "",
        "Mohon dibantu cek harga final dan ketersediaannya.",
        "Terima kasih."
      ].join("\n");


      /*
        NOMOR WHATSAPP

        Kalau script.js utama kamu sudah punya:
        const SAFEERA_WHATSAPP = "nomor";

        modul ini akan mencoba menggunakannya.

        Jika belum ada nomor, WhatsApp tetap terbuka
        ke halaman kirim pesan tanpa nomor tertentu.
      */

      let whatsappNumber = "";

      try {

        if (
          typeof SAFEERA_WHATSAPP !== "undefined"
        ) {

          whatsappNumber =
            String(SAFEERA_WHATSAPP)
              .replace(/\D/g, "");

        }

      } catch (error) {

        whatsappNumber = "";

      }


      const encoded =
        encodeURIComponent(message);


      const url =
        whatsappNumber
          ? `https://wa.me/${whatsappNumber}?text=${encoded}`
          : `https://wa.me/?text=${encoded}`;


      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

    }
  );


  /* =======================================================
     INITIALIZE
  ======================================================= */

  updateServicePanels();

  updatePax();

});




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
