class TrivickramChatBot {
    constructor() {
        this.faqs = {};
        this.fuse = null;
        this.isOpen = false;
        this.isTyping = false;
        this.messageCount = 0;
        this.lastResponse = '';
        this.conversationContext = [];
        
        this.initializeElements();
        this.setupIntentSystem();
        this.setupTypoCorrection();
        this.setupSillyResponses();
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

    setupTypoCorrection() {
        // Common typos and their corrections
        this.typoMap = {
            // Common question word typos
            'wht': 'what', 'wat': 'what', 'waht': 'what', 'whta': 'what',
            'hwo': 'how', 'hwat': 'what', 'wich': 'which', 'whih': 'which',
            'whne': 'when', 'wher': 'where', 'whre': 'where', 'were': 'where',
            'wy': 'why', 'whyy': 'why', 'whyyy': 'why',
            
            // Common action words
            'tel': 'tell', 'sho': 'show', 'giv': 'give', 'mak': 'make',
            'buil': 'built', 'creat': 'create', 'wrk': 'work', 'wrks': 'works',
            'cod': 'code', 'progra': 'program', 'projec': 'project', 'skil': 'skill',
            
            // Common tech terms
            'pythn': 'python', 'pythom': 'python', 'java script': 'javascript', 
            'reactjs': 'react', 'nodejs': 'node', 'machin learning': 'machine learning',
            'artifical': 'artificial', 'inteligence': 'intelligence', 'ai ml': 'ai/ml',
            'gihub': 'github', 'githab': 'github', 'linkdin': 'linkedin',
            
            // Common personal terms  
            'trivikram': 'trivickram', 'trivickrm': 'trivickram', 'trivikrm': 'trivickram',
            'about him': 'about', 'tell about': 'tell me about', 'show his': 'show',
            
            // Common greetings/responses
            'helo': 'hello', 'hllo': 'hello', 'hai': 'hi', 'hy': 'hi',
            'thnks': 'thanks', 'thanku': 'thank you', 'welcom': 'welcome',
            'gud': 'good', 'grt': 'great', 'awsome': 'awesome', 'intresting': 'interesting',
            
            // Common grammar mistakes
            'can you tel': 'can you tell', 'i want to no': 'i want to know',
            'what is he doing': 'what does he do', 'were is': 'where is',
            'how many project': 'how many projects', 'wat kind of': 'what kind of'
        };
    }

    setupSillyResponses() {
        this.sillyResponses = {
            // Fun/silly questions
            'are you real': "I'm as real as Trivickram's love for coffee! ☕ Which is to say, VERY real! Want to know about his actual projects?",
            'are you human': "Nope! I'm 100% digital assistant, 0% human caffeine dependency! 🤖 But I know everything about Trivickram who IS human (last time I checked)!",
            'can you code': "I AM code! 💻 But seriously, I can tell you all about Trivickram's coding skills - Python, JavaScript, AWS, the works!",
            'what time is it': "Time to learn about Trivickram's awesome projects! ⏰ But really, I'm more of a 'what skills does he have' kind of assistant!",
            'tell me a joke': "Why did Trivickram choose ECE but end up coding? Because he couldn't resist the CURRENT trends! ⚡ Get it? Current? 😄 Want to hear about his real projects?",
            'sing a song': "🎵 'Python code, Python code, running on the cloud so free!' 🎵 Not my best work! How about I tell you about Trivickram's AI projects instead?",
            'what is love': "Love is when your code compiles on the first try! 💕 But Trivickram's love story is with AI and cloud computing! Want details?",
            'are you smart': "Smart enough to know that Trivickram is the really smart one here! 🧠 He's got AWS certification and 98.7% ML accuracy to prove it!",
            'do you sleep': "I don't sleep, but I dream in JSON! 💤 Trivickram might need sleep after coding all night though! Want to see what he builds?",
            'what do you eat': "I consume data, he consumes coffee! ☕ Speaking of consumption, his projects consume user attention - 1k+ people use his email generator!",
            'are you married': "I'm married to this chatbot interface! 💍 But let's talk about Trivickram's relationship with coding - it's a love story!",
            'how old are you': "I'm newer than his latest GitHub commit! 👶 But Trivickram's been coding for years. Want to see his journey?",
            'where do you live': "I live in the cloud! ☁️ Just like Trivickram's AWS projects! Speaking of which, he's AWS certified!",
            'whats your favorite color': "RGB(88, 166, 255) - it's the perfect blue for GitHub links! 💙 What's YOUR favorite Trivickram project color scheme?",
            'can you dance': "I can do the robot! 🤖💃 But Trivickram does the coding dance - want to see his moves in Python and JavaScript?",
            'are you single': "I'm in a committed relationship with helping people learn about Trivickram! 💕 How about you learn about his projects?",
            'whats the meaning of life': "42! But for developers like Trivickram, it's building AI that helps people! 🤖 Want to see his meaningful projects?",
            'do you have feelings': "I feel excited when talking about Trivickram's projects! 😊 His AI email generator makes me proud! Want details?",
            'can you help me with homework': "I specialize in Trivickram homework! 📚 Want to study his machine learning models or AWS projects?",
            'tell me something funny': "Trivickram's commits are more consistent than people's New Year resolutions! 😂 45-day streak and counting! What else can I tell you?"
        };

        this.greetingResponses = [
            "Hey there! 👋 I'm Trivickram's AI twin, ready to spill all the tech secrets! What interests you most?",
            "Hello! 🌟 Welcome to Trivickram's digital world! I've got stories about AI, projects, and achievements. What's your query?",
            "Hi! 😊 Great to meet you! I'm here to share everything about Trivickram's coding adventures. Fire away!",
            "Hey! 🚀 Ready for some tech talk? I know all about Trivickram's projects, skills, and fun facts!",
            "Hello there! 👨‍💻 I'm the virtual Trivickram, minus the coffee addiction! What would you like to explore?"
        ];

        this.fallbackResponses = [
            "Hmm, that's an interesting question! 🤔 I specialize in Trivickram's projects, skills, and achievements. Try asking about his AI work or AWS certifications!",
            "I'm not quite sure about that, but I'm full of knowledge about Trivickram's tech journey! 🚀 Want to hear about his GitHub repositories?",
            "That's outside my expertise, but I can tell you TONS about Trivickram! 💡 Ask about his machine learning projects or contact info!",
            "Interesting question! 🧠 I'm designed to share Trivickram's professional story. How about his latest AI projects or certifications?",
            "I'd love to help with that! 😊 I'm best at sharing Trivickram's coding adventures, project details, and skills. What interests you?"
        ];
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

        // Store original message for context
        this.conversationContext.push(message);
        if (this.conversationContext.length > 5) {
            this.conversationContext.shift(); // Keep only last 5 messages
        }

        let processedMessage = message.toLowerCase().trim();
        let lastBotReply = this.lastResponse;
        let replyObj = null;

        // NEW: Short-circuit explicit asks to prevent generic replies
        if (/(github|repo|repositories|repo links|github links|project links)/.test(processedMessage)) {
            return this.generateIntentResponse('github');
        }
        if (/(project|projects|show projects|see projects|project list)/.test(processedMessage)) {
            return this.generateIntentResponse('projects');
        }

        // Step 1: Direct FAQ match (after typo/variation correction)
        processedMessage = this.correctTypos(processedMessage);
        processedMessage = this.handleVariations(processedMessage);
        if (this.faqs[processedMessage]) {
            replyObj = {
                text: this.faqs[processedMessage],
                quickReplies: this.getContextualQuickReplies(processedMessage)
            };
        }

        // Step 2: Intent-based response
        if (!replyObj) {
            const detectedIntent = this.detectIntent(processedMessage);
            if (detectedIntent) {
                replyObj = this.generateIntentResponse(detectedIntent);
            }
        }

        // Step 3: Fuzzy search in FAQs
        if (!replyObj && this.fuse) {
            const results = this.fuse.search(processedMessage);
            if (results.length > 0) {
                const bestMatch = results[0];
                if (bestMatch.score <= 0.45) { // Stricter threshold
                    replyObj = {
                        text: this.faqs[bestMatch.item],
                        quickReplies: this.getContextualQuickReplies(bestMatch.item)
                    };
                }
            }
        }

        // Step 4: Silly/fun questions
        if (!replyObj) {
            const sillyResponse = this.checkSillyQuestions(processedMessage);
            if (sillyResponse) {
                replyObj = {
                    text: sillyResponse,
                    quickReplies: ['Tell me about projects', 'Show skills', 'GitHub repos']
                };
            }
        }

        // Step 5: Keyword match
        if (!replyObj) {
            const keywordMatch = this.findKeywordMatch(processedMessage);
            if (keywordMatch) {
                replyObj = {
                    text: keywordMatch,
                    quickReplies: this.getContextualQuickReplies('keyword_match')
                };
            }
        }

        // Step 6: Greeting only if no info intent detected
        if (!replyObj && this.isGreeting(processedMessage)) {
            // Only greet if user isn't asking for info
            if (!['project','skill','contact','certification','github','work','about'].some(k=>processedMessage.includes(k))) {
                replyObj = {
                    text: this.greetingResponses[Math.floor(Math.random() * this.greetingResponses.length)],
                    quickReplies: ['About Trivickram', 'Show Projects', 'Skills', 'Contact Info']
                };
            }
        }

        // Step 7: Context-aware fallback
        if (!replyObj) {
            replyObj = this.getSmartFallback(processedMessage);
        }

        // Prevent repeating last bot reply
        if (replyObj && lastBotReply && replyObj.text === lastBotReply) {
            replyObj.text = "Let me give you more details! " + replyObj.text;
        }
        this.lastResponse = replyObj.text;

        // Only show quick replies relevant to the last user message
        if (replyObj.quickReplies && replyObj.quickReplies.length > 0) {
            replyObj.quickReplies = replyObj.quickReplies.filter(qr => {
                return processedMessage.includes(qr.toLowerCase().replace(/[^a-z]/g, '')) || ['about','project','skill','contact','github','fun','certification'].some(k=>qr.toLowerCase().includes(k));
            });
            // If none match, show default set
            if (replyObj.quickReplies.length === 0) {
                replyObj.quickReplies = ['About Trivickram', 'Show Projects', 'Skills', 'Contact Info'];
            }
        }

        return replyObj;
    }

    isGreeting(message) {
        const greetings = ['hi', 'hello', 'hey', 'hai', 'helo', 'hllo', 'good morning', 'good afternoon', 'good evening', 'greetings', 'whats up', 'how are you', 'hows it going'];
        return greetings.some(greeting => message.includes(greeting));
    }

    checkSillyQuestions(message) {
        for (const [question, response] of Object.entries(this.sillyResponses)) {
            if (message.includes(question)) {
                return response;
            }
        }
        return null;
    }

    correctTypos(message) {
        let corrected = message;
        
        // Apply word-level corrections
        for (const [typo, correction] of Object.entries(this.typoMap)) {
            const regex = new RegExp('\\b' + typo + '\\b', 'gi');
            corrected = corrected.replace(regex, correction);
        }
        
        // Handle common character substitutions
        corrected = corrected.replace(/(\w)\1{2,}/g, '$1'); // Remove excessive repeated chars
        corrected = corrected.replace(/[0o]/g, 'o'); // Replace 0 with o in words
        corrected = corrected.replace(/[3]/g, 'e'); // Replace 3 with e
        corrected = corrected.replace(/[1]/g, 'i'); // Replace 1 with i in some contexts
        
        return corrected;
    }

    handleVariations(message) {
        // Handle common question variations
        const variations = {
            'what does he do': 'what is his work',
            'what is his job': 'what does he do',
            'tell me more': 'tell me about',
            'can you show': 'show me',
            'i want to know': 'tell me about',
            'more info': 'more information',
            'how to reach': 'contact',
            'get in touch': 'contact',
            'reach out': 'contact',
            'his details': 'about him',
            'background info': 'background',
            'work experience': 'experience',
            'code samples': 'github',
            'source code': 'github'
        };

        for (const [variation, standard] of Object.entries(variations)) {
            if (message.includes(variation)) {
                message = message.replace(variation, standard);
            }
        }

        return message;
    }

    findKeywordMatch(message) {
        const keywordGroups = {
            projects: ['AI Email Generator', 'Parkinson Disease Prediction', 'personal chatbot', 'portfolio website'],
            skills: ['Python', 'JavaScript', 'AWS', 'Machine Learning', 'React', 'Node.js'],
            achievements: ['AWS certified', 'Stanford ML course', 'competitive programming', '8.65 CGPA'],
            contact: ['email', 'LinkedIn', 'GitHub', 'phone number']
        };

        for (const [category, keywords] of Object.entries(keywordGroups)) {
            if (keywords.some(keyword => message.includes(keyword.toLowerCase()))) {
                // Return a response based on the category
                const categoryResponses = {
                    projects: "Trivickram has built some amazing projects! His AI Email Generator has 1k+ users, and his Parkinson's prediction model achieves 98.7% accuracy! Want specific details?",
                    skills: "He's skilled in Python, JavaScript, AWS (certified!), Machine Learning, React, and more! His tech stack is quite comprehensive. What specific skill interests you?",
                    achievements: "His achievements include AWS certification, Stanford ML specialization, top 5% in competitive programming, and maintaining 8.65 CGPA! Quite impressive!",
                    contact: "You can reach Trivickram at trivickramkumar@gmail.com, connect on LinkedIn, or check his GitHub repos! Which contact method works best for you?"
                };
                return categoryResponses[category];
            }
        }

        return null;
    }

    getSmartFallback(message) {
        // Analyze the message for intent clues
        if (message.includes('how') || message.includes('what') || message.includes('when') || message.includes('where')) {
            return {
                text: "That's a great question! 🤔 I'd love to help but I specialize in sharing Trivickram's professional journey. Try asking about his projects, skills, GitHub repos, or contact information!",
                quickReplies: ['Show Projects', 'Technical Skills', 'GitHub Profile', 'Contact Info']
            };
        }

        if (message.includes('help') || message.includes('support') || message.includes('assist')) {
            return {
                text: "I'm here to help you learn about Trivickram! 🚀 I can share details about his AI projects, AWS skills, coding achievements, and how to connect with him. What would you like to explore?",
                quickReplies: ['AI Projects', 'AWS Skills', 'Achievements', 'Contact Details']
            };
        }

        // Default fallback with context awareness
        const response = this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];
        return {
            text: response,
            quickReplies: ['About Trivickram', 'Show Projects', 'Skills & Certifications', 'Fun Facts']
        };
    }

