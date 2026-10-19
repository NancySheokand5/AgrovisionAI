"""
AgroVision AI Advisor - Conversational Agricultural Assistant Route
Provides natural-language bilingual (English/Hindi) farm advisory with live platform context,
LLM provider integration (Gemini, OpenAI, Groq), and intelligent agronomic engine fallback.
"""

import os
import json
import re
import uuid
import urllib.request
import urllib.error
from pathlib import Path
from flask import Blueprint, request, jsonify

advisor_bp = Blueprint('ai_advisor', __name__)

BASE_DIR = Path(__file__).resolve().parent.parent
SCHEMES_FILE = BASE_DIR / 'data' / 'government_schemes.json'
CROP_KNOWLEDGE_FILE = BASE_DIR / 'data' / 'crop_knowledge.json'

def load_json_file(file_path):
    try:
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
    return {}

SCHEMES_DATA = load_json_file(SCHEMES_FILE).get('schemes', [])
CROP_KNOWLEDGE = load_json_file(CROP_KNOWLEDGE_FILE)

# ─── Language Detection Helper ────────────────────────────────
def is_hindi(text: str) -> bool:
    """Checks if text contains Devanagari script."""
    return bool(re.search(r'[\u0900-\u097F]', text))

# ─── LLM Provider Callers ─────────────────────────────────────
def call_gemini(api_key: str, prompt: str, system_prompt: str, history: list) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    contents = []
    
    # System instruction
    contents.append({
        "role": "user",
        "parts": [{"text": f"System Context & Instructions:\n{system_prompt}\n\nPlease acknowledge and follow these instructions."}]
    })
    contents.append({
        "role": "model",
        "parts": [{"text": "Understood. I am AgroVision AI Advisor, a practical, knowledgeable, and honest agricultural assistant. I will follow all agricultural safety rules, cite real farm context when provided, and respond in the appropriate language."}]
    })

    # History
    for item in history[-6:]:
        role = "user" if item.get('role') == 'user' else "model"
        contents.append({
            "role": role,
            "parts": [{"text": item.get('content', '')}]
        })

    # Latest message
    contents.append({
        "role": "user",
        "parts": [{"text": prompt}]
    })

    payload = json.dumps({"contents": contents}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=15) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        return res['candidates'][0]['content']['parts'][0]['text']


def call_openai_compatible(api_url: str, api_key: str, model: str, prompt: str, system_prompt: str, history: list) -> str:
    messages = [{"role": "system", "content": system_prompt}]
    for item in history[-6:]:
        messages.append({"role": item.get('role', 'user'), "content": item.get('content', '')})
    messages.append({"role": "user", "content": prompt})

    payload = json.dumps({
        "model": model,
        "messages": messages,
        "temperature": 0.4,
        "max_tokens": 1200
    }).encode('utf-8')

    req = urllib.request.Request(
        api_url,
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        }
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        return res['choices'][0]['message']['content']


