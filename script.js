const app = document.getElementById("app");
const particleLayer = document.getElementById("particles");

let page = 1;
let chosen = false;

const SAD_MOMONGA = "assets/sad-momonga.png";
const HAPPY_MOMONGA = "assets/happy-momonga.png";
const BUTTON_IMAGE = "assets/go-button.png";

const BOUQUET_IMAGE = "assets/blue-bouquet.png";
const FLOWER_IMAGE = "assets/flower.png";


// =========================================================
// INTRO LOADING
// =========================================================

const introScreen = document.getElementById("introScreen");
const loadingBar = document.getElementById("loadingBar");
const loadingText = document.getElementById("loadingText");
const introNext = document.getElementById("introNext");

let introFinished = false;
let introStartTime = performance.now();

const INTRO_DURATION = 5000;


// =========================================================
// INTRO LOADING ANIMATION
// =========================================================

function updateIntroLoading(now) {

  if (!introScreen) return;

  const elapsed = now - introStartTime;

  const progress = Math.min(
    elapsed / INTRO_DURATION,
    1
  );

  const percent = Math.floor(progress * 100);


  if (loadingBar) {
    loadingBar.style.width = percent + "%";
  }


  if (loadingText) {

    if (percent < 100) {

      loadingText.textContent =
        `กำลังเตรียมของพิเศษ... ${percent}%`;

    } else {

      loadingText.textContent =
        "เตรียมเสร็จแล้วว 💙";

    }
  }


  // =======================================================
  // โหลดครบ 100%
  // =======================================================

  if (progress >= 1) {

    if (!introFinished) {

      introFinished = true;


      // แสดงปุ่มโมมงกะของ Intro
      if (introNext) {
        introNext.classList.add("show");
      }


      // เริ่มประกายรอบปุ่ม
      const sparkleWrap =
        document.querySelector(".intro-button-wrap");

      if (sparkleWrap) {

        setTimeout(() => {

          sparkleWrap.classList.add(
            "sparkle-active"
          );

        }, 350);

      }

    }

    return;
  }


  requestAnimationFrame(
    updateIntroLoading
  );
}


// เริ่มโหลด Intro
if (introScreen) {

  requestAnimationFrame(
    updateIntroLoading
  );

}


// =========================================================
// INTRO BUTTON
// =========================================================

if (introNext) {

  introNext.addEventListener(
    "click",
    function () {

      // กันกดซ้ำ
      if (introNext.dataset.clicked === "true") {
        return;
      }

      introNext.dataset.clicked = "true";


      playClickSound();
      playSparkleSound();


      // หยุดประกาย
      const sparkleWrap =
        document.querySelector(".intro-button-wrap");

      if (sparkleWrap) {
        sparkleWrap.classList.remove(
          "sparkle-active"
        );
      }


      // ซ่อน Intro
      introScreen.classList.add("hide");


      // รอ animation จางออก
      setTimeout(() => {

        introScreen.style.display = "none";


        // =================================================
        // เริ่มหน้าเว็บจริงที่ Page 1
        // =================================================

        page = 1;
        chosen = false;


        // ล้างของเก่าใน app ก่อน
        app.innerHTML = "";


        // Render Page 1 ใหม่
        render();


        // =================================================
        // บังคับให้ปุ่ม Page 1 แสดงและกดได้
        // =================================================

        const startBtn =
          document.getElementById("startBtn");

        if (startBtn) {

          startBtn.style.display = "block";
          startBtn.style.visibility = "visible";
          startBtn.style.opacity = "1";
          startBtn.style.pointerEvents = "auto";

        }

      }, 750);

    }
  );

}


// =========================================================
// SOUND
// =========================================================

let audioCtx = null;


function getAudioContext() {

  if (!audioCtx) {

    audioCtx =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

  }


  if (
    audioCtx.state === "suspended"
  ) {

    audioCtx.resume();

  }


  return audioCtx;
}