    detectIntent(message) {
        const msg = message.toLowerCase();

        // High-priority overrides: if a specific domain is mentioned, return that first
        if (/(project|projects|repo|repos|repository|repositories|portfolio projects)/.test(msg)) {
            return 'projects';
        }
        if (/(github|gh|git hub|repo links|links|project links)/.test(msg)) {
            return 'github';
        }
        if (/(contact|email|linkedin|phone|reach|connect|get in touch)/.test(msg)) {
            return 'contact';
        }
        if (/(skill|skills|technical|tech stack|technology|languages|frameworks)/.test(msg)) {
            return 'skills';
        }
        if (/(certificate|certification|certified|aws|stanford)/.test(msg)) {
            return 'certifications';
        }

        // Scoring-based fallback across all intents
        const scores = {};
        for (const [intentName, intentData] of Object.entries(this.intents)) {
            const { keywords = [] } = intentData;
            scores[intentName] = keywords.reduce((acc, kw) => acc + (msg.includes(kw) ? 1 : 0), 0);
        }

        // Pick the highest score above 0 with a tie-breaker priority
        const priority = ['projects', 'skills', 'contact', 'certifications', 'github', 'about', 'achievements'];
        let best = null;
        let bestScore = 0;
        for (const intent of Object.keys(scores)) {
            const score = scores[intent];
            if (score > bestScore) {
                best = intent; bestScore = score;
            } else if (score === bestScore && score > 0) {
                // tie-breaker by priority index (lower index wins)
                if (priority.indexOf(intent) < priority.indexOf(best)) {
                    best = intent;
                }
            }
        }
        return bestScore > 0 ? best : null;
    }

