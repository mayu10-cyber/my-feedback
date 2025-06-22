// server js
   const faders = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelector('.card-front').classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    faders.forEach(el => observer.observe(el));

     // about us
    const carouselData = [
    {
      img: 'tejas3.jpg',
      quote: '"Every problem is a gift, without problems we would not grow."',
      author: '– Anthony Robbins'
    },
    {
      img: 'tejas5.jpg',
      quote: '"I don\'t know the word \'quit.\' Either I never did, or I have abolished it."',
      author: '– Susan Butcher'
    },
    {
      img: 'tejas4.jpg',
      quote: '"If you want to shine like a sun, first burn like a sun."',
      author: '– APJ Abdul Kalam'
    }
  ];

  let currentSlide = 0;
  const imgEl = document.getElementById('carousel-img');
  const quoteEl = document.getElementById('quote');
  const authorEl = document.getElementById('author');

  function updateSlide(index) {
    imgEl.style.opacity = 0;
    quoteEl.style.opacity = 0;
    authorEl.style.opacity = 0;
    setTimeout(() => {
      imgEl.src = carouselData[index].img;
      quoteEl.textContent = carouselData[index].quote;
      authorEl.textContent = carouselData[index].author;
      imgEl.style.opacity = 1;
      quoteEl.style.opacity = 1;
      authorEl.style.opacity = 1;
    }, 300);
  }

  document.getElementById('prev').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + carouselData.length) % carouselData.length;
    updateSlide(currentSlide);
  });

  document.getElementById('next').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % carouselData.length;
    updateSlide(currentSlide);
  });

  // Popup functions
  function showHistoryPopup() {
    document.querySelector('.popup-overlay').style.display = 'none';
    document.getElementById('history-popup').style.display = 'flex';
  }

  function hideHistoryPopup() {
    document.getElementById('history-popup').style.display = 'none';
  }
  
  function showMissionPopup() {
    document.querySelector('.popup-overlay').style.display = 'none';
    document.getElementById('mission-popup').style.display = 'flex';
  }

  function hideMissionPopup() {
    document.getElementById('mission-popup').style.display = 'none';
  }
  
  function showWhyChoosePopup() {
    document.querySelector('.popup-overlay').style.display = 'none';
    document.getElementById('why-choose-popup').style.display = 'flex';
  }

  function hideWhyChoosePopup() {
    document.getElementById('why-choose-popup').style.display = 'none';
  }
  
  function backToMainPopup() {
    document.querySelector('.popup-overlay').style.display = 'flex';
    document.getElementById('history-popup').style.display = 'none';
    document.getElementById('mission-popup').style.display = 'none';
    document.getElementById('why-choose-popup').style.display = 'none';
  }

    //  live stats
    function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const step = target / 200;

    const updateCounter = () => {
      if (count < target) {
        count += step;
        counter.innerText = Math.ceil(count);
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target;
      }
    };

    updateCounter();
  });
}

// Listen for mouseenter on stats section
const statsSection = document.querySelector('.stats-section');
statsSection.addEventListener('mouseenter', () => {
  // Reset numbers to 0 before animating again
  document.querySelectorAll('.stat-number').forEach(counter => {
    counter.innerText = '0';
  });
  animateCounters();
});

document.addEventListener('mouseover', function(event) {
  // Only read if the element has text and is not a script/style/etc.
  if (event.target && event.target.textContent.trim().length > 0) {
    speakText(event.target.textContent.trim());
  }
});

    /* feedback */
const feedbackPopupOverlay = document.getElementById("feedbackPopupOverlay");
const form = document.getElementById("feedbackForm");
const showFormBtn = document.getElementById("showFormBtn");
const closePopup = document.getElementById("closePopup");
const slide = document.getElementById("r-slide");
const upArrow = document.getElementById("upArrow");
const downArrow = document.getElementById("downArrow");
const googlePromptOverlay = document.getElementById("googlePromptOverlay");
const googleYes = document.getElementById("googleYes");
const googleNo = document.getElementById("googleNo");

let feedbacks = [];
let currentIndex = 0;

