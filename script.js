window.addEventListener("DOMContentLoaded", () => {
  const quoteText = document.querySelector(".quote"),
    quoteBtn = document.querySelector("button"),
    authorName = document.querySelector(".name"),
    speechBtn = document.querySelector(".speech"),
    copyBtn = document.querySelector(".copy"),
    discordBtn = document.querySelector(".discord"),
    synth = "speechSynthesis" in window ? window.speechSynthesis : null;

  async function randomQuote() {
    quoteBtn.classList.add("loading");
    quoteBtn.innerText = "Loading Quote...";
    try {
      const response = await fetch("http://api.quotable.io/random");
      const result = await response.json();

      quoteText.innerText = result.content;
      authorName.innerText = result.author;
    } catch (error) {
      quoteText.innerText = "Failed to fetch quote!";
      authorName.innerText = "Error";
      console.error(error);
    } finally {
      quoteBtn.classList.remove("loading");
      quoteBtn.innerText = "New Quote";
    }
  }

  // 🔊 Speech synthesis
  if (synth && speechBtn) {
    speechBtn.addEventListener("click", () => {
      if (!quoteBtn.classList.contains("loading")) {
        let utterance = new SpeechSynthesisUtterance(
          `${quoteText.innerText} by ${authorName.innerText}`
        );
        synth.cancel(); // supaya tidak numpuk
        synth.speak(utterance);

        let checkSpeaking = setInterval(() => {
          if (!synth.speaking) {
            speechBtn.classList.remove("active");
            clearInterval(checkSpeaking);
          } else {
            speechBtn.classList.add("active");
          }
        }, 100);
      }
    });
  }

  // 📋 Copy
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(quoteText.innerText);
    });
  }

  // 🐦 Twitter
  if (discordBtn) {
    discordBtn.addEventListener("click", () => {
      let discordUrl = `https://discord.com/users/755071629389856848${encodeURIComponent(
        quoteText.innerText
      )} - ${encodeURIComponent(authorName.innerText)}`;
      window.open(discordUrl, "_blank");
    });
  }

  // 🔄 Ambil quote baru
  if (quoteBtn) {
    quoteBtn.addEventListener("click", randomQuote);
  }

  // 🚀 Ambil 1 quote di awal
  randomQuote();
});