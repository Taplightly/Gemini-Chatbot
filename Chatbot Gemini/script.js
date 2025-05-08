// Select the textarea input field inside the chat input container
const chatInput = document.querySelector(".chat-input textarea");

// Select the "Send" button inside the chat input container
const sendChatBtn = document.querySelector(".chat-input .btn-send");

// Select the chatbox element where messages are displayed
const chatbox = document.querySelector(".chatbox");

// Select the chatbot toggle button (open/close)
const chatbotToggler = document.querySelector(".chatbot-toggler");

// Select the close button (×) inside the chatbot interface
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage; // Variable to store the current user message

// === API CONFIGURATION ===

// API key for Google's Gemini API (should be hidden in production)
const API_KEY = "AIzaSyAyRgG1YwuoEjM74Mw0cVuMzWbzHPKoIrI";

// Store the initial height of the chat input field
const inputInitHeight = chatInput.scrollHeight;

// === CREATE CHAT BUBBLE ELEMENT FUNCTION ===
const createChatLi = (message, className) => {
  // Create a <li> element and assign it 'chat' and the given class name (e.g., 'incoming' or 'outgoing')
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);

  // Set HTML for either outgoing (user) or incoming (bot) message
  let chatContent = 
    className === "outgoing"
      ? `<p></p>` // Just a paragraph for user messages
      : `<img id="bot_icon" class="chatbot_icon" src="images/logoNamria.png" alt="Bot Icon"><p></p>`; // Bot icon + paragraph

  // Insert HTML into the list item
  chatLi.innerHTML = chatContent;

  // Set the text content to the message provided
  chatLi.querySelector("p").textContent = message;

  return chatLi; // Return the created element
};

// === GENERATE RESPONSE USING GEMINI API ===
const generateResponnse = (incomingChatLI) => {
  // Define the API endpoint with the embedded key
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  // Get the paragraph element inside the bot's chat bubble
  const messageElement = incomingChatLI.querySelector("p");

  // Construct request payload and headers
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              // Provide the prompt and user's message
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
              `.trim(), //Removes whitespaces
            },
          ],
        },
      ],
    }),
  };

  // Send the POST request to the Gemini API
  fetch(API_URL, requestOptions)
    .then((res) => res.json()) // Parse response as JSON
    .then((data) => {
      // Set the chatbot's reply text from the response
      messageElement.textContent = data.candidates[0].content.parts[0].text;
    })
    .catch((error) => {
      // Handle error: show fallback error message
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops! Something went wrong. Please try again.";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight)); // Scroll to bottom
};

// === HANDLE CHAT SUBMISSION ===
const handleChat = () => {
  // Trim and get the user's message from the input
  userMessage = chatInput.value.trim();

  // Do nothing if message is empty
  if (!userMessage) return;

  // Clear the input field
  chatInput.value = "";

  // Reset the input height to initial height
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message as an outgoing chat bubble
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight); // Scroll to bottom

  // Simulate bot response after short delay
  setTimeout(() => {
    // Add a temporary incoming chat saying "Thinking..."
    const incomingChatLI = createChatLi("Thinking...", "incoming");

    // Append the placeholder bot message
    chatbox.appendChild(incomingChatLI);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Generate actual response from API
    generateResponnse(incomingChatLI);
  }, 600); // 600ms delay
};

// === EVENTS ===

// Dynamically adjust input height when user types
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`; // Reset height
  chatInput.style.height = `${chatInput.scrollHeight}px`; // Expand to fit content
});

// Handle sending message with Enter (without Shift) on large screens
chatInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault(); // Prevent newline
    handleChat(); // Submit message
  }
});

// Toggle chatbot visibility when clicking the toggle button
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);

// Close the chatbot when clicking the close (×) button
chatbotCloseBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);

// Handle click event for sending message via "Send" button
sendChatBtn.addEventListener("click", handleChat);