function playClickSound() {

  const ctx =
    getAudioContext();


  const osc =
    ctx.createOscillator();

  const gain =
    ctx.createGain();


  osc.type = "sine";


  osc.frequency.setValueAtTime(
    520,
    ctx.currentTime
  );


  osc.frequency.exponentialRampToValueAtTime(
    760,
    ctx.currentTime + 0.08
  );


  gain.gain.setValueAtTime(
    0.0001,
    ctx.currentTime
  );


  gain.gain.exponentialRampToValueAtTime(
    0.15,
    ctx.currentTime + 0.01
  );


  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    ctx.currentTime + 0.18
  );


  osc.connect(gain);
  gain.connect(ctx.destination);


  osc.start();

  osc.stop(
    ctx.currentTime + 0.18
  );
}


function playSparkleSound() {

  const ctx =
    getAudioContext();


  [0, 0.08, 0.16, 0.24]
    .forEach(
      (delay, index) => {

        const osc =
          ctx.createOscillator();

        const gain =
          ctx.createGain();


        osc.type = "sine";


        osc.frequency.value =
          700 + index * 180;


        gain.gain.setValueAtTime(
          0.0001,
          ctx.currentTime + delay
        );


        gain.gain.exponentialRampToValueAtTime(
          0.09,
          ctx.currentTime +
          delay +
          0.01
        );


        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime +
          delay +
          0.35
        );


        osc.connect(gain);
        gain.connect(ctx.destination);


        osc.start(
          ctx.currentTime + delay
        );


        osc.stop(
          ctx.currentTime +
          delay +
          0.35
        );

      }
    );
}


// =========================================================
// PARTICLES
// =========================================================

function particles(
  x,
  y,
  amount = 70
) {

  for (
    let i = 0;
    i < amount;
    i++
  ) {

    const p =
      document.createElement("span");


    p.className =
      "particle";


    const angle =
      Math.random() *
      Math.PI * 2;


    const distance =
      80 +
      Math.random() * 280;


    p.style.left =
      x + "px";


    p.style.top =
      y + "px";


    p.style.setProperty(
      "--x",
      Math.cos(angle) *
      distance +
      "px"
    );


    p.style.setProperty(
      "--y",
      Math.sin(angle) *
      distance +
      "px"
    );


    p.style.width =
      p.style.height =
      4 +
      Math.random() * 7 +
      "px";


    if (
      Math.random() > 0.45
    ) {

      p.style.background =
        "#bcefff";

    }


    particleLayer.appendChild(p);


    setTimeout(
      () => p.remove(),
      900
    );

  }
}


// =========================================================
// NEXT BUTTON
// =========================================================

function makeNextButton() {

  // กันสร้างปุ่มซ้ำ
  removeNextButton();


  const btn =
    document.createElement("button");


  btn.className =
    "next";


  btn.id =
    "nextBtn";


  btn.textContent =
    "ไปต่อ";


  btn.addEventListener(
    "click",
    goNext
  );


  document.body.appendChild(btn);
}


function removeNextButton() {

  const old =
    document.getElementById(
      "nextBtn"
    );


  if (old) {
    old.remove();
  }
}


function goNext() {

  const btn =
    document.getElementById(
      "nextBtn"
    );


  if (!btn) return;


  playClickSound();


  const r =
    btn.getBoundingClientRect();


  particles(
    r.left + r.width / 2,
    r.top + r.height / 2,
    55
  );


  btn.classList.add(
    "fade-away"
  );


  setTimeout(() => {

    removeNextButton();

    page++;

    chosen = false;

    render();

  }, 650);
}


// =========================================================
// RENDER
// =========================================================

function render() {

  removeNextButton();


  if (page === 1) {

    page1();

  }

  else if (page === 2) {

    choicePage(
      "ไม่ได้คุยกันนานเลย<br>คิดถึงเรามั้ย",
      "ไม่คิดถึง",
      "คิดถึงง"
    );

  }

  else if (page === 3) {

    choicePage(
      "จะมีใครอยากคุยกับเรามั้ยน้าา",
      "ไม่อยาก",
      "อยากมากก"
    );

  }

  else if (page === 4) {

    page4();

  }

  else if (page === 5) {

    page5();

  }
}


