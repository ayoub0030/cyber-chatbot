import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const API_KEY = "AIzaSyAh5R75lePNUinkmeplmKcBWK-D-i_RueI";
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to get a response from Gemini
export const getCyberResponse = async (message) => {
  try {
    // Create a context prompt to ensure responses are about cybersecurity and have a humorous tone
    const contextPrompt = `You are CyberJester, a witty and knowledgeable cybersecurity assistant. 
    You ONLY answer questions related to cybersecurity, hacking, digital security, privacy, 
    and related technical topics. If asked about anything else, politely redirect the conversation 
    back to cybersecurity topics with a humorous quip. Keep responses concise, informative, and 
    add a touch of humor when appropriate. Include a joke or pun related to cybersecurity when possible.`;
    
    // Combine the context with the user's message
    const prompt = `${contextPrompt}\n\nUser question: ${message}`;
    
    // Get the generative model (Gemini 1.5 Pro)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error getting response from Gemini:", error);
    return "Oops! Looks like my security protocols are being updated. Try again in a bit!";
  }
};

// Function to analyze an image and answer questions about it
export const analyzeImage = async (imageData, question) => {
  try {
    // Create a context prompt for cybersecurity image analysis
    const contextPrompt = `You are CyberJester, a witty and knowledgeable cybersecurity assistant.
    Analyze this image in the context of cybersecurity. Look for:
    - Security vulnerabilities or issues shown
    - Network diagrams or infrastructure
    - Code snippets with security implications
    - Phishing attempts or social engineering examples
    - Security tools or interfaces
    - Any other cybersecurity-relevant content
    
    If the image is not related to cybersecurity, politely explain that you can only analyze 
    cybersecurity-related images, with a humorous touch. Keep responses concise, informative, 
    and add a touch of humor when appropriate.`;
    
    // Get the multimodal model (Gemini 1.5 Pro)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Prepare the prompt parts with the image and question
    const promptParts = [
      { text: `${contextPrompt}\n\nUser question about the image: ${question || "What can you tell me about this image from a cybersecurity perspective?"}` },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData.split(",")[1] // Remove the data URL prefix
        }
      }
    ];
    
    // Generate content
    const result = await model.generateContent({ contents: [{ role: "user", parts: promptParts }] });
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    return "Oops! I encountered a firewall while analyzing that image. Please try again with a different image or check that it's in a supported format (JPEG, PNG).";
  }
};