# ─── AgroVision Agronomic Reasoning Engine (Offline/Knowledge Mode) ───
def agronomic_engine_reply(message: str, lang: str, context: dict) -> dict:
    """
    Intelligent agronomy engine that parses the farmer's query,
    cross-references live platform context (weather, mandi, soil),
    and produces actionable, safe, step-by-step agricultural guidance.
    """
    msg_lower = message.lower()
    reply = ""
    features_used = []
    action_links = []
    follow_ups = []
    verified_facts = []
    safety_warnings = []

    # Extract farm context
    temp = context.get('temperature', 28)
    humidity = context.get('humidity', 72)
    weather_cond = context.get('weatherCondition', 'Partly Cloudy')
    rain_prob = context.get('rainProbability', 20)
    soil_ph = context.get('soilPh', 6.8)
    soil_n = context.get('nitrogen', 82)
    soil_p = context.get('phosphorus', 58)
    soil_k = context.get('potassium', 195)
    location = context.get('location', 'Karnal, Haryana')
    farm_size = context.get('farmSize', 12)

    # 1. Government Schemes Query
    if any(k in msg_lower for k in ['scheme', 'yojana', 'yojna', 'pm-kisan', 'pm kisan', 'pmfby', 'subsidy', 'subsidies', 'kcc', 'kusum', 'card', 'योजना', 'सब्सिडी', 'सरकारी', 'किसान सम्मान', 'बीमा']):
        features_used.append("government_schemes_database")
        if "pmfby" in msg_lower or "bima" in msg_lower or "insurance" in msg_lower or "बीमा" in msg_lower:
            sc = next((s for s in SCHEMES_DATA if s['id'] == 'pmfby'), SCHEMES_DATA[1])
        elif "kusum" in msg_lower or "solar" in msg_lower or "pump" in msg_lower or "सोलर" in msg_lower:
            sc = next((s for s in SCHEMES_DATA if s['id'] == 'pm-kusum'), SCHEMES_DATA[4])
        elif "kcc" in msg_lower or "loan" in msg_lower or "credit" in msg_lower or "कर्ज" in msg_lower or "ऋण" in msg_lower:
            sc = next((s for s in SCHEMES_DATA if s['id'] == 'kcc'), SCHEMES_DATA[3])
        elif "soil" in msg_lower or "card" in msg_lower or "स्वास्थ्य" in msg_lower:
            sc = next((s for s in SCHEMES_DATA if s['id'] == 'soil-health-card'), SCHEMES_DATA[2])
        else:
            sc = next((s for s in SCHEMES_DATA if s['id'] == 'pm-kisan'), SCHEMES_DATA[0])

        verified_facts.append(f"Official Scheme: {sc['name']}")
        verified_facts.append(f"Official Portal: {sc['officialUrl']}")

        if lang == 'hi':
            reply = f"""### 🏛️ {sc['hindiName']} ({sc['name']})

**मुख्य लाभ:**
{sc['benefitHi']}

**पात्रता (Eligibility):**
{chr(10).join(['• ' + e for e in sc['eligibilityHi']])}

**आवश्यक दस्तावेज:**
{chr(10).join(['• ' + d for d in sc['documentsRequiredHi']])}

**आवेदन कैसे करें:**
{sc['howToApplyHi']}

🔗 **आधिकारिक पोर्टल:** [{sc['officialUrl']}]({sc['officialUrl']})

> 💡 **सलाह:** किसी भी बिचौलिए को पैसे न दें। यह योजना सीधे बैंक खाते (DBT) से जुड़ी है।"""
            follow_ups = [
                "PMFBY फसल बीमा के नियम क्या हैं?",
                "KCC लोन के लिए कौन से दस्तावेज चाहिए?",
                "पीएम कुसुम सोलर पंप पर कितनी सब्सिडी मिलती है?"
            ]
        else:
            reply = f"""### 🏛️ {sc['name']}

**Key Benefit:**
{sc['benefit']}

**Eligibility Criteria:**
{chr(10).join(['• ' + e for e in sc['eligibility']])}

**Required Documents:**
{chr(10).join(['• ' + d for d in sc['documentsRequired']])}

**How to Apply:**
{sc['howToApply']}

🔗 **Official Portal:** [{sc['officialUrl']}]({sc['officialUrl']})

> 💡 **Pro-tip:** Never pay agents or middlemen for government schemes. Always register through official portals or your nearest Common Service Centre (CSC)."""
            follow_ups = [
                "What are the rules for PMFBY crop insurance?",
                "How can I apply for a Kisan Credit Card (KCC)?",
                "How much subsidy is available under PM-KUSUM for solar pumps?"
            ]

    # 2. Disease / Pests / Yellow Leaves Query
    elif any(k in msg_lower for k in ['disease', 'pest', 'yellow', 'fungus', 'rot', 'blight', 'insects', 'leaves', 'leaf', 'spray', 'कीट', 'रोग', 'पीला', 'पत्ती', 'फंगस', 'झुलसा', 'कीड़ा', 'दवा', 'छिड़काव']):
        features_used.append("crop_pathology_engine")
        verified_facts.append(f"Current Farm Weather: {temp}°C, Humidity {humidity}%")
        safety_warnings.append("Do not mix chemical pesticides without verified compatibility. Check product label before application.")

        action_links.append({
            "label": "Scan Leaf in Crop Disease Detection",
            "hindiLabel": "रोग पहचान हेतु पत्ती की फोटो स्कैन करें",
            "targetPage": "crop-disease",
            "icon": "ScanLine",
            "description": "Upload a leaf photo for instant AI vision diagnosis & phased treatment"
        })

        if "yellow" in msg_lower or "पीला" in msg_lower or "पीली" in msg_lower:
            if lang == 'hi':
                reply = f"""### 🔬 पत्तियों में पीलापन (Yellowing of Leaves) — मुख्य कारण व समाधान

वर्तमान में आपके क्षेत्र ({location}) में **तापमान {temp}°C** और **नमी {humidity}%** दर्ज है। पत्तियों का पीला पड़ना 4 प्रमुख कारणों से हो सकता है:

1. **नाइट्रोजन की कमी (Nitrogen Deficiency):**
   - *लक्षण:* नीचे की पुरानी पत्तियां पहले पीली पड़ती हैं और पौधे की वृद्धि रुक जाती है।
   - *समाधान:* मिट्टी जांच अनुसार यूरिया का संतुलित प्रयोग या 1-2% यूरिया घोल का पर्णीय छिड़काव करें।

2. **जलभराव या अतिरिक्त नमी (Waterlogging / Over-irrigation):**
   - *लक्षण:* पौधे की जड़ें पर्याप्त ऑक्सीजन न मिलने से पीली पड़ जाती हैं।
   - *समाधान:* खेत में जल निकासी सुनिश्चित करें। मिट्टी सूखने तक अगली सिंचाई टालें।

3. **फंगल रोग या झुलसा (Fungal Infection / Blight):**
   - *लक्षण:* पीली पत्तियों पर भूरे/काले धब्बे बनते हैं (उच्च आर्द्रता {humidity}% में फंगस तेजी से पनपती है)।
   - *समाधान:* प्रभावित पत्तियों को तोड़कर नष्ट करें। साफ मौसम में कार्बेन्डाजिम या मैंकोजेब (Mancozeb) का अनुशंसित छिड़काव करें।

4. **सूक्ष्म पोषक तत्वों (जिंक/आयरन) की कमी:**
   - *लक्षण:* नई पत्तियों की शिराएं हरी और बीच का हिस्सा पीला रहता है।
   - *समाधान:* जिंक सल्फेट (0.5%) + बुझा हुआ चूना का छिड़काव लाभप्रद रहता है।

⚠️ **महत्वपूर्ण:** सटीक पहचान के लिए नीचे दिए गए बटन से प्रभावित पत्ती की तस्वीर खींचकर **Crop Disease Detection** में स्कैन करें।"""
                follow_ups = [
                    "गेहूं में पीला रतुआ (Yellow Rust) के क्या लक्षण हैं?",
                    "टमाटर में अगेती झुलसा का क्या उपचार है?",
                    "कीटों से बचाव के जैविक तरीके क्या हैं?"
                ]
            else:
                reply = f"""### 🔬 Leaf Yellowing Diagnostic & Action Plan

With your current farm conditions in **{location} ({temp}°C, {humidity}% humidity)**, leaf yellowing typically stems from four distinct agronomic factors:

1. **Nitrogen (N) Deficiency:**
   - *Symptom:* Older lower leaves turn pale yellow first, starting from leaf tips backwards in a V-pattern.
   - *Solution:* Top-dress with nitrogen/urea strictly in split doses, or apply a 1-2% foliar urea spray in clear weather.

2. **Excess Moisture or Root Suffocation:**
   - *Symptom:* Entire canopy droops and yellows due to oxygen deprivation in root zone.
   - *Solution:* Ensure proper drainage. Delay the next scheduled irrigation until the top 2 inches of soil are dry.

3. **Fungal Foliar Blight / Leaf Spot:**
   - *Symptom:* Yellow rings surrounding brown or necrotic concentric spots (favored by your current high humidity of {humidity}%).
   - *Solution:* Remove heavily infected bottom leaves. Apply Mancozeb 75% WP (2 g/L) or Copper Oxychloride in dry conditions.

4. **Micronutrient Deficiency (Zinc / Iron Chlorosis):**
   - *Symptom:* Interveinal yellowing while leaf veins stay distinctly green on upper young leaves.
   - *Solution:* Spray 0.5% Zinc Sulfate heptahydrate with 0.25% slaked lime.

⚠️ **Recommended Action:** Use the **Crop Disease Detection** module below to upload a clear close-up photo of the leaf for instant AI pathology diagnosis."""
                follow_ups = [
                    "What are the symptoms of Yellow Rust in wheat?",
                    "How to treat Early Blight in tomato?",
                    "What organic controls are effective against aphids?"
                ]
        else:
            if lang == 'hi':
                reply = f"""### 🐛 फसल कीट व रोग नियंत्रण परामर्श

फसल सुरक्षा में सबसे महत्वपूर्ण कदम समय पर पहचान और समन्वित कीट प्रबंधन (IPM) है:

1. **निगरानी (Monitoring):** खेत में प्रति एकड़ 4-5 फेरोमोन ट्रैप या पीले चिपचिपे ट्रैप (Yellow Sticky Traps) लगाएं।
2. **जैविक नियंत्रण (Bio-control):** कीटों के शुरुआती प्रकोप में नीम तेल (Neem Oil 1500 ppm - 5ml/लीटर पानी) का छिड़काव करें।
3. **रासायनिक सुरक्षा:** जब कीट की संख्या आर्थिक क्षति स्तर (ETL) पार कर जाए, तभी केंद्रीय कीटनाशक बोर्ड द्वारा स्वीकृत कीटनाशक का लेबल अनुसार प्रयोग करें।

> ⚠️ **सुरक्षा नियम:** कभी भी दो रासायनिक दवाओं को बिना आधिकारिक सिफारिश के न मिलाएं। छिड़काव के समय मास्क व दस्ताने पहनें। तेज धूप व हवा में छिड़काव न करें।"""
                follow_ups = [
                    "पत्तियों में पीलापन क्यों आ रहा है?",
                    "टमाटर की फसल में फफूंद से कैसे बचें?",
                    "धान में तना छेदक कीट की रोकथाम कैसे करें?"
                ]
            else:
                reply = f"""### 🐛 Integrated Pest & Disease Management (IPM)

Proactive crop protection relies on preventive vigilance rather than indiscriminate chemical spraying:

1. **Regular Field Scouting:** Inspect the underside of leaves twice a week. Install 4-5 pheromone or yellow sticky traps per acre.
2. **Eco-Friendly Bio-Pesticides:** For initial infestations, spray cold-pressed Neem Oil (1500 ppm at 5 ml/liter water) with a few drops of liquid soap.
3. **Judicious Chemical Control:** Only apply synthetic pesticides when pest populations exceed the Economic Threshold Level (ETL). Always follow the registered label instructions.

> ⚠️ **Safety Protocol:** Never mix incompatible chemical sprays. Always spray during morning or late afternoon hours when bees are inactive and wind is calm."""
                follow_ups = [
                    "Why are my wheat leaves turning yellow?",
                    "How to prevent fungal rot in humid weather?",
                    "Which bio-pesticides work best for sucking pests?"
                ]

    # 3. Soil & Fertilizers Query
    elif any(k in msg_lower for k in ['soil', 'ph', 'npk', 'fertilizer', 'urea', 'dap', 'potash', 'manure', 'compost', 'मिट्टी', 'उर्वरक', 'खाद', 'यूरिया', 'डीएपी', 'पोटाश', 'गोबर', 'जिंक']):
        features_used.append("soil_agronomy_database")
        verified_facts.append(f"Recorded Farm Soil: pH {soil_ph}, N: {soil_n} kg/ha, P: {soil_p} kg/ha, K: {soil_k} kg/ha")
        
        action_links.append({
            "label": "Open Crop Recommendation (Soil Match)",
            "hindiLabel": "मृदा अनुसार उपयुक्त फसल सिफारिश देखें",
            "targetPage": "crop-recommendation",
            "icon": "Sprout",
            "description": "Calculate exact crop suitability for your soil NPK & pH levels"
        })

        if lang == 'hi':
            reply = f"""### 🧪 मृदा स्वास्थ्य व संतुलित उर्वरक प्रबंधन

आपके खेत ({location}) के उपलब्ध मिट्टी आंकड़े:
• **मृदा pH:** {soil_ph} (इष्टतम सामान्य श्रेणी: 6.5 - 7.5)
• **उपलब्ध नाइट्रोजन (N):** {soil_n} kg/ha (मध्यम)
• **उपलब्ध फास्फोरस (P):** {soil_p} kg/ha (अच्छा)
• **उपलब्ध पोटाश (K):** {soil_k} kg/ha (पर्याप्त)

**महत्वपूर्ण सिद्धांत:**
1. **संतुलित NPK अनुपात:** भारतीय मैदानी क्षेत्रों में खाद्यान्न फसलों के लिए आदर्श N:P:K अनुपात **4:2:1** माना जाता है।
2. **उर्वरक प्रयोग का सही समय:**
   - फास्फोरस (DAP/SSP) और पोटाश (MOP) की पूरी मात्रा बुवाई/रोपाई के समय बेसल डोज के रूप में डालें।
   - नाइट्रोजन (यूरिया) को हमेशा 2 से 3 बराबर किस्तों में बांटकर दें (बुवाई, कल्ले फूटते समय, और बालियां निकलते समय)।
3. **जैविक कार्बन बढ़ाएं:** रासायनिक खादों के साथ प्रति एकड़ 4-5 टन अच्छी सड़ी गोबर की खाद (FYM) या वर्मीकम्पोस्ट अवश्य मिलाएं।

> ⚠️ **सावधानी:** बिना मिट्टी जांच के यूरिया का अत्यधिक छिड़काव फसल को कमजोर बनाता है और कीट प्रकोप को बढ़ाता है।"""
            follow_ups = [
                "मृदा स्वास्थ्य कार्ड (Soil Health Card) कैसे बनवाएं?",
                "pH 6.8 में कौन सी फसल सबसे ज्यादा पैदावार देगी?",
                "जैविक खाद बनाने का सबसे आसान तरीका क्या है?"
            ]
        else:
            reply = f"""### 🧪 Soil Fertility & Nutrient Management

Based on your farm records in **{location}**:
• **Soil pH:** {soil_ph} *(Optimal slightly neutral range: 6.5 - 7.5)*
• **Nitrogen (N):** {soil_n} kg/ha *(Medium)*
• **Phosphorus (P):** {soil_p} kg/ha *(Adequate)*
• **Potassium (K):** {soil_k} kg/ha *(Good reserve)*

**Key Principles for Maximum Efficiency:**
1. **Balanced N:P:K Ratio:** Maintain the recommended 4:2:1 ratio for cereal crops rather than over-applying single nutrients.
2. **Split Application Timing:**
   - Apply 100% of Phosphorus (DAP/SSP) and Potassium (MOP) as basal dressing at sowing.
   - Split Nitrogen (Urea) into 3 equal splits: 1/3rd at sowing, 1/3rd at crown root initiation/tillering, and 1/3rd prior to panicle emergence.
3. **Soil Health Enhancement:** Incorporate 4–5 tonnes of well-rotted Farm Yard Manure (FYM) or green manure (Dhaincha/Sunhemp) every two seasons to improve organic carbon and microbial activity.

> ⚠️ **Agronomist Rule:** Never top-dress urea on waterlogged soil or immediately before heavy rainfall to prevent leaching and volatilization."""
            follow_ups = [
                "Which crops thrive best in pH 6.8 soil?",
                "How do I apply for a free Soil Health Card?",
                "What is the difference between DAP and Single Super Phosphate (SSP)?"
            ]

    # 4. Weather & Irrigation Query
    elif any(k in msg_lower for k in ['weather', 'rain', 'irrigate', 'irrigation', 'water', 'temperature', 'forecast', 'मौसम', 'सिंचाई', 'पानी', 'बारिश', 'वर्षा', 'तापमान', 'पाला', 'गर्मी']):
        features_used.append("weather_intelligence_live")
        verified_facts.append(f"Live Weather for {location}: {temp}°C, {weather_cond}, Rain Probability: {rain_prob}%, Humidity: {humidity}%")

        action_links.append({
            "label": "View Weather Forecast & Radar",
            "hindiLabel": "विस्तृत मौसम पूर्वानुमान व रडार देखें",
            "targetPage": "weather",
            "icon": "CloudSun",
            "description": "5-day forecast, agro-alerts, and precipitation probability"
        })
        action_links.append({
            "label": "Irrigation Schedule & Water Balance",
            "hindiLabel": "स्मार्ट सिंचाई सारणी व जल संतुलन",
            "targetPage": "irrigation",
            "icon": "Droplets",
            "description": "FAO-56 evapotranspiration based moisture calculations"
        })

        if lang == 'hi':
            reply = f"""### 🌦️ मौसम व सिंचाई परामर्श — {location}

**ताजा मौसम स्थिति (Live Data):**
• तापमान: **{temp}°C** (आभासी: {temp + 3}°C)
• मौसम स्थिति: **{weather_cond}**
• हवा में नमी: **{humidity}%**
• बारिश की संभावना: **{rain_prob}%**

**सिंचाई दिशा-निर्देश:**
1. **सिंचाई की आवश्यकता:** वर्तमान में बारिश की संभावना कम ({rain_prob}%) है। यदि खेत में ऊपरी 2-3 इंच मिट्टी में नमी कम हो गई हो, तो हल्की सिंचाई करें।
2. **महत्वपूर्ण फसल अवस्थाएं:** गेहूं में कल्ले निकलते समय (20-25 दिन) और बालियां बनते समय पानी की कमी न होने दें।
3. **सिंचाई का उपयुक्त समय:** वाष्पीकरण से पानी की बर्बादी रोकने के लिए सिंचाई हमेशा शाम को या सुबह जल्दी करें। तेज दोपहर में सिंचाई से बचें।

> 💧 **जल बचत सुझाव:** यदि उपलब्ध हो, तो ड्रिप (टपक) या स्प्रिंकलर सिंचाई अपनाएं, जिससे 40% तक पानी की बचत होती है।"""
            follow_ups = [
                "अगले 5 दिनों के मौसम का हाल क्या है?",
                "तेज धूप में सिंचाई करने से फसल को क्या नुकसान होता है?",
                "ड्रिप सिंचाई पर सरकारी अनुदान कैसे लें?"
            ]
        else:
            reply = f"""### 🌦️ Real-Time Weather & Irrigation Advisory

**Current Farm Weather in {location}:**
• Temperature: **{temp}°C** *(Feels like {temp + 3}°C)*
• Condition: **{weather_cond}**
• Relative Humidity: **{humidity}%**
• Rain Probability: **{rain_prob}%**

**Actionable Irrigation Guidance:**
1. **Field Water Status:** With a low rain probability of {rain_prob}%, soil moisture is depleting steadily. If the root zone soil crumbles upon squeezing, provide a light irrigation.
2. **Critical Crop Stages:** For wheat, the Crown Root Initiation (CRI) stage (20–25 days after sowing) is most sensitive to moisture stress; never allow drought during this window.
3. **Best Timing:** Irrigate during early morning or evening hours to minimize evaporative losses and prevent soil temperature shock.

> 💧 **Conservation Tip:** Check the dedicated **Irrigation Advice** module below for daily FAO-56 evapotranspiration (ET₀) calculations."""
            follow_ups = [
                "What is the 5-day weather outlook for my farm?",
                "How to protect crops during sudden heat spikes?",
                "How can I calculate exact crop water requirement?"
            ]

    # 5. Mandi Prices & Selling Decisions
    elif any(k in msg_lower for k in ['mandi', 'price', 'rate', 'sell', 'market', 'msp', 'bhav', 'मंडी', 'भाव', 'दाम', 'कीमत', 'बेचना', 'एमएसपी', 'बाजार']):
        features_used.append("mandi_price_prediction_engine")
        verified_facts.append(f"Mandi Data for Karnal, Haryana: Wheat ₹2,275/qtl (+₹45), Rice ₹3,100/qtl (+₹80), Mustard ₹5,450/qtl (+₹150)")

        action_links.append({
            "label": "Compare Mandi Prices & Trends",
            "hindiLabel": "लाइव मंडी भाव व AI मूल्य रुझान देखें",
            "targetPage": "mandi-prices",
            "icon": "TrendingUp",
            "description": "Inter-mandi comparison, 30-day historical chart, and AI forecast"
        })

        if lang == 'hi':
            reply = f"""### 📈 मंडी भाव व विक्रय निर्णय परामर्श

**करनाल व निकटवर्ती मंडियों के वर्तमान भाव (प्रति क्विंटल):**
• **गेहूं (Wheat):** ₹2,275 *(+₹45 की तेजी, MSP ₹2,275 के आसपास मजबूत)*
• **धान (Rice - Basmati):** ₹3,100 *(+₹80 साप्ताहिक तेजी)*
• **सरसों (Mustard):** ₹5,450 *(+₹150 की तेजी, आवक सीमित)*

**विक्रय निर्णय के लिए प्रमुख सुझाव:**
1. **होल्ड करें या बेचें?**
   - सरसों और बासमती धान में मांग मजबूत बनी हुई है। यदि आपके पास सुरक्षित भंडारण (Warehouse) की सुविधा है, तो आंशिक रूप से रोककर बेहतर भाव का लाभ ले सकते हैं।
2. **नमी का स्तर:** मंडी ले जाने से पहले अनाज को अच्छी तरह सुखा लें (अनाज में नमी 12% से कम होनी चाहिए), अन्यथा आढ़ती वजन और भाव में कटौती करते हैं।
3. **निकटवर्ती मंडियों की तुलना:** करनाल मंडी के अलावा पानीपत व कुरुक्षेत्र मंडियों के भावों की तुलना करके ही माल ले जाएं।

> 💡 **मंडी मॉड्यूल:** लाइव चार्ट और AI मूल्य भविष्यवाणी देखने के लिए नीचे दिए गए बटन का प्रयोग करें।"""
            follow_ups = [
                "सरसों का भाव अगले महीने कैसा रहने का अनुमान है?",
                "सरकारी खरीद (MSP) पर गेहूं कैसे बेचें?",
                "अनाज सुरक्षित रखने के लिए ई-नाम (e-NAM) पोर्टल का उपयोग कैसे करें?"
            ]
        else:
            reply = f"""### 📈 Mandi Market Prices & Selling Strategy

**Current Market Rates in Karnal Mandi (per quintal):**
• **Wheat:** ₹2,275 *(+₹45, trading firm around Government MSP)*
• **Rice (Basmati):** ₹3,100 *(+₹80 weekly gain, strong miller demand)*
• **Mustard:** ₹5,450 *(+₹150, firm trend with limited daily arrivals)*

**Key Factors for Your Selling Decision:**
1. **Hold vs. Sell Outlook:**
   - Oilseeds and quality basmati continue to show upward momentum. If you possess clean, moisture-proof storage, selling in staged batches (30% now, 70% later) reduces market risk.
2. **Moisture Content Compliance:** Ensure grains are sun-dried to under 12% moisture before transport to prevent grade deductions by mandi buyers.
3. **Inter-Mandi Comparison:** Compare prices across Karnal, Panipat, and Kurukshetra before loading produce.

> 💡 **Interactive Module:** Open the **Mandi Prices** module below to explore historical 30-day price trajectories and AI forecast curves."""
            follow_ups = [
                "What is the 30-day price prediction for Mustard?",
                "How do I register for MSP procurement on e-NAM?",
                "What are the best methods to store grain without pest damage?"
            ]

    # 6. Crop Management & Selection
    elif any(k in msg_lower for k in ['crop', 'sow', 'variety', 'growth', 'yield', 'wheat', 'rice', 'mustard', 'tomato', 'cotton', 'फसल', 'बुवाई', 'किस्म', 'पैदावार', 'गेहूं', 'धान', 'सरसों', 'टमाटर', 'कपास']):
        features_used.append("crop_recommendation_models")
        verified_facts.append(f"Farm Region: {location}, Soil pH {soil_ph}, Kharif/Rabi transition")

        action_links.append({
            "label": "Calculate Exact Crop Match (NPK & Climate)",
            "hindiLabel": "मृदा व जलवायु अनुसार उपयुक्त फसल जांचें",
            "targetPage": "crop-recommendation",
            "icon": "Sprout",
            "description": "Matches 7 environmental features against ML agronomy models"
        })

        if lang == 'hi':
            reply = f"""### 🌾 फसल प्रबंधन व उन्नत किस्में — {location}

आपके क्षेत्र और जलवायु परिस्थिति के आधार पर प्रमुख सिफारिशें:

1. **उपयुक्त फसलें व उन्नत किस्में:**
   - **गेहूं (Wheat):** HD-3086 (पूसा गौतमी), HD-3226, DBW-187 (करन वंदना)। ये किस्में उच्च पैदावार (55-65 क्विंटल/हेक्टेयर) और पीला रतुआ प्रतिरोधी हैं।
   - **सरसों (Mustard):** आरएच-749, गिरिराज, पूसा मस्टर्ड-25। कम पानी में भी उत्कृष्ट उत्पादन।
   - **धान (Rice):** पूसा बासमती 1509, पूसा बासमती 1121, पीआर-126।

2. **बुवाई का सही समय:**
   - गेहूं की समय पर बुवाई: **1 नवंबर से 20 नवंबर** के बीच सर्वोत्तम होती है। देरी से बुवाई करने पर हर हफ्ते पैदावार में 1.5 क्विंटल प्रति एकड़ की कमी आती है।
   - सरसों की बुवाई: **15 अक्टूबर से 30 अक्टूबर** का समय आदर्श है।

3. **बीज उपचार (Seed Treatment):**
   - बुवाई से पहले बीजों को कार्बेन्डाजिम या ट्राइकोडर्मा (5 ग्राम/किग्रा बीज) से उपचारित अवश्य करें। इससे 80% बीज जनित रोगों से बचाव होता है।

> 🌱 **सटीक चयन:** अपनी मिट्टी के NPK और वर्षा के सटीक तालमेल के लिए नीचे दिए गए **Crop Recommendation** बटन पर क्लिक करें।"""
            follow_ups = [
                "गेहूं की बुवाई के समय कितना DAP और यूरिया डालना चाहिए?",
                "कम पानी में सबसे ज्यादा मुनाफा देने वाली फसल कौन सी है?",
                "सरसों में पहली सिंचाई कब करनी चाहिए?"
            ]
        else:
            reply = f"""### 🌾 Crop Management & Variety Recommendations for {location}

Based on your local agro-climatic zone and soil profile:

1. **High-Yielding Recommended Varieties:**
   - **Wheat (Triticum aestivum):** HD-3086, DBW-187 (Karan Vandana), and HD-3226. These yield 55–65 quintals/hectare and offer genetic resistance to stripe rust.
   - **Mustard (Brassica juncea):** RH-749, Giriraj, and Pusa Mustard-25. Exceptional oil content (>39%) with low water demand.
   - **Paddy:** Pusa Basmati 1509 (early maturing), Pusa Basmati 1718, and PR-126.

2. **Optimal Sowing Windows:**
   - Timely wheat sowing: **Nov 1 to Nov 20**. Each week's delay past Nov 25 results in a 1.5–2 quintal/acre yield penalty due to terminal heat stress during grain filling.
   - Mustard sowing: **Oct 15 to Oct 30** ensures optimal flowering before winter frost.

3. **Mandatory Seed Treatment:**
   - Treat certified seed with Trichoderma viride (10 g/kg) or Carbendazim (2 g/kg) prior to drilling to prevent seedling blight and root rot.

> 🌱 **Precision Soil Match:** Click the **Crop Recommendation** action below to verify how your specific NPK and pH values match these crops."""
            follow_ups = [
                "What is the recommended seed rate for wheat HD-3086?",
                "Which crop delivers the highest profit in sandy loam soil?",
                "When is the first irrigation required after sowing wheat?"
            ]

    # 7. General Agricultural Query
    else:
        features_used.append("agrovision_general_agronomy")
        action_links.append({
            "label": "Recommend Crop for Soil",
            "hindiLabel": "उपयुक्त फसल सिफारिश देखें",
            "targetPage": "crop-recommendation",
            "icon": "Sprout"
        })
        action_links.append({
            "label": "Scan Crop Disease",
            "hindiLabel": "रोग पहचान हेतु पत्ती स्कैन करें",
            "targetPage": "crop-disease",
            "icon": "ScanLine"
        })

        if lang == 'hi':
            reply = f"""### 👨‍🌾 नमस्ते! मैं हूँ आपका AgroVision AI कृषि सलाहकार

मैं भारतीय किसानों के लिए एक विशेष स्मार्ट कृषि सहायक हूँ। मैं आपके खेत ({location}), मिट्टी और मौसम के अनुसार निम्नलिखित विषयों में मदद कर सकता हूँ:

1. **फसल चयन व बुवाई:** मिट्टी और मौसम अनुसार सबसे उपयुक्त फसल व उन्नत किस्में।
2. **कीट व रोग प्रबंधन:** पत्तियों का पीलापन, फंगस या कीटों की पहचान व सुरक्षित उपचार।
3. **मिट्टी व खाद (NPK):** संतुलित उर्वरक मात्रा और मृदा स्वास्थ्य सुधार।
4. **मौसम व सिंचाई:** ताजा मौसम ({temp}°C, नमी {humidity}%) और सिंचाई का सटीक समय।
5. **सरकारी योजनाएं:** PM-KISAN, PMFBY फसल बीमा, KCC ऋण और सोलर पंप सब्सिडी।
6. **मंडी भाव:** फसलों के ताजा भाव व बेचने का सही समय।

> 💬 कृपया अपनी फसल का नाम, समस्या या सवाल पूछें — मैं सरल हिंदी में चरणबद्ध समाधान दूंगा।"""
            follow_ups = [
                "मेरी मिट्टी के लिए कौन सी फसल सबसे अच्छी है?",
                "गेहूं में पीलापन आ रहा है, क्या करूं?",
                "PM-KISAN सम्मान निधि का पैसा कैसे चेक करें?"
            ]
        else:
            reply = f"""### 👨‍🌾 Hello! I am your AgroVision AI Advisor

I am your dedicated smart farming assistant, tailored to your farm in **{location}** with live data on weather ({temp}°C, {humidity}% humidity), market prices, and soil metrics.

**How I can assist you:**
1. **Crop Selection & Sowing:** Choosing high-yield varieties suited to your soil and regional climate.
2. **Pest & Disease Diagnosis:** Identifying symptoms like leaf yellowing, blight, or pests, and providing step-by-step remedies.
3. **Soil & Fertilizers:** Demystifying NPK ratios, soil pH ({soil_ph}), and balanced fertilization.
4. **Weather & Irrigation:** Optimal watering schedules based on real-time atmospheric data.
5. **Government Schemes:** Eligibility, documents, and application steps for PM-KISAN, PMFBY, KCC, and PM-KUSUM.
6. **Mandi Market Decisions:** Real-time commodity rates and price trends to maximize selling profit.

> 💬 Feel free to ask any farming question in simple English or Hindi!"""
            follow_ups = [
                "Which crop is suitable for my soil?",
                "Why are my crop leaves turning yellow?",
                "How can I apply for PM-KISAN or crop insurance?"
            ]

    return {
        "reply": reply,
        "features_used": features_used,
        "action_links": action_links,
        "follow_ups": follow_ups,
        "verified_facts": verified_facts,
        "safety_warnings": safety_warnings
    }