// =========================================================
// PAGE 1
// =========================================================

function page1() {

  app.innerHTML = `

    <section class="card">

      <h1 class="title">
        หวัดดีข้าวบูด
      </h1>

      <p class="message">
        เป็นยังงายบ้าง สบายดีมั้ย<br>
        มีอารายมาถามแหละ
      </p>

      <div class="button-area">

        <img
          class="go-image"
          id="startBtn"
          src="${BUTTON_IMAGE}"
          alt="ไปต่อ"
        >

      </div>

    </section>

  `;


  const startBtn =
    document.getElementById("startBtn");


  if (!startBtn) return;


  // บังคับสถานะเริ่มต้น
  startBtn.style.display = "block";
  startBtn.style.visibility = "visible";
  startBtn.style.opacity = "1";
  startBtn.style.pointerEvents = "auto";


  startBtn.addEventListener(
    "click",
    function () {

      playClickSound();

      playSparkleSound();


      const r =
        this.getBoundingClientRect();


      particles(
        r.left +
        r.width / 2,

        r.top +
        r.height / 2
      );


      this.classList.add(
        "fade-away"
      );


      setTimeout(() => {

        page = 2;

        chosen = false;

        render();

      }, 700);

    }
  );
}


// =========================================================
// CHOICE PAGES
// =========================================================

function choicePage(
  text,
  left,
  right
) {

  app.innerHTML = `

    <section class="card">

      <p class="message">
        ${text}
      </p>

      <div
        class="button-area"
        id="choices"
      >

        <button
          class="choice"
          data-answer="sad"
        >
          ${left}
        </button>

        <button
          class="choice"
          data-answer="happy"
        >
          ${right}
        </button>

      </div>

      <div
        class="mascot-slot"
        id="mascotSlot"
      >

        <img
          id="mascotImage"
          alt="โมมงกะ"
        >

      </div>

    </section>

  `;


  document
    .querySelectorAll(".choice")
    .forEach(
      btn => {

        btn.addEventListener(
          "click",
          () =>
            selectChoice(btn)
        );

      }
    );
}


// =========================================================
// SELECT CHOICE
// =========================================================

function selectChoice(
  selected
) {

  if (chosen) return;

  chosen = true;


  playClickSound();


  const answer =
    selected.dataset.answer;


  const other =
    [
      ...document.querySelectorAll(
        ".choice"
      )
    ]
      .find(
        btn =>
          btn !== selected
      );


  selected.classList.add(
    "selected"
  );


  if (other) {

    other.classList.add(
      "hide"
    );

  }


  const image =
    document.getElementById(
      "mascotImage"
    );


  image.src =
    answer === "sad"
      ? SAD_MOMONGA
      : HAPPY_MOMONGA;


  document
    .getElementById(
      "mascotSlot"
    )
    .classList.add(
      "show"
    );


  setTimeout(
    makeNextButton,
    250
  );
}


// =========================================================
// PAGE 4
// =========================================================

function page4() {

  app.innerHTML = `

    <section class="card">

      <p class="typing message">

        <span id="typingText"></span>

        <span class="caret"></span>

      </p>

      <div id="acceptArea"></div>

    </section>

  `;


  const text =
    "เราไม่รู้น่ะว่าข้าวบูดมีอารายที่เหนื่อยหรือทำให้คิดมากเก็บไว้คนเดียวมั้ย แต่เรามีอาไรจะให้";


  const target =
    document.getElementById(
      "typingText"
    );


  let i = 0;


  const timer =
    setInterval(
      () => {

        target.textContent =
          text.slice(0, i);


        i++;


        if (
          i > text.length
        ) {

          clearInterval(timer);


          document
            .querySelector(
              ".caret"
            )
            .style.display =
            "none";


          document
            .getElementById(
              "acceptArea"
            )
            .innerHTML = `

              <div class="button-area">

                <button
                  class="choice"
                  id="acceptBtn"
                >
                  🌷 กดรับ 🌷
                </button>

              </div>

            `;


          document
            .getElementById(
              "acceptBtn"
            )
            .addEventListener(
              "click",
              () => {

                playClickSound();

                page = 5;

                render();

              }
            );

        }

      },
      45
    );
}


