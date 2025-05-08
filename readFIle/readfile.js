// === API Configuration ===
// Your Gemini API key for accessing Google's generative language model
const API_KEY = "AIzaSyAyRgG1YwuoEjM74Mw0cVuMzWbzHPKoIrI";

// === Function to Summarize PDF ===
async function summarizePDF() {
  // Construct the API endpoint URL with your API key
  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  try {
    // === FETCH PDF FILE ===
    // Request the PDF file from the server
    const pdfResp = await fetch('/readFile/files/file1.pdf');

    // Convert the fetched response to an ArrayBuffer (binary data)
    const pdfBuffer = await pdfResp.arrayBuffer();

    // === CONVERT PDF TO BASE64 ===
    // Convert the ArrayBuffer to a base64-encoded string
    const base64Data = btoa(
      String.fromCharCode(...new Uint8Array(pdfBuffer))
    );

    // === PREPARE REQUEST BODY ===
    // Define the content structure for the Gemini API request
    const contents = [
      {
        role: "user", // Role of the sender
        parts: [
          {
            // Embed the PDF file as inline data
            inlineData: {
              mimeType: "application/pdf", // MIME type for PDF
              data: base64Data // base64-encoded PDF content
            }
          },
          {
            // The prompt asking the model to summarize the PDF
            text: "Summarize this document."
          }
        ]
      }
    ];

    // === SEND REQUEST TO GEMINI API ===
    const response = await fetch(apiUrl, {
      method: "POST", // HTTP POST method
      headers: {
        "Content-Type": "application/json" // Sending JSON data
      },
      body: JSON.stringify({ contents }) // Convert JS object to JSON string
    });

    // Parse the JSON response from the API
    const data = await response.json();

    // === DISPLAY SUMMARY ===
    // Log and show the summary result to the user
    console.log("Summary:", data.candidates[0].content.parts[0].text);
    alert(data.candidates[0].content.parts[0].text);

  } catch (err) {
    // Handle and display any errors that occur during the process
    console.error("Error summarizing PDF:", err);
    alert("Failed to summarize PDF.");
  }
}