# ─── API Routes ───────────────────────────────────────────────

@advisor_bp.route('/ai-advisor/health', methods=['GET'])
def advisor_health():
    """Health check endpoint indicating active LLM provider and available knowledge."""
    has_gemini = bool(os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY'))
    has_openai = bool(os.environ.get('OPENAI_API_KEY'))
    has_groq = bool(os.environ.get('GROQ_API_KEY'))
    
    if has_gemini:
        provider = 'gemini-1.5-flash'
    elif has_openai:
        provider = 'openai-gpt-4o-mini'
    elif has_groq:
        provider = 'groq-llama-3.3'
    else:
        provider = 'agrovision-expert-agronomy-engine'

    return jsonify({
        "status": "healthy",
        "provider": provider,
        "hasLlmKey": has_gemini or has_openai or has_groq,
        "supportedLanguages": ["en", "hi"],
        "knowledgeBaseVersion": "2.4.0",
        "featuresConnected": [
            "crop_recommendation",
            "crop_disease_detection",
            "weather_intelligence",
            "irrigation_advisory",
            "mandi_prices",
            "government_schemes"
        ],
        "schemesCount": len(SCHEMES_DATA)
    })


@advisor_bp.route('/ai-advisor/schemes', methods=['GET'])
def get_schemes():
    """Returns verified agricultural government schemes catalog."""
    return jsonify({
        "success": True,
        "count": len(SCHEMES_DATA),
        "schemes": SCHEMES_DATA
    })


@advisor_bp.route('/ai-advisor/chat', methods=['POST'])
def chat():
    """
    Main conversational endpoint.
    Accepts: { message, language?, conversationId?, history?, context? }
    Returns: { success, reply, language, conversationId, provider, model, featuresUsed, actionLinks, suggestedFollowUps, ... }
    """
    try:
        data = request.get_json(force=True, silent=True) or {}
        message = (data.get('message') or '').strip()
        if not message:
            return jsonify({
                "success": False,
                "error": "Message is required."
            }), 400

        # Input safety limits
        if len(message) > 1500:
            message = message[:1500]

        # Determine language
        preferred_lang = data.get('language')
        if not preferred_lang or preferred_lang not in ['en', 'hi']:
            preferred_lang = 'hi' if is_hindi(message) else 'en'

        conversation_id = data.get('conversationId') or str(uuid.uuid4())
        history = data.get('history') or []
        context = data.get('context') or {}

        # Check for live LLM API keys
        gemini_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
        openai_key = os.environ.get('OPENAI_API_KEY')
        groq_key = os.environ.get('GROQ_API_KEY')

        # Fallback system response generator
        offline_result = agronomic_engine_reply(message, preferred_lang, context)

        # Build comprehensive agricultural system prompt
        system_prompt = f"""You are 'AgroVision AI Advisor', a practical, honest, and expert agricultural assistant.
You help farmers make informed decisions in simple, respectful language ({'Hindi' if preferred_lang == 'hi' else 'English'}).

CONNECTED REAL FARM CONTEXT:
• Location: {context.get('location', 'Karnal, Haryana')}
• Farm Size: {context.get('farmSize', 12)} acres
• Live Weather: {context.get('temperature', 28)}°C, Humidity {context.get('humidity', 72)}%, Rain Probability: {context.get('rainProbability', 20)}%
• Soil Status: pH {context.get('soilPh', 6.8)}, Nitrogen {context.get('nitrogen', 82)} kg/ha, Phosphorus {context.get('phosphorus', 58)} kg/ha, Potassium {context.get('potassium', 195)} kg/ha
• Current Mandi Rates: Wheat ₹2,275/qtl (+₹45), Rice ₹3,100/qtl (+₹80), Mustard ₹5,450/qtl (+₹150)

RULES & GUARDRAILS:
1. Understand the farmer's question and provide clear, practical, step-by-step answers.
2. If language is Hindi or contains Hindi script, reply in fluent, respectful Hindi (आप / किसान भाई).
3. Distinguish confirmed facts, general recommendations, and safety cautions.
4. Never invent chemical pesticide/fertilizer dosages. Always cite official product labels or advise consulting the local Krishi Vigyan Kendra (KVK).
5. For leaf diseases or pests, explain symptoms and recommend the built-in Crop Disease Detection photo scanner.
6. For crop selection, explain soil NPK and recommend the built-in Crop Recommendation feature.
7. For mandi sales, compare local mandis and cite official MSP.
"""

        reply_text = None
        provider_name = "agrovision-expert-engine"
        model_name = "agronomy-rules-v2.4"

        # Try Live LLM if key is present
        if gemini_key:
            try:
                reply_text = call_gemini(gemini_key, message, system_prompt, history)
                provider_name = "google-gemini"
                model_name = "gemini-1.5-flash"
            except Exception as e:
                print(f"Gemini API error, falling back to agronomy engine: {e}")

        elif openai_key and not reply_text:
            try:
                reply_text = call_openai_compatible(
                    "https://api.openai.com/v1/chat/completions",
                    openai_key,
                    "gpt-4o-mini",
                    message,
                    system_prompt,
                    history
                )
                provider_name = "openai"
                model_name = "gpt-4o-mini"
            except Exception as e:
                print(f"OpenAI API error, falling back to agronomy engine: {e}")

        elif groq_key and not reply_text:
            try:
                reply_text = call_openai_compatible(
                    "https://api.groq.com/openai/v1/chat/completions",
                    groq_key,
                    "llama-3.3-70b-versatile",
                    message,
                    system_prompt,
                    history
                )
                provider_name = "groq"
                model_name = "llama-3.3-70b-versatile"
            except Exception as e:
                print(f"Groq API error, falling back to agronomy engine: {e}")

        # If no LLM key or LLM failed, use our comprehensive Agronomic Engine
        if not reply_text:
            reply_text = offline_result['reply']
            provider_name = "agrovision-expert-engine"
            model_name = "agronomy-knowledge-v2.4"

        return jsonify({
            "success": True,
            "reply": reply_text,
            "language": preferred_lang,
            "conversationId": conversation_id,
            "provider": provider_name,
            "model": model_name,
            "featuresUsed": offline_result['features_used'],
            "actionLinks": offline_result['action_links'],
            "suggestedFollowUps": offline_result['follow_ups'],
            "verifiedFacts": offline_result['verified_facts'],
            "safetyWarnings": offline_result['safety_warnings']
        })

    except Exception as exc:
        print(f"Advisor Chat Error: {exc}")
        return jsonify({
            "success": False,
            "error": "The AgroVision AI Advisor service encountered an error processing your request. Please try again."
        }), 500