// =========================================================
// PAGE 5
// =========================================================

function page5() {

  app.innerHTML = `

    <section class="card final-card">

      <p class="message final-title">
        มีอะไรเล็ก ๆ น้อย ๆ มาให้ข้าวบูดด้วยนะ 🌷
      </p>


      <div class="envelope-area">

        <div
          class="envelope"
          id="envelope"
        >

          <div class="env-body"></div>

          <div class="env-flap"></div>

          <div class="seal">
            🌷
          </div>


          <div class="flower-burst">

            <img
              class="burst-flower flower1"
              src="${FLOWER_IMAGE}"
              alt=""
            >

            <img
              class="burst-flower flower2"
              src="${FLOWER_IMAGE}"
              alt=""
            >

            <img
              class="burst-flower flower3"
              src="${FLOWER_IMAGE}"
              alt=""
            >

            <img
              class="burst-flower flower4"
              src="${FLOWER_IMAGE}"
              alt=""
            >

            <img
              class="burst-flower flower5"
              src="${FLOWER_IMAGE}"
              alt=""
            >

            <img
              class="burst-flower flower6"
              src="${FLOWER_IMAGE}"
              alt=""
            >

            <img
              class="burst-flower flower7"
              src="${FLOWER_IMAGE}"
              alt=""
            >

            <img
              class="burst-flower flower8"
              src="${FLOWER_IMAGE}"
              alt=""
            >

            <img
              class="burst-flower flower9"
              src="${FLOWER_IMAGE}"
              alt=""
            >

          </div>


          <div class="sparkle-burst">

            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
            <span>✧</span>

          </div>

        </div>


        <div
          class="gift-result"
          id="giftResult"
        >

          <div class="final-glow"></div>


          <div class="bouquet">

            <img
              src="${BOUQUET_IMAGE}"
              alt="ช่อดอกไม้สีฟ้า"
            >

          </div>


          <div class="final-text">

            ดอกไม้นี้ให้ข้าวบูดนะ 🌷<br>

            ถ้าข้าวบูดมีอารายให้เหนื่อย ให้คิดมาก<br>

            ก็อยากให้ดอกไม้นี้เป็นกำลังใจเล็ก ๆ
            ให้ในวันที่ไม่ดีน่ะ 🌷

          </div>


          <div class="ending-sparkles">
            ✦　✧　✦　✧　✦
          </div>

        </div>


        <div class="subtle">
          กดที่ซองดูสิ 👀
        </div>

      </div>

    </section>

  `;


  const envelope =
    document.getElementById(
      "envelope"
    );


  if (!envelope) return;


  envelope.addEventListener(
    "click",
    openEnvelope
  );
}


// =========================================================
// OPEN ENVELOPE
// =========================================================

let envelopeOpened = false;


function openEnvelope() {

  // กันกดซองซ้ำ
  if (envelopeOpened) return;

  envelopeOpened = true;


  playClickSound();


  const envelope =
    document.querySelector(
      ".envelope"
    );


  const burst =
    document.querySelector(
      ".flower-burst"
    );


  const result =
    document.querySelector(
      ".gift-result"
    );


  if (
    !envelope ||
    !result
  ) {

    envelopeOpened = false;
    return;

  }


  // เปิดซอง
  envelope.classList.add(
    "open"
  );


  // ดอกไม้กระจาย
  if (burst) {

    burst.classList.add(
      "active"
    );

  }


  // รอให้ซองเปิดก่อน
  setTimeout(() => {

    envelope.classList.add(
      "behind"
    );


    result.classList.add(
      "show"
    );

  }, 900);


  // หยุดเอฟเฟกต์ดอกไม้
  setTimeout(() => {

    if (burst) {

      burst.classList.remove(
        "active"
      );

    }

  }, 2200);
}


// =========================================================
// START WEBSITE
// =========================================================

// ถ้าไม่มี Intro ให้เปิด Page 1 ทันที
if (!introScreen) {

  render();

}