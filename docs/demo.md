# Live Demo & Evaluation Script

Department of Artificial Intelligence & Data Science  
Vishwakarma Institute of Technology, Pune (AY 2025-26)  
Project: AI-Based Autonomous Voice Calling Agent for Intelligent Customer Interaction  
Group: TY_E_13 | Guide: Dr. Viomesh Kumar Singh  

## Demo Scenarios

### Scenario 1: Hindi Appointment Reminder (Confirmation)
1. **Target Customer**: Rahul Sharma (Phone: +91 98765 43210, Preferred: Hindi)
2. **Campaign**: Appointment Reminder
3. **Agent Opening**:
   > *"नमस्ते Rahul Sharma जी, मैं एबीसी सर्विसेज से बात कर रहा हूँ। Appointment Reminder के रिगार्डिंग कॉल किया है। क्या अभी बात करना convenient है?"*
4. **Customer Response**:
   > *"हाँ, बताइए।"*
5. **Agent Informs**:
   > *"आपकी appointment कल शाम 5 बजे डॉ. कुलकर्णी के साथ scheduled है। क्या आप इसे confirm करना चाहेंगे?"*
6. **Customer Response**:
   > *"Haan confirm kar do."*
7. **System Behavior**:
   - **Detected Intent**: `CONFIRMATION` (Confidence: 96%)
   - **Language**: `Hindi / Hinglish`
   - **Sentiment**: `Positive`
   - **Action Executed**: `confirm_appointment(customer_id="cust-101")`
   - **Database Updated**: Customer status updated to `completed`, notes recorded.
   - **Agent Reply**:
     > *"बहुत-बहुत धन्यवाद! आपकी पुष्टि दर्ज कर ली गई है। आपका दिन शुभ हो!"*
   - Call status marked as `completed`.

---

### Scenario 2: Marathi Callback Scheduling (Busy Customer)
1. **Target Customer**: Sneha Kulkarni (Phone: +91 98223 34455, Preferred: Marathi)
2. **Campaign**: Follow-up / Appointment Check
3. **Agent Opening**:
   > *"नमस्कार Sneha Kulkarni जी, मी एबीसी सर्व्हिसेस कडून बोलत आहे. आपण 2 मिनिटे बोलू शकाल का?"*
4. **Customer Response**:
   > *"मी सध्या कामात व्यस्त आहे, मला उद्या सकाळी फोन करा."*
5. **System Behavior**:
   - **Detected Intent**: `REQUEST_CALLBACK` (Confidence: 95%)
   - **Language**: `Marathi`
   - **Sentiment**: `Neutral`
   - **Action Executed**: `schedule_callback(customer_id="cust-102", scheduled_for="Tomorrow 10:00 AM")`
   - **Database Updated**: New record created in `callbacks` table. Customer status set to `callback_scheduled`.
   - **Agent Reply**:
     > *"नक्कीच! मी आपल्यासाठी उद्या सकाळी पुन्हा कॉल शेड्यूल केला आहे. आपला दिवस चांगला जावो!"*

---

### Scenario 3: Human Agent Escalation (Frustrated Customer)
1. **Target Customer**: Amit Patel
2. **Customer Speech**:
   > *"Mujhe kisi human manager se baat karni hai, ye automated call band karo!"*
3. **System Behavior**:
   - **Detected Intent**: `HUMAN_ESCALATION`
   - **Sentiment**: `Negative`
   - **Action Executed**: `escalate_to_human(call_id=..., reason="Explicit request for human agent")`
   - **Agent Reply**:
     > *"I understand. Main turant aapka call hamare live support executive ko transfer kar raha hoon. Kripya thoda wait kijiye."*
   - Call flag set to `escalated = true`.
