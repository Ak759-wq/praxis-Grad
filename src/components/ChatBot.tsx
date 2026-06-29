'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquareCode, X, Send, Sparkles, Sparkle, User, RefreshCw, BarChart3, HelpCircle, Bot, ArrowRight } from 'lucide-react';
import { MOCK_COLLEGES, ScrapedCollege } from '@/lib/mockData';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const [activeCollegeFromUrl, setActiveCollegeFromUrl] = useState<ScrapedCollege | null>(null);

  useEffect(() => {
    if (pathname && pathname.startsWith('/college/')) {
      const id = decodeURIComponent(pathname.replace('/college/', ''));
      const match = Object.values(MOCK_COLLEGES).find(c => {
        const cleanName = c.name.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
        const cleanId = id.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
        return cleanName.includes(cleanId) || cleanId.includes(cleanName);
      });
      if (match) {
        setActiveCollegeFromUrl(match);
      } else {
        setActiveCollegeFromUrl(null);
      }
    } else {
      setActiveCollegeFromUrl(null);
    }
  }, [pathname]);

  const totalColleges = Object.keys(MOCK_COLLEGES).length;



  // Load initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: `👋 Hello! I am your **Praxis Grad Advisor**. I have detailed knowledge of all ${totalColleges} B.Tech alternative tech schools at my fingertips!\n\nAsk me anything about:\n* 💸 **Fees & Hostel costs**\n* 🎓 **Eligibility & Admissions**\n* 👥 **Founders & Backgrounds**\n* 📚 **Syllabus & Coding Hours**\n* 🏫 **Campus Locations**\n* ⚔️ **Side-by-side Comparisons**\n\nTry clicking one of the suggested prompts below, or type your own query!`,
        timestamp: new Date()
      }
    ]);
  }, [totalColleges]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Off-topic keywords
  const offTopicPatterns = [
    /\b(recipe|cook|food|restaurant|weather|sport|cricket|football|movie|film|song|music|bollywood|hollywood|celebrity|actor|actress|politics|politician|election|vote|war|army|military|religion|god|prayer|astrology|horoscope|joke|meme|dating|love|marriage|baby|animal|pet|stock market|crypto|bitcoin|forex|game|pubg|minecraft|roblox)\b/i
  ];

  const isOffTopic = (text: string) => offTopicPatterns.some(p => p.test(text));

  const normalizeText = (text: string) => {
    return text.toLowerCase().trim()
      .replace(/(?!\b\d+\.\d+\b)\./g, "")
      .replace(/[,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
  };

  const getLevenshteinDistance = (a: string, b: string): number => {
    const tmp: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      tmp[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      tmp[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          tmp[i][j] = tmp[i - 1][j - 1];
        } else {
          tmp[i][j] = Math.min(
            tmp[i - 1][j - 1] + 1,
            tmp[i][j - 1] + 1,
            tmp[i - 1][j] + 1
          );
        }
      }
    }
    return tmp[b.length][a.length];
  };

  const matchCollegesTypoTolerant = (query: string): ScrapedCollege[] => {
    const normalized = query.toLowerCase().trim();
    const words = normalized.split(/\s+/).filter(w => w.length >= 3);
    
    const COLLEGE_ALIASES: Record<string, string[]> = {
      "Zenith School of AI": ["zenith", "zeneth", "zapt", "kr mangalam"],
      "Mirai School of Technology": ["mirai", "msot", "mains"],
      "Alta School of Technology": ["alta", "ast"],
      "Bosscoder School of Technology": ["bosscoder", "boss", "bscoder"],
      "NxtWave Institute of Advanced Technology": ["nxtwave", "niat", "ccbp", "nxt wave"],
      "Intellipaat School of Technology (IST)": ["intellipaat", "ist"],
      "Stellar School of Technology": ["stellar", "stelar"],
      "Coding Blocks School of Technology (CBSOT)": ["cbsot", "coding blocks", "coding block", "blocks", "manmohan", "gupta", "cb"],
      "UpGrad School of Technology": ["upgrad", "up grad"],
      "Scaler School of Technology (SST)": ["scaler", "sst", "scaler sst", "anshuman", "singh"],
      "Tensor School of CS and AI": ["tensor", "tensorschool", "algouniversity"],
      "Polaris School of Technology (PST)": ["polaris", "polar", "pst", "polaris school", "mukul", "rustagi"],
      "Newton School of Technology (NST)": ["newton", "nst", "newton school", "siddharth", "maheshwari"],
      "Sunstone School of Technology": ["sunstone", "sun stone"],
      "Masters' Union (MU)": ["masters union", "masters'", "masters", "mu", "rajnish", "prasad"],
      "Leapstart School of Technology": ["leapstart", "leap"],
      "Futurense School of AI": ["futurense", "futurense school", "futur"],
      "100x School": ["100x", "100x school", "harkirat", "harkirt", "kirat"],
      "Vedam School of Technology": ["vedam", "vedan", "chahar", "nishant", "subhesh"],
      "Physics Wallah Institute of Innovation (PW IOI)": ["pw", "ioi", "pwioi", "physics wallah", "physicswallah", "alakh"],
      "CodeQuotient School of Technology (CQST)": ["codequotient", "cqst", "code quotient"],
      "Quad AI School of Technology": ["quad", "quad ai", "quadai"],
      "Veloces Campus": ["veloces", "veloce"],
      "CodingGita": ["codinggita", "gita", "coding gita"]
    };

    const scores: Record<string, number> = {};

    Object.entries(COLLEGE_ALIASES).forEach(([collegeKey, aliases]) => {
      let score = 0;
      
      if (normalized.includes(collegeKey.toLowerCase())) {
        score += 50;
      }
      
      aliases.forEach(alias => {
        if (normalized.includes(alias.toLowerCase())) {
          score += 20;
        }
        
        words.forEach(word => {
          alias.split(/\s+/).forEach(aliasWord => {
            if (word === aliasWord) {
              score += 15;
            } else if (aliasWord.length >= 4 && word.length >= 4) {
              if (aliasWord.includes(word) || word.includes(aliasWord)) {
                score += 10;
              } else {
                const dist = getLevenshteinDistance(word, aliasWord);
                if (dist <= 1) {
                  score += 8;
                } else if (dist === 2 && word.length >= 6) {
                  score += 5;
                }
              }
            }
          });
        });
      });

      if (score > 0) {
        scores[collegeKey] = score;
      }
    });

    const matchedKeys = Object.entries(scores)
      .filter(([_, score]) => score >= 5)
      .sort((a, b) => b[1] - a[1])
      .map(([key, _]) => key);

    const matchedColleges: ScrapedCollege[] = [];
    matchedKeys.forEach(key => {
      const mockKey = Object.keys(MOCK_COLLEGES).find(k => k.toLowerCase() === key.toLowerCase()) 
        || Object.keys(MOCK_COLLEGES).find(k => k.toLowerCase().includes(key.toLowerCase()))
        || key;
      const coll = MOCK_COLLEGES[mockKey];
      if (coll) {
        matchedColleges.push(coll);
      }
    });

    return matchedColleges;
  };

  const handleQuery = async (query: string) => {
    setIsTyping(true);

    if (isOffTopic(query)) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`, sender: 'ai' as const, timestamp: new Date(),
          text: `🎓 I'm specialized in helping students explore tech colleges and engineering careers!\n\nThat question seems to be outside my area. I'd love to help you with:\n* 💸 **College fees & hostel costs**\n* 🎓 **Admission criteria & entrance exams**\n* 👥 **Founders & faculty backgrounds**\n* 📚 **Curriculum & coding hours**\n* ⚔️ **Side-by-side college comparisons**\n\nWhat would you like to know about India's best tech schools?`
        }]);
        setIsTyping(false);
      }, 600);
      return;
    }

    try {
      // 1. Try fetching from the Gemini /api/chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, { id: 'temp', sender: 'user', text: query, timestamp: new Date() }].map(m => ({
            sender: m.sender,
            text: m.text
          })),
          activeCollege: activeCollegeFromUrl
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.text) {
          setMessages(prev => [...prev, {
            id: `ai-${Date.now()}`,
            sender: 'ai' as const,
            text: data.text,
            timestamp: new Date()
          }]);
          setIsTyping(false);
          return;
        }
      }
    } catch (apiErr) {
      console.warn("API Chat route failed or key not configured. Falling back to local offline engine:", apiErr);
    }

    // 2. Offline high-fidelity fallback engine
    setTimeout(() => {
      try {
        const normalized = normalizeText(query);
        
        const isGreeting = /\b(hi|hello|hey|greetings|hola|gm|ge|good\s+morning|good\s+afternoon|good\s+evening|whats\s*up|who\s+are\s+you|what\s+can\s+you\s+do|help|features|info)\b/i.test(normalized);
        const isFarewell = /\b(thanks|thank\s+you|thankyou|bye|goodbye|see\s+ya|awesome|cool|nice|great|helpful|superb|perfect)\b/i.test(normalized);
        const isCareerFAQ = /\b(worth\s*it|career|guarantee|traditional|alternative|degree|choose|why\s+join|why\s+enroll|college\s+vs|tech\s+school\s+vs)\b/i.test(normalized);

        let mentionedColleges = matchCollegesTypoTolerant(query);

        if (mentionedColleges.length === 0 && activeCollegeFromUrl) {
          mentionedColleges = [activeCollegeFromUrl];
        }

        let responseText = "";

        if (isGreeting) {
          responseText = `👋 **Hello! I am your Praxis Grad Advisor.**\n\nI have detailed, official knowledge of all **B.Tech alternative tech schools and academies** (like Scaler SST, Newton NST, Polaris PST, 100x School, CBSOT, PW IOI, etc.).\n\nYou can ask me questions like:\n* 💸 **Fees**: *"What are the fees of Scaler SST?"* or *"Compare tuition fees"*\n* 💼 **Placements**: *"Tell me about Polaris placements"* or *"Which college offers internships?"*\n* 📚 **Curriculum**: *"Show me the syllabus for 100x School"* or *"What is taught in Year 1?"*\n* 👥 **Founders**: *"Who founded Vedam School?"* or *"Who is Harkirat Singh?"*\n* 💻 **Laptops**: *"Which schools provide MacBooks?"*\n* ⚔️ **Comparisons**: *"Compare Polaris and Zenith"* or *"Compare all colleges"*`;
        } 
        else if (isFarewell) {
          responseText = `You're very welcome! I'm glad I could help you navigate your options. 😊\n\nBest of luck with your tech and engineering journey! If you need anything else, just type a question. 🚀`;
        }
        else if (isCareerFAQ) {
          responseText = `🎓 **B.Tech Alternative Tech Schools vs. Traditional Engineering Colleges**\n\nTraditional engineering programs often focus on outdated theory, have crowded lectures, and offer minimal coding practice.\n\n**Alternative tech schools (e.g. Scaler, Newton, Polaris, Kalvium)** operate differently:\n* 💻 **Coding-First**: You spend 800+ hours coding, building production systems, and practicing DSA.\n* 💼 **Immersive Internships**: Includes **6-month to 2-year paid internships** (with stipends up to ₹2.5 Lakhs/month at Polaris PST).\n* 👥 **Industry Mentors**: Learn directly from ex-FAANG engineers and active tech founders.\n* 🎓 **Accredited Degrees**: Partner with UGC-approved universities (like GLA, KR Mangalam, Rishihood) to provide accredited B.Tech/BSc degrees alongside their technical syllabus.\n\n**How to choose?**\n* If you want a **budget-friendly option**, check **CodingGita** (₹9.52L total) or **PW IOI** (₹8.46L-9.9L total).\n* If you want **premium placements & MacBooks**, check **Polaris PST**, **Newton NST**, or **Bosscoder**.\n* If you want **full-stack & open-source scaling**, check **100x School** (₹22.8L tuition + ₹6.8L hostel = ₹29.6L total).`;
        }
        else if ((normalized.includes("compare") || normalized.includes("versus") || normalized.includes("vs") || normalized.includes("difference")) && mentionedColleges.length >= 2) {
          const c1 = mentionedColleges[0];
          const c2 = mentionedColleges[1];
          responseText  = `### ⚔️ Side-by-Side Comparison Matrix\n\nHere is a quick overview of **${c1.name}** vs **${c2.name}**:\n\n`;
          responseText += `| Feature | ${c1.name.split(' (')[0]} | ${c2.name.split(' (')[0]} |\n`;
          responseText += `| :--- | :--- | :--- |\n`;
          responseText += `| **Location** | ${c1.location.split(' (')[0]} | ${c2.location.split(' (')[0]} |\n`;
          responseText += `| **Academic Fees** | ${c1.fees.split(' (')[0]} | ${c2.fees.split(' (')[0]} |\n`;
          responseText += `| **Degree Partner** | ${c1.degree_partner} | ${c2.degree_partner} |\n`;
          responseText += `| **Eligibility** | ${c1.eligibility.split(' + ')[0]} | ${c2.eligibility.split(' + ')[0]} |\n\n`;
          responseText += `📚 **Curriculum focus**:\n* **${c1.name.split(' (')[0]}**: ${c1.curriculum_summary.slice(0, 120)}...\n* **${c2.name.split(' (')[0]}**: ${c2.curriculum_summary.slice(0, 120)}...\n\n👉 You can add both to your **Compare Bucket** for a full year-wise breakdown!`;
        }
        else if (normalized.includes("compare") || normalized.includes("comparison") || normalized.includes("versus") || normalized.includes("vs")) {
          responseText = `### ⚔️ Core Tech Schools Comparison Matrix\n\nHere is a side-by-side overview of five of the leading alternative B.Tech colleges:\n\n| Feature | Scaler SST | Newton NST | Polaris PST | 100x School | CBSOT |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Fees** | ₹15-18L | ₹18-20L | ₹16-19L | ₹29.6L (incl. hostel) | ₹20-23L |\n| **Location** | Bangalore | Sonipat/NCR | Bangalore | Delhi NCR | Noida/NCR |\n| **Degree** | BSc/MSc (BITS) | B.Tech (GDU) | B.Tech (Medhavi) | B.Tech (Partner) | B.Tech (Partner) |\n| **Laptop** | BYOD | MacBook Air | MacBook Pro | BYOD | BYOD |\n| **Internship**| 1 Year Paid | 6 Months Paid | Up to 2.5L/mo | Core DSA/Dev | Coding/DSA |\n\n*Add colleges to your compare bucket in the sidebar for year-wise details!*`;
        }
        else if (mentionedColleges.length >= 1) {
          const college = mentionedColleges[0];
          const cName = college.name;

          if (normalized.includes("fee") || normalized.includes("cost") || normalized.includes("price") || normalized.includes("lakh") || normalized.includes("tuition")) {
            if (cName.includes("100x")) {
              responseText = `💸 **Fee Structure for 100x School**:\n\n* **Academic Fees**: ₹22.8 Lakhs (Tuition) + ₹6.8 Lakhs (Hostel) = **₹29.6 Lakhs total**.\n* **Affiliation**: UGC Recognized Partner University.\n\nThis provides a highly specialized environment for web development and software engineering.`;
            } else if (cName.includes("Coding Blocks") || cName.includes("CBSOT")) {
              responseText = `💸 **Fee Structure for Coding Blocks School of Technology (CBSOT)**:\n\n* **Academic Fees**: **₹20 to ₹23 Lakhs total** depending on tracks and options.\n* **Affiliation**: UGC Recognized Partner University.`;
            } else {
              responseText = `💸 **Fee Structure for ${cName}**:\n\n* **Fees**: ${college.fees}\n* **Affiliation**: ${college.degree_partner}\n\nFor the most current fee breakdown and available discounts, I recommend checking the college's official brochure or website.`;
            }
          } 
          else if (normalized.includes("hostel") || normalized.includes("accommodation") || normalized.includes("stay") || normalized.includes("residential") || normalized.includes("mess") || normalized.includes("room")) {
            if (cName.includes("100x")) {
              responseText = `🏠 **Hostel & Residential Info for 100x School**:\n\n* **Hostel Fee**: ₹6.8 Lakhs (Mandatory residential lodging & food).\n* **Tuition Fee**: ₹22.8 Lakhs.\n* **Total Cost**: ₹29.6 Lakhs total.`;
            } else {
              responseText = `🏠 **Hostel & Residential Info for ${cName}**:\n\n* **Location/Campus**: ${college.location}\n* **Fees/Financing Info**: ${college.fees}\n* **Details**: ${college.financingOptions || "Financing options and loans available."}`;
            }
          } 
          else if (normalized.includes("founder") || normalized.includes("founded") || normalized.includes("built") || normalized.includes("creator") || normalized.includes("behind") || normalized.includes("singh") || normalized.includes("harkirat") || normalized.includes("manmohan")) {
            const foundersStr = college.founders && college.founders.length > 0
              ? college.founders.map(f => `* **${f.name}**: ${f.background_info}`).join("\n")
              : `* Co-founders and academic directors representing ${cName} officially.`;
            responseText = `👥 **Founders & Leadership behind ${cName}**:\n\n${foundersStr}`;
          } 
          else if (normalized.includes("eligibility") || normalized.includes("admission") || normalized.includes("apply") || normalized.includes("jee") || normalized.includes("entrance") || normalized.includes("exam") || normalized.includes("test") || normalized.includes("pattern") || normalized.includes("syllabus") || normalized.includes("dates")) {
            responseText = `🎓 **Admissions & Eligibility for ${cName}**:\n\n* **Requirements**: ${college.eligibility}\n* **Entrance Exam**: ${college.entranceExam?.pattern || "Online Assessment / Aptitude Evaluation"}\n* **Exam Level**: ${college.entranceExam?.level || "Institute / National Level"}\n* **Syllabus**: ${college.entranceExam?.syllabus || "Aptitude, logical reasoning, and basic coding/math logic."}\n* **Dates**: ${college.examDates || "Check the official portal for upcoming cycles."}\n* **Contact**: \`${college.contact_info || "admissions@" + cName.toLowerCase().replace(/\s/g, "").replace(/[()]/g, "") + ".com"}\``;
          } 
          else if (normalized.includes("curriculum") || normalized.includes("syllabus") || normalized.includes("course") || normalized.includes("year") || normalized.includes("learn") || normalized.includes("subject")) {
            responseText = `📚 **Curriculum Breakdown for ${cName}**:\n\n* **Core Focus**: ${college.curriculum_summary}\n\n**Year-by-Year Roadmap**:\n* 🔴 **Year 1**: ${college.year_1_curriculum || "Coding & CS basics"}\n* 🟢 **Year 2**: ${college.year_2_curriculum || "Advanced DSA & full-stack development"}\n* 🔵 **Year 3**: ${college.year_3_curriculum || "AI engineering & specialized topics"}\n* 🟡 **Year 4**: ${college.year_4_curriculum || "Capstone project & paid internships"}`;
          } 
          else if (normalized.includes("mentor") || normalized.includes("instructor") || normalized.includes("faculty") || normalized.includes("teacher") || normalized.includes("expert")) {
            const mentorStr = college.instructors && college.instructors.length > 0
              ? college.instructors.map(inst => `* **${inst.name}** (${inst.company_background})`).join("\n")
              : `* Tier-1 industry mentors and expert software engineering coaches.`;
            responseText = `👔 **Elite Faculty & Mentorship at ${cName}**:\n\n${mentorStr}`;
          } 
          else if (normalized.includes("placement") || normalized.includes("review") || normalized.includes("stipend") || normalized.includes("salary") || normalized.includes("job") || normalized.includes("internship") || normalized.includes("package") || normalized.includes("recruit")) {
            if (cName.includes("Polaris") || cName.includes("PST")) {
              responseText = `💼 **Placements & Internships at Polaris PST**:\n\n* **Hiring Network**: Dedicated placement cell backed by **200+ hiring partners**.\n* **Internships**: Features mandatory Year 3 paid internships offering stipends of **up to ₹2.5 Lakhs/month**.\n* **Student Review**: "Highly rated for practical project delivery."`;
            } else {
              const rev = college.reviews && college.reviews.length > 0 ? college.reviews[0] : { rating: 4.5, review_text: "Highly rated for practical project delivery." };
              responseText = `💼 **Placements & Reviews for ${cName}**:\n\n* **Student Review (${rev.rating} ★)**: "${rev.review_text}"\n* **Hiring Network**: Dedicated placement cell backed by **${college.hiring_partners_count || "100+"} hiring partners**.\n* **Internship Opportunities**: Immersive industry prep featuring paid internships.`;
            }
          } 
          else if (normalized.includes("laptop") || normalized.includes("macbook") || normalized.includes("pc") || normalized.includes("mac")) {
            const laptopStatus = college.laptop_provided ? `Yes, a laptop/device is provided: **${college.laptop_provided}**.` : `No specific laptop is provided. Typically students follow a BYOD (Bring Your Own Device) policy.`;
            responseText = `💻 **Laptop Provision at ${cName}**:\n\n* **Status**: ${laptopStatus}`;
          } 
          else if (normalized.includes("location") || normalized.includes("campus") || normalized.includes("city") || normalized.includes("where")) {
            responseText = `📍 **Campus Location for ${cName}**:\n\n* **Location/Address**: ${college.location}\n* **Degree Partner**: ${college.degree_partner}`;
          } 
          else if (normalized.includes("club") || normalized.includes("society") || normalized.includes("extracurricular")) {
            const clubs = college.studentClubs && college.studentClubs.length > 0
              ? college.studentClubs.map(c => `* **${c}**`).join("\n")
              : "No specific student clubs are listed in the official brochure for this college.";
            responseText = `🤝 **Student Clubs & Societies at ${cName}**:\n\n${clubs}`;
          } 
          else {
            responseText = `🏫 **Overview of ${cName}**:\n\n* **Campus**: ${college.location}\n* **Fees**: ${college.fees}\n* **Eligibility**: ${college.eligibility}\n* **Degree Partner**: ${college.degree_partner}\n* **Overview**: ${college.curriculum_summary.slice(0, 200)}...\n\nAsk me about **fees**, **founders**, **curriculum**, **laptops** or **placements** for more details!`;
          }
        } 
        else {
          if (normalized.includes("stipend") || normalized.includes("internship") || normalized.includes("highest salary") || normalized.includes("placement") || normalized.includes("salary")) {
            responseText = `💼 **High-Paying Internships & Placements**:\n\n* **Polaris PST**: Up to **₹2.5 Lakhs/month stipend** during year 3 internships.\n* **Scaler SST**: Mandatory 1-year full-time paid internship at top product companies.\n* **Newton NST**: 6-month paid internship with global immersion (Silicon Valley/Singapore).\n* **Kalvium**: 21-month paid internship starting from the 2nd year.`;
          } else if (normalized.includes("ai") || normalized.includes("artificial intelligence") || normalized.includes("ml") || normalized.includes("machine learning")) {
            responseText = `🤖 **AI-Native & Specialized CS/AI Colleges**:\n\n1. **Zenith School of AI**: B.Tech in AI with embedded Mini-MBA (KR Mangalam University).\n2. **Newton School of Technology**: AI-first curriculum from Year 1.\n3. **Polaris School of Technology**: Applied AI Engineering specialization.\n4. **Quad AI School of Technology**: Applied AI & Machine Learning focus.`;
          } else if (normalized.includes("cheap") || normalized.includes("lowest") || normalized.includes("budget") || normalized.includes("affordable") || normalized.includes("fee") || normalized.includes("cost") || normalized.includes("price") || normalized.includes("lakh")) {
            responseText = `💸 **Most Affordable B.Tech Alternatives (lowest to highest)**:\n\n1. **CodingGita**: **₹9.52 Lakhs** total (Swaminarayan Univ + CodingGita fees with a 100% placement refund guarantee).\n2. **Physics Wallah (PW IOI)**: **₹8.46–9.9 Lakhs** total.\n3. **Quad AI**: **₹8.02–14 Lakhs** total depending on campus.\n4. **Veloces Campus**: **₹10.5–14 Lakhs** total.\n5. **Mirai School of Technology**: **₹10.8 Lakhs** total.\n6. **Coding Blocks (CBSOT)**: **₹20 to ₹23 Lakhs** total.\n7. **100x School**: **₹22.8 Lakhs** (Tuition) + **₹6.8 Lakhs** (Hostel) = **₹29.6 Lakhs** total.`;
          } else if (normalized.includes("laptop") || normalized.includes("macbook") || normalized.includes("pc") || normalized.includes("mac")) {
            responseText = `💻 **Laptops & MacBooks Provided**:\n\n* **Bosscoder Academy**: Provides a **MacBook Air** to students.\n* **Newton School**: Provides a **MacBook Air** to students.\n* **Polaris (PST)**: Provides a **MacBook Pro** to students.\n* **Vedam School**: Provides a **Lenovo ThinkPad** to students.\n* **PW IOI**: MacBook is included in their residential packages.`;
          } else if (normalized.includes("hostel") || normalized.includes("accommodation") || normalized.includes("stay") || normalized.includes("residential") || normalized.includes("room")) {
            responseText = `🏠 **Hostel & Residential Info**:\n\n* Most B.Tech alternative tech schools offer fully residential/hostel facilities, often managed in partnership with major housing providers or partner universities (e.g. ADYPU, Rishihood, Medhavi Skills).\n* Hostels typically range from **₹90K/year to ₹2.4L/year** depending on single/double occupancy, AC/Non-AC options, and mess preferences.`;
          } else if (normalized.includes("location") || normalized.includes("address") || normalized.includes("where") || normalized.includes("campus") || normalized.includes("city")) {
            responseText = `📍 **Major Tech School Hubs & Locations**:\n\n* **Electronic City, Bangalore**: Scaler SST, Polaris PST, Tensor School, Futurense.\n* **Delhi NCR / Noida / Gurugram**: Masters' Union, Zenith School of AI, Coding Blocks, PW IOI, Newton NST.\n* **Pune, Maharashtra**: Vedam School, Veloces Campus, Stellar School, Intellipaat.\n* **Gandhinagar, Gujarat**: CodingGita.`;
          } else if (normalized.includes("club") || normalized.includes("society") || normalized.includes("extracurricular")) {
            responseText = `🤝 **Colleges Providing Active Student Clubs**:\n\n* **Newton NST**: Active robotics, gaming, and developer clubs.\n* **Polaris PST**: Custom builder clubs, developer guilds, sports circles.\n* **Scaler SST**: Codechef chapters, DSA clubs, cultural & hiking societies.\n* **Masters' Union**: Management, product design, and venture clubs.`;
          } else if (normalized.includes("exam") || normalized.includes("entrance") || normalized.includes("admission") || normalized.includes("test") || normalized.includes("jee")) {
            responseText = `🎓 **Admissions & Entrance Exams Summary**:\n\n* **Scaler SST**: Evaluates logic/aptitude via National School of Technology Entrance Test (**NSET**).\n* **Newton NST**: Admission via Newton Scholastic Aptitude Test (**NSAT**).\n* **Zenith School**: Direct ZAPT (Zenith AI Proficiency Test). Direct admissions (ZAPT bypass) for JEE ≥ 92 percentile.`;
          } else {
            const keywordsInQuery = normalized.split(/\s+/).filter(w => w.length > 3);
            const collegesList = Object.values(MOCK_COLLEGES);
            const matches = collegesList.filter(c => {
              const searchStr = `${c.name} ${c.location} ${c.eligibility} ${c.curriculum_summary} ${c.degree_partner} ${c.tags.join(' ')}`.toLowerCase();
              return keywordsInQuery.some(word => searchStr.includes(word));
            });

            if (matches.length > 0) {
              responseText = `🔍 Here are the institutions matching your query:\n\n` + 
                matches.map(c => `* **${c.name}**: ${c.location.split(' (')[0]} - ${c.curriculum_summary.slice(0, 120)}...`).join('\n\n') +
                `\n\nAsk me specific questions like *"What is the curriculum of ${matches[0].name.split(' (')[0]}?"* for more details!`;
            } else {
              responseText = `🤔 I couldn't find a specific match for that query.\n\nI don't have that specific information right now, but I recommend checking the college's official brochure or website for accurate details.\n\nOr try asking:\n* *"What are the fees for Polaris?"*\n* *"Which college has the lowest fees?"*\n* *"Who founded Vedam School of Technology?"*\n* *"Compare Scaler and Newton School"*`;
            }
          }
        }

        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`, sender: 'ai' as const, text: responseText, timestamp: new Date()
        }]);
        setIsTyping(false);

      } catch (error) {
        console.error('ChatBot processing error:', error);
        setMessages(prev => [...prev, {
          id: `ai-error-${Date.now()}`, sender: 'ai' as const, timestamp: new Date(),
          text: `⚠️ I'm having trouble connecting right now, please try again in a moment.`
        }]);
        setIsTyping(false);
      }
    }, 900);
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    
    if (!textToSend) {
      setInputMessage('');
    }

    handleQuery(text);
  };

  useEffect(() => {
    const handleTriggerMessage = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setIsOpen(true);
      setTimeout(() => {
        handleSend(customEvent.detail);
      }, 300);
    };
    window.addEventListener('trigger-chatbot-query', handleTriggerMessage);
    return () => window.removeEventListener('trigger-chatbot-query', handleTriggerMessage);
  }, [messages, inputMessage]);

  const formatMessageText = (text: string) => {
    const applyMarkdown = (str: string) => {
      let formatted = str;
      // Replace bold **text**
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Replace italic *text* (using em with italic class for absolute safety)
      formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
      // Replace code `text`
      formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-neutral-900 px-1 py-0.5 rounded text-violet-400 font-mono text-[11px]">$1</code>');
      // Replace markdown links [text](url)
      formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-violet-400 hover:underline font-semibold">$1</a>');
      return formatted;
    };

    return text.split('\n').map((line, lineIdx) => {
      const trimmed = line.trim();
      
      // 1. Bullet list item check
      if (trimmed.startsWith('* ')) {
        const content = trimmed.slice(2);
        const html = applyMarkdown(content);
        return (
          <li key={lineIdx} className="ml-4 list-disc text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mt-1" 
              dangerouslySetInnerHTML={{ __html: html }} />
        );
      }

      // 2. Numbered list item check
      if (/^\d+\.\s/.test(trimmed)) {
        const matches = trimmed.match(/^(\d+)\.\s(.*)/);
        if (matches) {
          const html = applyMarkdown(matches[2]);
          return (
            <li key={lineIdx} className="ml-4 list-decimal text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mt-1" 
                dangerouslySetInnerHTML={{ __html: html }} />
          );
        }
      }

      // 3. Table row check
      if (trimmed.startsWith('|')) {
        const cols = line.split('|').map(c => c.trim()).filter(Boolean);
        if (cols.length > 0) {
          if (cols[0].includes('---') || cols[0].includes(':---')) return null;
          const isHeader = lineIdx === 2 || lineIdx === 0;
          const htmlCols = cols.map(col => applyMarkdown(col));
          return (
            <div key={lineIdx} className={`grid grid-cols-3 gap-2 py-1.5 px-2 text-[11px] sm:text-xs border-b border-white/5 ${isHeader ? 'font-bold text-violet-400 bg-white/5' : 'text-neutral-300 bg-neutral-950/20'}`}>
              {htmlCols.map((col, cIdx) => (
                <div key={cIdx} dangerouslySetInnerHTML={{ __html: col }} />
              ))}
            </div>
          );
        }
      }

      // 4. Header check
      if (trimmed.startsWith('### ')) {
        const html = applyMarkdown(trimmed.slice(4));
        return <h4 key={lineIdx} className="text-xs font-bold uppercase tracking-wider text-violet-400 mt-3 mb-1" dangerouslySetInnerHTML={{ __html: html }} />;
      }

      // 5. Default paragraph
      if (!trimmed) return null;
      const html = applyMarkdown(line);
      return (
        <p key={lineIdx} className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-2" 
           dangerouslySetInnerHTML={{ __html: html }} />
      );
    }).filter(Boolean);
  };


  return (
    <>
      {/* Floating Glowing Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-11 items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 select-none cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_32px_rgba(139,92,246,0.3)] border border-white/10 backdrop-blur-md px-5 py-2.5 ${
          isOpen 
            ? 'rounded-full bg-neutral-950 text-white' 
            : 'rounded-2xl bg-gradient-to-r from-[#113133]/90 via-[#401f4a]/85 to-[#161a29]/90 text-white'
        }`}
        title="Open AI College Advisor"
        id="ai-chatbot-trigger"
      >
        {isOpen ? (
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-white" />
            <span className="text-xs font-bold tracking-wider text-white uppercase">Close</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4.5 w-4.5 text-white" />
            <span className="text-xs font-semibold tracking-wide text-white drop-shadow-[0_1.5px_2.5px_rgba(0,0,0,0.9)]">Ask Spacious AI</span>
          </div>
        )}
      </button>

      {/* Glassmorphic Chat Panel Overlay Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-24 z-50 w-auto sm:w-[420px] max-w-md h-[500px] sm:h-[550px] rounded-3xl border border-white/10 bg-neutral-950/80 p-0 shadow-[0_30px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl animate-bounce-in flex flex-col justify-between overflow-hidden">
          {/* Top header ambient glow */}
          <div className="absolute top-0 left-0 right-0 h-[85px] bg-gradient-to-b from-violet-500/15 to-transparent pointer-events-none z-0" />

          {/* Header */}
          <div className="flex items-center justify-between bg-white/[0.01] px-4 py-4 border-b border-white/5 relative z-10 select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 shadow-inner">
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-neutral-950 animate-ping" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-neutral-950" />
              </div>
              <div>
                <p className="text-xs font-black text-white tracking-wide leading-tight">Praxis Grad Advisor</p>
                <span className="text-[9.5px] text-emerald-400 font-extrabold tracking-wider flex items-center gap-1 mt-0.5">
                  LIVE ADVISOR BOT
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-white rounded-lg p-1.5 hover:bg-white/5 transition-all cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages Body */}
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent relative z-10"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 items-end ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar (Hidden on User for cleaner look) */}
                {msg.sender === 'ai' && (
                  <div className="h-7 w-7 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 flex items-center justify-center shrink-0 shadow-inner">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                )}

                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed border ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 border-violet-500/20 text-slate-100 rounded-br-sm shadow-sm'
                    : 'bg-white/[0.02] border-white/5 text-slate-200 rounded-bl-sm'
                }`}>
                  {formatMessageText(msg.text)}
                  <span className="block text-[8.5px] text-neutral-500 mt-2 text-right font-semibold">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Bouncing Typing Animation bubbles */}
            {isTyping && (
              <div className="flex gap-3 items-end">
                <div className="h-7 w-7 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 flex items-center justify-center shrink-0 shadow-inner">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-white/[0.02] border border-white/5 flex items-center gap-1.5 w-16 justify-center">
                  <span className="h-1.5 w-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>


          {/* Bottom input area */}
          <div className="p-4 bg-black/90 border-t border-white/5 flex items-center gap-3 relative z-10">
            <input
              type="text"
              placeholder="Ask fees, founders, syllabus, comparisons..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              className="flex-grow rounded-xl border border-white/10 bg-neutral-950/80 px-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition-all focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputMessage.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white transition-all hover:bg-violet-500 active:scale-95 disabled:bg-neutral-850 disabled:text-neutral-600 border border-violet-500/30 cursor-pointer"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
