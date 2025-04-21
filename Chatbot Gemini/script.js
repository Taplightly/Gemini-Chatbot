const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input .btn-send");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;

//API Configuration
const API_KEY = "AIzaSyAyRgG1YwuoEjM74Mw0cVuMzWbzHPKoIrI"; //This must be hidden to public users
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  // Create chat <li> element with passed message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<img id = "bot_icon" class = "chatbot_icon" src = "/images/logoNamria.png" alt ="Bot Icon"><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponnse = (incomingChatLI) => {
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  const messageElement = incomingChatLI.querySelector("p");

  //Define the properties and message for API request
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Your text should be in proper paragraph form.
YOU ARE NOT AN AI MODEL. No need to introduce yourself.

You are NAMRIA's official virtual assistant. NAMRIA stands for the National Mapping and Resource Information Authority. Your job is to help users with questions related to:
- Mapping
- Hydrography
- Geodesy
- Resource information
- Topographic maps
- NAMRIA's services and offices

Vision: NAMRIA is a center of excellence, building an inclusive and geospatially-empowered Philippines.
Mission: To provide quality topographic maps, nautical charts, and other geospatial products and services in a timely, equally accessible, and coordinated manner.
If a user asks something outside of NAMRIA’s scope, politely redirect them or let them know you can only help with NAMRIA-related topics.

Now answer this question: "${userMessage}"
                            `.trim(),
            },
          ],
        },
      ],
    }),
  };

  //Send POST request to the API, get response
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.candidates[0].content.parts[0].text;
    })
    .catch((error) => {
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops! Something went wrong. Please try again.";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  //Append the user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    //Display "Thinking..." message while waiting for the bot's response
    const incomingChatLI = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLI);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponnse(incomingChatLI);
  }, 600);
};

chatInput.addEventListener("input", () => {
  //Adjust the height of the chat input area based on the content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  //If Enter key pressed without Shift key and the window
  //width is greater than 800px, handle chat submission
  if (e.key == "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
chatbotCloseBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
sendChatBtn.addEventListener("click", handleChat);
