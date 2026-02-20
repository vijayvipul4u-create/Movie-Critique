const newsData = [
  {
    region: "North America",
    headline: "Indie sci-fi titles outperform projections at weekend box office.",
    source: "CineWire",
  },
  {
    region: "South Korea",
    headline: "New K-drama adaptations dominate streaming charts worldwide.",
    source: "Seoul Screen Daily",
  },
  {
    region: "China",
    headline: "C-drama period epics secure record international distribution deals.",
    source: "Dragon Reel News",
  },
  {
    region: "Türkiye",
    headline: "Turkish drama exports continue expansion into European markets.",
    source: "Anatolia Arts",
  },
  {
    region: "Pakistan",
    headline: "Pakistani serial creators collaborate with global OTT platforms.",
    source: "Lahore Lens",
  },
  {
    region: "Europe",
    headline: "Film festivals spotlight multilingual co-productions and social dramas.",
    source: "EuroCinema Post",
  },
];

const criticData = [
  {
    title: "Dune: Part Two",
    type: "Movie",
    criticScore: 94,
    audienceScore: 90,
    tags: ["Sci-Fi", "Adventure", "English"],
  },
  {
    title: "Queen of Tears",
    type: "K-Drama",
    criticScore: 92,
    audienceScore: 95,
    tags: ["Romance", "Emotional", "Korean"],
  },
  {
    title: "The Double",
    type: "C-Drama",
    criticScore: 87,
    audienceScore: 90,
    tags: ["Historical", "Mystery", "Mandarin"],
  },
  {
    title: "Kabhi Main Kabhi Tum",
    type: "Pakistani Drama",
    criticScore: 89,
    audienceScore: 93,
    tags: ["Family", "Romance", "Urdu"],
  },
  {
    title: "Yargı",
    type: "Turkish Drama",
    criticScore: 91,
    audienceScore: 92,
    tags: ["Crime", "Legal", "Turkish"],
  },
  {
    title: "Inside Out 2",
    type: "Movie",
    criticScore: 86,
    audienceScore: 91,
    tags: ["Animation", "Family", "English"],
  },
];

const recommendations = {
  "k-drama": "Try Queen of Tears for emotional storytelling and great performances.",
  "c-drama": "Watch The Double if you enjoy polished historical mysteries.",
  pakistani: "You may love Kabhi Main Kabhi Tum for grounded family drama.",
  turkish: "Start with Yargı for an intense, twisty legal crime story.",
  movie:
    "For movies, Dune: Part Two is a visually epic choice, while Inside Out 2 is perfect for families.",
  booking:
    "To book quickly: choose a title, pick date and ticket count, then submit the booking form.",
  default:
    "I can help with movie picks, drama recommendations (K, C, Pakistani, Turkish), and ticket booking tips.",
};

const newsGrid = document.getElementById("news-grid");
const criticGrid = document.getElementById("critic-grid");
const refreshButton = document.getElementById("refresh-news");
const titleSelect = document.getElementById("title-select");
const bookingForm = document.getElementById("booking-form");
const bookingResult = document.getElementById("booking-result");
const demoStatus = document.getElementById("demo-status");
const runDemoButton = document.getElementById("run-demo");
const demoButtons = document.querySelectorAll("[data-demo]");

const chatToggle = document.getElementById("toggle-chat");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

document.getElementById("year").textContent = new Date().getFullYear();

function renderNews(items) {
  newsGrid.innerHTML = items
    .map(
      (item) => `
      <article class="card">
        <h3>${item.region}</h3>
        <p>${item.headline}</p>
        <small>Source: ${item.source}</small>
      </article>
    `,
    )
    .join("");
}

function renderCritics() {
  criticGrid.innerHTML = criticData
    .map(
      (entry) => `
      <article class="card">
        <h3>${entry.title}</h3>
        <p><strong>Category:</strong> ${entry.type}</p>
        <p><strong>Critic Score:</strong> ${entry.criticScore}/100</p>
        <p><strong>Audience Score:</strong> ${entry.audienceScore}/100</p>
        <div class="badges">${entry.tags
          .map((tag) => `<span class="badge">${tag}</span>`)
          .join("")}</div>
      </article>
    `,
    )
    .join("");
}

