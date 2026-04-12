import os
import google.generativeai as genai
import json

# Setup Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("WARNING: GEMINI_API_KEY not found in environment. AI features will not work.")

# Use Gemini 1.5 Flash for chat/speed, or 1.5 Pro for complex reasoning.
model_name = "gemini-1.5-flash"

def generate_budget_advice(financial_data: dict) -> dict:
    if not api_key:
        return {
            "recommended_budget": {"Housing": 30, "Food": 20, "Transport": 10, "Savings": 20, "Other": 20},
            "insights": ["API key missing. This is mock data."],
            "savings_tips": ["Set up Gemini API Key to get natural insights!"]
        }

    try:
        model = genai.GenerativeModel(model_name)
        prompt = f"""
        You are an expert AI financial coach. Analyze the following user financial data: {json.dumps(financial_data)}.
        Return a strict JSON object with this exact structure, nothing else:
        {{
            "recommended_budget": {{"CategoryName": percentage_as_number, ...}},
            "insights": ["insight 1", "insight 2"],
            "savings_tips": ["tip 1", "tip 2"]
        }}
        """
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
        
        return json.loads(text)
    except Exception as e:
        print(f"Error generating budget advice: {e}")
        return {
            "recommended_budget": {},
            "insights": ["Error connecting to AI service."],
            "savings_tips": ["Please try again later."]
        }

def process_chat(message: str, history: list, financial_data: dict) -> str:
    if not api_key:
        return "I am standard text placeholder. Please provide GEMINI_API_KEY to chat with me!"
        
    try:
        model = genai.GenerativeModel(model_name)
        system_instructions = f"You are a helpful, professional financial AI assistant. The user's current financial data is: {json.dumps(financial_data)}."
        
        messages = [{"role": "user", "parts": [system_instructions]}]
        
        for msg in history[-5:]:
            messages.append({"role": "user" if msg['role'] == "user" else "model", "parts": [msg['content']]})
            
        messages.append({"role": "user", "parts": [message]})
        
        response = model.generate_content(messages)
        return response.text
    except Exception as e:
        print(f"Error processing chat: {e}")
        return "I'm having trouble processing that right now."
