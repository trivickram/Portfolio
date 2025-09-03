class TrivickramChatBot {
    constructor() {
        this.faqs = {};
        this.fuse = null;
        this.isOpen = false;
        this.isTyping = false;
        this.messageCount = 0;
        
        this.initializeElements();
        this.setupIntentSystem();
        this.loadFAQs();
        this.bindEvents();
    }

    initializeElements() {
        this.chatToggle = document.getElementById('chatToggle');
        this.chatWindow = document.getElementById('chatWindow');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.minimizeBtn = document.getElementById('minimizeBtn');
        this.chatWidget = document.querySelector('.chat-widget');
        this.notificationDot = document.getElementById('notificationDot');
        this.recommendationButtons = document.getElementById('recommendationButtons');
    }

    setupIntentSystem() {
        // Intent mapping for intelligent responses
        this.intents = {
            about: {
                keywords: ['about', 'who', 'introduce', 'tell me about', 'background', 'bio'],
                templates: [
                    "Meet Trivickram! 🌟 Final-year ECE student at VIT Chennai with 8.65 CGPA, AWS Certified, and AI/ML enthusiast. He codes in Python 🐍, not Parseltongue, but close enough! ⚡",
                    "Here's Trivickram: The ECE student who fell in love with algorithms more than circuits! 💕 Currently at VIT Chennai, building AI that actually works (revolutionary, I know). AWS certified and caffeine-powered! ☕",
                    "Trivickram's story: Started with electronics, got distracted by AI/ML, now builds cool stuff that 1000+ people use! 🚀 VIT Chennai student, competitive programming champion, and professional code wizard! 🧙‍♂️"
                ],
                quickReplies: ['Show Projects', 'Technical Skills']
            },
            
            projects: {
                keywords: ['project', 'built', 'work', 'portfolio', 'github', 'app', 'created'],
                templates: [
                    "Here are Trivickram's top projects:\n\n🤖 **AI Cold Email Generator** — 1k+ users, 99.9% uptime\n🏥 **Parkinson's Predictor** — 98.7% accuracy\n🍕 **Food Ordering App** — Full-stack with AWS\n📊 **Customer Analytics Dashboard** — ML-powered insights\n\nWant GitHub links or tech stack details?",
                    "His project arsenal is impressive! 🎯\n• AI Email automation (LLaMA + GROQ)\n• Healthcare ML models (Random Forest + PCA)\n• Cloud-native web apps (React + AWS)\n• Business analytics tools (Streamlit + Python)\n\nEach solves real problems, not just tutorial stuff! 💪",
                    "Buckle up for the project tour! 🎢\n1️⃣ AI Email Generator → Making cold outreach less painful\n2️⃣ Disease Prediction → AI meets healthcare\n3️⃣ Food App → Cloud-powered hunger solutions\n4️⃣ Analytics Dashboard → Data visualization magic\n\nWhich one sparks your interest? ✨"
                ],
                quickReplies: ['GitHub Links', 'Tech Stack', 'Project Details']
            },

            skills: {
                keywords: ['skill', 'technical', 'programming', 'technology', 'language', 'framework', 'stack'],
                templates: [
                    "Trivickram's tech arsenal: 🛠️\n\n**Languages:** Python (expert), JavaScript, R, Java, C++\n**Frameworks:** React.js, Node.js, Streamlit, TensorFlow\n**Cloud:** AWS (certified), S3, DynamoDB, Lambda\n**Tools:** Git, Docker, MongoDB, REST APIs\n\nHe can make data dance and APIs sing! 🎭",
                    "The skill breakdown: 💻\n• **AI/ML:** TensorFlow, Scikit-learn, Pandas, NumPy\n• **Web Dev:** React.js, Node.js, TailwindCSS\n• **Cloud:** AWS services (S3, Lambda, DynamoDB)\n• **Databases:** MongoDB, MySQL, DynamoDB\n\nPlus he explains complex stuff without boring you to death! 😴",
                    "Tech stack highlights: ⚡\n🐍 Python → His coding language of love\n⚛️ React.js → Frontend magic maker\n☁️ AWS → Cloud deployment wizard\n🤖 TensorFlow → AI model trainer\n📊 Streamlit → Data app creator\n\nWant specifics about any technology? 🔍"
                ],
                quickReplies: ['See Projects', 'Certifications', 'Experience']
            },

            contact: {
                keywords: ['contact', 'reach', 'email', 'phone', 'linkedin', 'hire', 'connect'],
                templates: [
                    "Ready to connect? 🔗\n\n📧 **Email:** trivickrambaratam@gmail.com\n📞 **Phone:** +91 7780275446\n🔗 **LinkedIn:** linkedin.com/in/trivickram\n💻 **GitHub:** github.com/trivickram\n🌐 **Portfolio:** trivickram.me\n\nResponse time: Faster than a React re-render! ⚡",
                    "Let's get in touch! 📬\n• Email: trivickrambaratam@gmail.com (professional stuff)\n• Phone: +91 7780275446 (urgent matters)\n• LinkedIn: https://www.linkedin.com/in/trivickram/\n• GitHub: https://github.com/trivickram\n\nWarning: May respond with excessive enthusiasm about AI! 🤖",
                    "Contact info unlocked! 🔓\n\n📧 trivickrambaratam@gmail.com\n📞 +91 7780275446\n\nHe's probably debugging something right now, but always happy to chat about cool tech opportunities! 💬 Check his LinkedIn and GitHub too!"
                ],
                quickReplies: ['Resume', 'Portfolio', 'Availability']
            },

            achievements: {
                keywords: ['achievement', 'award', 'recognition', 'accomplishment', 'rank', 'competition'],
                templates: [
                    "Trivickram's trophy collection: 🏆\n\n🥇 **Top 5%** in competitive programming (8000+ participants)\n📜 **AWS Certified** Cloud Practitioner\n🎓 **Stanford ML Specialization** completed\n📊 **8.65/10 CGPA** at VIT Chennai\n🚀 **1000+ users** on AI projects\n\nNot bad for someone who started with electronics! 😄",
                    "Achievement unlocked! 🎮\n• Competitive Programming Champion (Top Coder recognition)\n• AWS Cloud Certification holder\n• Stanford University ML graduate\n• High academic performer (8.65 CGPA)\n• Built apps with 1k+ active users\n\nTurns out switching from circuits to code was a good call! �",
                    "The highlight reel: ⭐\n🏅 Top 5% among 8000+ in programming contest\n☁️ AWS Certified Cloud Practitioner\n🤖 Stanford ML Specialization graduate\n📚 VIT Chennai academic achiever\n💻 Creator of viral AI applications\n\nFrom ECE student to tech achiever! 🚀"
                ],
                quickReplies: ['Certifications', 'Projects', 'Skills']
            },

            certifications: {
                keywords: ['certification', 'certificate', 'aws', 'stanford', 'course', 'qualified'],
                templates: [
                    "Certificate collection: 📜✨\n\n☁️ **AWS Certified Cloud Practitioner**\n🎓 **Machine Learning Specialization** by Stanford University\n🏆 **Top Coder Recognition** (Programming)\n\nCurrently plotting... I mean, preparing for AWS Solutions Architect Associate! �",
                    "His credential wall: 📋\n• AWS Cloud Practitioner (the cloud whisperer badge)\n• Stanford ML Specialization (yes, THE Stanford!)\n• Competitive Programming recognition\n\nNext mission: More AWS certifications because one is never enough! 🎯",
                    "Certification status: ACHIEVED! ✅\n🌩️ AWS Cloud Practitioner → Cloud computing validated\n🧠 Stanford ML Course → AI knowledge certified\n🏅 Programming Contest → Skills proven\n\nCollects certificates like Pokémon cards, but nerdier! 🤓"
                ],
                quickReplies: ['AWS Details', 'Skills', 'Projects']
            },

            github: {
                keywords: ['github', 'repositories', 'repo', 'repository', 'git', 'code repository'],
                templates: [
                    "🔥 **GitHub Profile:** https://github.com/trivickram\n\n**Recent Repositories:**\n🤖 Personal_chatBot (This very chatbot!)\n📧 Email-Generator (1k+ users, MIT License)\n🏥 Parkinsons-Disease-prediction (98.7% accuracy)\n🚀 AI-powered-Self-Healing-CI-CD-pipelines\n🌐 Portfolio (BSD License)\n\n**Total:** 25+ repositories and growing! 📈",
                    "Welcome to the code museum! 🏛️\n\n**Profile:** https://github.com/trivickram\n**LinkedIn:** https://www.linkedin.com/in/trivickram/\n\n**Featured Projects:**\n• Personal_chatBot - JavaScript (Updated 2 min ago)\n• vit-bfhl-api - HTML (4 days ago)\n• Email-Generator - JavaScript, MIT License\n• Portfolio - HTML, 3 stars\n\nCommits almost daily! 💪",
                    "Dive into Trivickram's coding universe! 🌌\n\nhttps://github.com/trivickram\n\n**Languages:** JavaScript, Python, HTML, TypeScript\n**Licenses:** MIT, BSD, Apache, GPL\n**Activity:** Fresh commits weekly\n**Highlights:** AI projects, web apps, cloud solutions\n\nWarning: May cause coding inspiration! 💡"
                ],
                quickReplies: ['Specific Repos', 'Live Demos', 'Tech Stack']
            }
        };
    }

    async loadFAQs() {
        try {
            const response = await fetch('faqs.json');
            this.faqs = await response.json();
            
            const faqKeys = Object.keys(this.faqs);
            this.fuse = new Fuse(faqKeys, {
                threshold: 0.4,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 2,
                keys: ['']
            });
            
            console.log('FAQs loaded successfully:', Object.keys(this.faqs).length, 'entries');
        } catch (error) {
            console.error('Error loading FAQs:', error);
            this.faqs = {
                'error': "Sorry, I'm having trouble loading my knowledge base. Please try again later."
            };
        }
    }

    bindEvents() {
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        this.minimizeBtn.addEventListener('click', () => this.toggleChat());

        this.sendBtn.addEventListener('click', () => this.handleSendMessage());

        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        this.messageInput.addEventListener('input', () => {
            this.updateSendButtonState();
        });

        this.recommendationButtons.addEventListener('click', (e) => {
            if (e.target.classList.contains('rec-btn')) {
                const question = e.target.getAttribute('data-question');
                this.handleRecommendationClick(question);
            }
        });

        this.chatMessages.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply-btn')) {
                const reply = e.target.textContent;
                this.handleQuickReply(reply);
            }
        });

        this.updateSendButtonState();
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatWidget.classList.toggle('open', this.isOpen);
        
        if (this.isOpen) {
            this.messageInput.focus();
            this.hideNotification();
        }
    }

    hideNotification() {
        this.notificationDot.style.display = 'none';
    }

    updateSendButtonState() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText || this.isTyping;
    }

    handleRecommendationClick(question) {
        this.addMessage(question, 'user');
        
        this.hideRecommendations();
        
        this.showTypingIndicator();

        setTimeout(() => {
            const response = this.getIntelligentResponse(question);
            this.hideTypingIndicator();
            this.addMessage(response.text, 'bot', response.quickReplies);
        }, 800);
    }

    hideRecommendations() {
        this.recommendationButtons.style.display = 'none';
    }

    showRecommendations() {
        this.recommendationButtons.style.display = 'flex';
    }

    async handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.updateSendButtonState();

        this.hideRecommendations();

        this.showTypingIndicator();

        setTimeout(() => {
            const response = this.getIntelligentResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response.text, 'bot', response.quickReplies);
        }, 600);
    }

    getIntelligentResponse(message) {
        if (!this.faqs || Object.keys(this.faqs).length === 0) {
            return {
                text: "I'm still loading my knowledge base. Please try again in a moment.",
                quickReplies: []
            };
        }

        const normalizedMessage = message.toLowerCase().trim();
        
        const detectedIntent = this.detectIntent(normalizedMessage);
        
        if (detectedIntent) {
            return this.generateIntentResponse(detectedIntent);
        }

        if (this.faqs[normalizedMessage]) {
            return {
                text: this.faqs[normalizedMessage],
                quickReplies: this.getContextualQuickReplies(normalizedMessage)
            };
        }

        if (this.fuse) {
            const results = this.fuse.search(normalizedMessage);
            
            if (results.length > 0) {
                const bestMatch = results[0];
                if (bestMatch.score <= 0.6) {
                    return {
                        text: this.faqs[bestMatch.item],
                        quickReplies: this.getContextualQuickReplies(bestMatch.item)
                    };
                }
            }
        }

        return this.getAmbiguousResponseWithOptions(normalizedMessage);
    }

    detectIntent(message) {
        for (const [intentName, intentData] of Object.entries(this.intents)) {
            if (intentData.keywords.some(keyword => message.includes(keyword))) {
                return intentName;
            }
        }
        return null;
    }

    generateIntentResponse(intentName) {
        const intent = this.intents[intentName];
        const randomTemplate = intent.templates[Math.floor(Math.random() * intent.templates.length)];
        
        return {
            text: randomTemplate,
            quickReplies: intent.quickReplies || []
        };
    }

    getAmbiguousResponseWithOptions(message) {
        const suggestions = [];
        
        if (message.includes('work') || message.includes('job') || message.includes('experience')) {
            suggestions.push('Projects', 'Experience', 'Skills');
        } else if (message.includes('learn') || message.includes('study') || message.includes('education')) {
            suggestions.push('Education', 'Certifications', 'Achievements');
        } else if (message.includes('tech') || message.includes('programming')) {
            suggestions.push('Technical Skills', 'Projects', 'Certifications');
        } else {
            suggestions.push('About Trivickram', 'Projects', 'Contact Info');
        }

        return {
            text: "I'm not sure I got that 🤔. Do you want to know about:",
            quickReplies: suggestions
        };
    }

    getContextualQuickReplies(question) {
        if (question.includes('project')) {
            return ['Tech Stack', 'GitHub Links', 'More Projects'];
        }
        if (question.includes('contact') || question.includes('email')) {
            return ['Resume', 'Portfolio', 'LinkedIn'];
        }
        if (question.includes('skill') || question.includes('technical')) {
            return ['See Projects', 'Certifications', 'Experience'];
        }
        if (question.includes('certification')) {
            return ['AWS Details', 'Projects', 'Skills'];
        }
        return ['Tell me more!', 'What else?', 'Contact Info'];
    }

    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.classList.add('show');
        this.scrollToBottom();
        this.updateSendButtonState();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.classList.remove('show');
        this.updateSendButtonState();
    }

    getAnswer(message) {
        getIntelligentAnswer
        const response = this.getIntelligentAnswer(message);
        return response.text;
    }

    addMessage(text, sender, quickReplies = []) {
        this.messageCount++;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        if (sender === 'bot') {
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
        } else {
            avatar.innerHTML = 'You';
        }

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const messageBubble = document.createElement('div');
        messageBubble.className = 'message-bubble';
        
        if (text.includes('\n')) {
            messageBubble.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        } else {
            messageBubble.textContent = text;
        }

        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.getCurrentTime();

        messageContent.appendChild(messageBubble);
        messageContent.appendChild(messageTime);

        if (sender === 'bot' && quickReplies.length > 0) {
            const quickRepliesDiv = document.createElement('div');
            quickRepliesDiv.className = 'quick-replies';
            
            quickReplies.forEach(reply => {
                const button = document.createElement('button');
                button.className = 'quick-reply-btn';
                button.textContent = reply;
                quickRepliesDiv.appendChild(button);
            });
            
            messageContent.appendChild(quickRepliesDiv);
        }

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    handleQuickReply(reply) {
    const questionMap = {
        'About Trivickram': 'Tell me about Trivickram',
        'Who is Trivickram': 'Who is Trivickram',
        'Introduce yourself': 'Introduce yourself',
        'Background': 'What is his background',
        'Education': 'What is his education',
        'Where did he study': 'Tell me about his education',

        'Projects': 'Show me his projects',
        'Show Projects': 'Tell me about his projects',
        'See Projects': 'Show me his projects',
        'Project Details': 'Tell me more about his projects',
        'More Projects': 'Tell me about more projects',
        'Tech Stack': 'What technologies did he use',
        'What did he build': 'Tell me about his projects',
        'GitHub': 'Can I see his GitHub profile',
        'GitHub Links': 'Show me his GitHub repositories',
        'Specific Repos': 'Show me his specific GitHub repositories',
        'Live Demos': 'Show me his live project demos',
        'Portfolio': 'Show me his portfolio website',

        'Skills': 'What are his technical skills',
        'Technical Skills': 'List his technical skills',
        'Programming Languages': 'Which programming languages does he know',
        'Cloud Skills': 'What are his cloud computing skills',
        'Tools': 'What tools does he use',
        'Tech Expertise': 'What technologies does he work with',

        'Certifications': 'What certifications does he have',
        'AWS': 'Tell me about his AWS certification',
        'AWS Details': 'More details on his AWS certification',
        'Certificates': 'List his certifications',

        'Achievements': 'Tell me about his achievements',
        'Awards': 'What awards has he won',
        'Hackathons': 'Has he participated in hackathons',
        'Competitions': 'Has he won any competitions',
        'Ranking': 'What ranks or achievements has he earned',

        'Experience': 'Tell me about his work experience',
        'Work Experience': 'What work experience does he have',
        'Internships': 'Has he done any internships',
        'Previous Jobs': 'Has he worked anywhere before',

        'Contact': 'How can I contact him',
        'Contact Info': 'Give me his contact details',
        'LinkedIn': 'What is his LinkedIn profile',
        'Email': 'What is his email',
        'Phone': 'What is his phone number',
        'Resume': 'Can I see his resume',
        'Portfolio Website': 'Show me his portfolio website',
        'Availability': 'Is he available for work',
        'Hire': 'Can I hire him',
        'Open to work': 'Is he open to opportunities',

        'Tell me more!': 'Tell me more about that',
        'What else?': 'What else can you tell me',
        'Something interesting': 'Tell me a fun fact about him',
        'Fun Fact': 'Tell me a fun fact',
        'Joke': 'Can you tell me a joke',
        'Hobbies': 'What are his hobbies',
        'Strengths': 'What are his strengths',
        'Weaknesses': 'What are his weaknesses'
    };

        const question = questionMap[reply] || reply;
        
        this.addMessage(question, 'user');
        
        this.showTypingIndicator();

        setTimeout(() => {
            const response = this.getIntelligentResponse(question);
            this.hideTypingIndicator();
            this.addMessage(response.text, 'bot', response.quickReplies);
        }, 700);
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    scrollToBottom() {
        
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 10);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const chatBot = new TrivickramChatBot();
        console.log('TrivickramChatBot initialized successfully');
        
        setTimeout(() => {
            const notificationDot = document.getElementById('notificationDot');
            if (notificationDot) {
                notificationDot.style.display = 'block';
            }
        }, 2000);
        
    } catch (error) {
        console.error('Error initializing TrivickramChatBot:', error);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const chatWidget = document.querySelector('.chat-widget');
        if (chatWidget && chatWidget.classList.contains('open')) {
            chatWidget.classList.remove('open');
        }
    }
});

window.addEventListener('resize', () => {
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow && window.innerWidth <= 480) {
        chatWindow.style.width = `${window.innerWidth - 20}px`;
        chatWindow.style.height = `${window.innerHeight - 100}px`;
    }
});
