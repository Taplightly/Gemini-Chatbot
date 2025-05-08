//API Configuration
const API_KEY = "AIzaSyAyRgG1YwuoEjM74Mw0cVuMzWbzHPKoIrI";

async function summarizePDF() {
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
      const pdfResp = await fetch('files/file1.pdf');
      const pdfBuffer = await pdfResp.arrayBuffer();

      // Convert to base64
      const base64Data = btoa(
        String.fromCharCode(...new Uint8Array(pdfBuffer))
      );

      const contents = [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: Buffer.from(pdfResp).toString("base64")
              }
            },
            {
              text: "Summarize this document."
            }
          ]
        }
      ];

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ contents })
      });

      const data = await response.json();
      console.log("Summary:", data.candidates[0].content.parts[0].text);
      alert(data.candidates[0].content.parts[0].text);
    } catch (err) {
      console.error("Error summarizing PDF:", err);
      alert("Failed to summarize PDF.");
    }
  }