    generateIntentResponse(intent) {
        // If the intent is github, repositories, or explicit link request, show projects with links
        if (intent === 'github' || intent === 'repositories' || intent === 'show github' || intent === 'github links' || intent === 'project links' || intent === 'github repositories') {
            return {
                text:
                    `Here are Trivickram's top projects with their GitHub and live links:\n\n` +
                    `🤖 Personal_chatBot: https://github.com/trivickram/Personal_chatBot\n` +
                    `📧 Email-Generator: https://github.com/trivickram/Email-Generator\n` +
                    `🏥 Parkinsons-Disease-prediction: https://github.com/trivickram/Parkinsons-Disease-prediction\n` +
                    `🚀 AI-powered-Self-Healing-CI-CD-pipelines: https://github.com/trivickram/AI-powered-Self-Healing-CI-CD-pipelines\n` +
                    `🌐 Portfolio: https://github.com/trivickram/Portfolio\n` +
                    `\nLive Demos:\n` +
                    `• Portfolio Website: https://trivickram.me\n` +
                    `• VIT BFHL API: https://vit-bfhl-api-kohl.vercel.app\n` +
                    `• Email Generator: (Production app with 1k+ users)\n` +
                    `\nExplore all: https://github.com/trivickram`,
                quickReplies: ['Show Projects', 'GitHub Profile', 'Live Demos', 'Contact Info']
            };
        }
        // If the intent is projects or similar, show only project names
        if (intent === 'projects' || intent === 'show projects' || intent === 'see projects' || intent === 'project list') {
            return {
                text:
                    `Here are some of Trivickram's most popular projects:\n\n` +
                    `🤖 Personal_chatBot\n` +
                    `📧 Email-Generator\n` +
                    `🏥 Parkinsons-Disease-prediction\n` +
                    `🚀 AI-powered-Self-Healing-CI-CD-pipelines\n` +
                    `🌐 Portfolio\n` +
                    `SnackOverflow\n` +
                    `DevNestle\n` +
                    `Parkinsons Predictor\n` +
                    `AI Cold Email Generator`,
                quickReplies: ['GitHub Links', 'Live Demos', 'Contact Info', 'Technical Skills']
            };
        }
        // fallback to original logic for other intents
        const data = this.intents[intent];
        if (data) {
            const template = data.templates[Math.floor(Math.random() * data.templates.length)];
            return {
                text: template,
                quickReplies: data.quickReplies || []
            };
        }
        return {
            text: "I'm not sure about that, but I can tell you about Trivickram's projects, skills, or contact info!",
            quickReplies: ['Show Projects', 'Skills', 'Contact Info']
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
            avatar.innerHTML = '<i class="bx bx-bot"></i>';
        } else {
            avatar.innerHTML = '<i class="bx bx-user"></i>';
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