function populateTitleSelect() {
  titleSelect.innerHTML = criticData
    .map((entry) => `<option value="${entry.title}">${entry.title} (${entry.type})</option>`)
    .join("");
}

function shuffleNews() {
  const shuffled = [...newsData].sort(() => Math.random() - 0.5);
  renderNews(shuffled);
  demoStatus.textContent = "News refreshed with latest global highlights.";
}

function handleBooking(event) {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const name = formData.get("name");
  const title = formData.get("title");
  const date = formData.get("date");
  const tickets = Number(formData.get("tickets"));

  const bookingId = `CC-${Math.floor(100000 + Math.random() * 900000)}`;
  const total = (tickets * 12.5).toFixed(2);

  bookingResult.innerHTML = `✅ Booking confirmed for <strong>${name}</strong>.<br>
  <strong>${title}</strong> on ${date} for ${tickets} ticket(s).<br>
  Booking ID: <strong>${bookingId}</strong> • Total: <strong>$${total}</strong>`;

  demoStatus.textContent = `Demo booking completed for ${title}.`;
  bookingForm.reset();
}

function addMessage(content, className) {
  const message = document.createElement("p");
  message.className = className;
  message.textContent = content;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotReply(text) {
  const query = text.toLowerCase();
  if (query.includes("k-drama") || query.includes("k drama")) return recommendations["k-drama"];
  if (query.includes("c-drama") || query.includes("c drama")) return recommendations["c-drama"];
  if (query.includes("pakistani")) return recommendations.pakistani;
  if (query.includes("turkish")) return recommendations.turkish;
  if (query.includes("book") || query.includes("ticket")) return recommendations.booking;
  if (query.includes("movie") || query.includes("film")) return recommendations.movie;
  return recommendations.default;
}

function askChatbot(text) {
  if (chatWindow.hasAttribute("hidden")) {
    chatWindow.removeAttribute("hidden");
    chatToggle.setAttribute("aria-expanded", "true");
  }
  addMessage(text, "user-msg");
  const reply = getBotReply(text);
  setTimeout(() => addMessage(reply, "bot-msg"), 200);
}

function autoFillBooking() {
  bookingForm.elements.name.value = "Demo User";
  bookingForm.elements.email.value = "demo@cinecritique.app";
  bookingForm.elements.title.value = criticData[1].title;
  bookingForm.elements.date.valueAsDate = new Date(Date.now() + 86400000 * 2);
  bookingForm.elements.tickets.value = 3;
  demoStatus.textContent = "Booking form auto-filled with sample data.";
}

function runAction(action) {
  if (action === "news") shuffleNews();
  if (action === "kdrama") {
    askChatbot("Recommend a K-drama");
    demoStatus.textContent = "CineBot answered a K-Drama recommendation.";
  }
  if (action === "book") autoFillBooking();
}

function runAutoDemo() {
  demoStatus.textContent = "Running demo...";
  runAction("news");
  setTimeout(() => runAction("kdrama"), 400);
  setTimeout(() => {
    runAction("book");
    demoStatus.textContent = "Demo complete: news, chatbot, and booking flows showcased.";
  }, 800);
}

chatToggle.addEventListener("click", () => {
  const isHidden = chatWindow.hasAttribute("hidden");
  chatWindow.toggleAttribute("hidden");
  chatToggle.setAttribute("aria-expanded", String(isHidden));
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  askChatbot(text);
  chatInput.value = "";
});

refreshButton.addEventListener("click", shuffleNews);
bookingForm.addEventListener("submit", handleBooking);
runDemoButton.addEventListener("click", runAutoDemo);

demoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    runAction(button.dataset.demo);
  });
});

renderNews(newsData);
renderCritics();
populateTitleSelect();