showFormBtn.addEventListener("click", () => {
  feedbackPopupOverlay.style.display = "flex";
});

closePopup.addEventListener("click", () => {
  feedbackPopupOverlay.style.display = "none";
});

feedbackPopupOverlay.addEventListener("click", (e) => {
  if (e.target === feedbackPopupOverlay) {
    feedbackPopupOverlay.style.display = "none";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  const data = {
    name: document.getElementById("userName").value.trim(),
    department: document.getElementById("userDept").value.trim(),
    rating: parseFloat(document.getElementById("userRating").value),
    feedback: document.getElementById("userFeedback").value.trim()
  };

  if (!data.name || !data.department || isNaN(data.rating) || !data.feedback) {
    alert("Please fill all fields correctly");
    return false;
  }

  try {
    const res = await fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Submission failed");

    await loadFeedbacks();
    form.reset();
    feedbackPopupOverlay.style.display = "none";
    showCard(0);
    
    googlePromptOverlay.style.display = 'flex';
    console.log("Modal is now visible");

    document.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        googlePromptOverlay.style.display = 'none';
        console.log("Modal hidden on button click");
      });
    });

  } catch (err) {
    alert("Error: " + err.message);
  }
  return false;
});

async function loadFeedbacks() {
  try {
    const res = await fetch("http://localhost:5000/api/feedback");
    const list = await res.json();
    list.sort((a, b) => b.rating - a.rating);
    feedbacks = list;
    renderFeedbacks();
  } catch (err) {
    slide.innerHTML = '<div class="no-feedback">Failed to load feedback.</div>';
    console.error(err);
  }
}

function renderFeedbacks() {
  slide.innerHTML = "";
  if (feedbacks.length === 0) {
    slide.innerHTML = '<div class="no-feedback">No feedback available yet.</div>';
    document.querySelector(".nav-rectangle").style.display = "none";
    return;
  }
  feedbacks.forEach((fb) => {
    const card = document.createElement("div");
    card.className = "r-card";
    card.innerHTML = `
      <div class="review-info">
        <div>
          <h3 class="client-name">${fb.name}</h3>
          <p class="client-service">${fb.department}</p>
        </div>
        <div class="review-rating">
          ${"★".repeat(Math.floor(fb.rating))}${"☆".repeat(5 - Math.floor(fb.rating))} ${fb.rating.toFixed(1)}
        </div>
      </div>
      <p class="review-text">${fb.feedback}</p>
    `;
    card.style.display = "none";
    slide.appendChild(card);
  });
  showCard(0);
  document.querySelector(".nav-rectangle").style.display = "flex";
}

function showCard(index) {
  if (!feedbacks.length) return;
  const cards = document.querySelectorAll(".r-card");
  index = Math.max(0, Math.min(index, cards.length - 1));
  currentIndex = index;
  cards.forEach((card, i) => {
    card.style.display = i === index ? "block" : "none";
  });
  upArrow.style.opacity = index === 0 ? "0.5" : "1";
  downArrow.style.opacity = index === cards.length - 1 ? "0.5" : "1";
}

upArrow.addEventListener("click", () => showCard(currentIndex - 1));
downArrow.addEventListener("click", () => showCard(currentIndex + 1));

document.getElementById("googlePromptModal").addEventListener("click", (e) => {
  e.stopPropagation();
});

googlePromptOverlay.addEventListener("click", (e) => {
  if (e.target === googlePromptOverlay) {
    // Uncomment the line below if you want to allow closing by clicking outside
    // googlePromptOverlay.style.display = 'none';
  }
});

googleYes.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  googlePromptOverlay.style.display = 'none';
  window.open("https://search.google.com/local/writereview?placeid=ChIJyzcm87TP5zsRmFrZyXDEP7s", "_blank");
});

googleNo.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  googlePromptOverlay.style.display = 'none';
});

window.addEventListener("beforeunload", (e) => {
  if (googlePromptOverlay.style.display === 'flex') {
    e.preventDefault();
    e.returnValue = '';
  }
});

// Initial load
loadFeedbacks();

