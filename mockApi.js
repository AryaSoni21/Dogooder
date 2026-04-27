// VolunteerFit - Persistent Mock Database using localStorage
// All data survives page reloads. Auth uses username + password credentials.

const ZONES = ["North", "South", "East", "West", "Central"];
const SKILLS = [
  "First Aid", "Medical Assistance", "Teaching", "Disaster Relief",
  "Food Distribution", "Logistics Support", "Driving",
  "Crowd Management", "Counseling", "Technical Support",
  "Data Entry", "Rescue Operations", "Event Coordination",
  "Communication & Outreach"
];
const TIME_SLOTS = ["Morning", "Afternoon", "Evening"];

// ─────────────────────────────────────────────
// REAL SEED DATA — 40 actual Indian volunteers
// ─────────────────────────────────────────────
const SEED_VOLUNTEERS = [
  {
    id: "vol_001", name: "Priya Sharma", phone: "+91 9876543201",
    zone: "North", skills: [{ name: "First Aid", level: "verified" }, { name: "Medical Assistance", level: "verified" }, { name: "Counseling", level: "self" }],
    availability: ["Morning", "Afternoon"], hours_assigned: 4, tasks: [],
    username: "priya.sharma", password: "priya123",
    email: "priya.sharma@gmail.com", age: 26, city: "Delhi"
  },
  {
    id: "vol_002", name: "Arjun Mehta", phone: "+91 9876543202",
    zone: "South", skills: [{ name: "Driving", level: "verified" }, { name: "Logistics Support", level: "endorsed" }, { name: "Food Distribution", level: "self" }],
    availability: ["Afternoon", "Evening"], hours_assigned: 6, tasks: [],
    username: "arjun.mehta", password: "arjun123",
    email: "arjun.mehta@gmail.com", age: 30, city: "Mumbai"
  },
  {
    id: "vol_003", name: "Kavya Nair", phone: "+91 9876543203",
    zone: "East", skills: [{ name: "Teaching", level: "endorsed" }, { name: "Communication & Outreach", level: "verified" }, { name: "Data Entry", level: "self" }],
    availability: ["Morning"], hours_assigned: 2, tasks: [],
    username: "kavya.nair", password: "kavya123",
    email: "kavya.nair@gmail.com", age: 24, city: "Kochi"
  },
  {
    id: "vol_004", name: "Rahul Verma", phone: "+91 9876543204",
    zone: "West", skills: [{ name: "Rescue Operations", level: "verified" }, { name: "Disaster Relief", level: "verified" }, { name: "First Aid", level: "endorsed" }],
    availability: ["Morning", "Evening"], hours_assigned: 9, tasks: [],
    username: "rahul.verma", password: "rahul123",
    email: "rahul.verma@gmail.com", age: 32, city: "Ahmedabad"
  },
  {
    id: "vol_005", name: "Sneha Patel", phone: "+91 9876543205",
    zone: "Central", skills: [{ name: "Food Distribution", level: "verified" }, { name: "Event Coordination", level: "endorsed" }, { name: "Crowd Management", level: "self" }],
    availability: ["Afternoon", "Evening"], hours_assigned: 3, tasks: [],
    username: "sneha.patel", password: "sneha123",
    email: "sneha.patel@gmail.com", age: 28, city: "Bhopal"
  },
  {
    id: "vol_006", name: "Vikram Singh", phone: "+91 9876543206",
    zone: "North", skills: [{ name: "Crowd Management", level: "endorsed" }, { name: "Rescue Operations", level: "self" }, { name: "Driving", level: "verified" }],
    availability: ["Evening"], hours_assigned: 11, tasks: [],
    username: "vikram.singh", password: "vikram123",
    email: "vikram.singh@gmail.com", age: 35, city: "Chandigarh"
  },
  {
    id: "vol_007", name: "Ananya Krishnan", phone: "+91 9876543207",
    zone: "South", skills: [{ name: "Counseling", level: "verified" }, { name: "Teaching", level: "verified" }, { name: "Communication & Outreach", level: "endorsed" }],
    availability: ["Morning", "Afternoon"], hours_assigned: 5, tasks: [],
    username: "ananya.krishnan", password: "ananya123",
    email: "ananya.krishnan@gmail.com", age: 29, city: "Chennai"
  },
  {
    id: "vol_008", name: "Rohan Gupta", phone: "+91 9876543208",
    zone: "East", skills: [{ name: "Technical Support", level: "verified" }, { name: "Data Entry", level: "endorsed" }, { name: "Logistics Support", level: "self" }],
    availability: ["Afternoon"], hours_assigned: 7, tasks: [],
    username: "rohan.gupta", password: "rohan123",
    email: "rohan.gupta@gmail.com", age: 27, city: "Kolkata"
  },
  {
    id: "vol_009", name: "Meera Iyer", phone: "+91 9876543209",
    zone: "West", skills: [{ name: "Medical Assistance", level: "verified" }, { name: "First Aid", level: "endorsed" }, { name: "Disaster Relief", level: "self" }],
    availability: ["Morning", "Evening"], hours_assigned: 1, tasks: [],
    username: "meera.iyer", password: "meera123",
    email: "meera.iyer@gmail.com", age: 31, city: "Pune"
  },
  {
    id: "vol_010", name: "Aditya Joshi", phone: "+91 9876543210",
    zone: "Central", skills: [{ name: "Event Coordination", level: "verified" }, { name: "Communication & Outreach", level: "verified" }, { name: "Crowd Management", level: "endorsed" }],
    availability: ["Morning", "Afternoon", "Evening"], hours_assigned: 0, tasks: [],
    username: "aditya.joshi", password: "aditya123",
    email: "aditya.joshi@gmail.com", age: 23, city: "Nagpur"
  },
  {
    id: "vol_011", name: "Divya Reddy", phone: "+91 9876543211",
    zone: "South", skills: [{ name: "Food Distribution", level: "endorsed" }, { name: "Logistics Support", level: "verified" }, { name: "Data Entry", level: "self" }],
    availability: ["Morning"], hours_assigned: 8, tasks: [],
    username: "divya.reddy", password: "divya123",
    email: "divya.reddy@gmail.com", age: 25, city: "Hyderabad"
  },
  {
    id: "vol_012", name: "Karan Malhotra", phone: "+91 9876543212",
    zone: "North", skills: [{ name: "Driving", level: "endorsed" }, { name: "Rescue Operations", level: "verified" }, { name: "Disaster Relief", level: "endorsed" }],
    availability: ["Evening", "Afternoon"], hours_assigned: 12, tasks: [],
    username: "karan.malhotra", password: "karan123",
    email: "karan.malhotra@gmail.com", age: 34, city: "Ludhiana"
  },
  {
    id: "vol_013", name: "Nisha Tiwari", phone: "+91 9876543213",
    zone: "East", skills: [{ name: "Counseling", level: "endorsed" }, { name: "Teaching", level: "self" }, { name: "Communication & Outreach", level: "self" }],
    availability: ["Afternoon", "Evening"], hours_assigned: 3, tasks: [],
    username: "nisha.tiwari", password: "nisha123",
    email: "nisha.tiwari@gmail.com", age: 27, city: "Patna"
  },
  {
    id: "vol_014", name: "Suresh Babu", phone: "+91 9876543214",
    zone: "South", skills: [{ name: "Medical Assistance", level: "endorsed" }, { name: "First Aid", level: "verified" }, { name: "Counseling", level: "verified" }],
    availability: ["Morning", "Afternoon"], hours_assigned: 6, tasks: [],
    username: "suresh.babu", password: "suresh123",
    email: "suresh.babu@gmail.com", age: 38, city: "Bengaluru"
  },
  {
    id: "vol_015", name: "Pooja Saxena", phone: "+91 9876543215",
    zone: "West", skills: [{ name: "Technical Support", level: "self" }, { name: "Data Entry", level: "verified" }, { name: "Event Coordination", level: "self" }],
    availability: ["Morning"], hours_assigned: 2, tasks: [],
    username: "pooja.saxena", password: "pooja123",
    email: "pooja.saxena@gmail.com", age: 22, city: "Vadodara"
  },
  {
    id: "vol_016", name: "Manish Kumar", phone: "+91 9876543216",
    zone: "Central", skills: [{ name: "Logistics Support", level: "verified" }, { name: "Driving", level: "verified" }, { name: "Food Distribution", level: "endorsed" }],
    availability: ["Afternoon", "Evening"], hours_assigned: 5, tasks: [],
    username: "manish.kumar", password: "manish123",
    email: "manish.kumar@gmail.com", age: 33, city: "Bhopal"
  },
  {
    id: "vol_017", name: "Lakshmi Pillai", phone: "+91 9876543217",
    zone: "South", skills: [{ name: "Teaching", level: "verified" }, { name: "Counseling", level: "endorsed" }, { name: "Communication & Outreach", level: "verified" }],
    availability: ["Morning", "Evening"], hours_assigned: 4, tasks: [],
    username: "lakshmi.pillai", password: "lakshmi123",
    email: "lakshmi.pillai@gmail.com", age: 29, city: "Thiruvananthapuram"
  },
  {
    id: "vol_018", name: "Nikhil Bansal", phone: "+91 9876543218",
    zone: "North", skills: [{ name: "Crowd Management", level: "verified" }, { name: "Event Coordination", level: "endorsed" }, { name: "Rescue Operations", level: "self" }],
    availability: ["Evening"], hours_assigned: 10, tasks: [],
    username: "nikhil.bansal", password: "nikhil123",
    email: "nikhil.bansal@gmail.com", age: 30, city: "Jaipur"
  },
  {
    id: "vol_019", name: "Rekha Desai", phone: "+91 9876543219",
    zone: "West", skills: [{ name: "Food Distribution", level: "self" }, { name: "Data Entry", level: "endorsed" }, { name: "Logistics Support", level: "self" }],
    availability: ["Afternoon"], hours_assigned: 1, tasks: [],
    username: "rekha.desai", password: "rekha123",
    email: "rekha.desai@gmail.com", age: 26, city: "Surat"
  },
  {
    id: "vol_020", name: "Gaurav Pandey", phone: "+91 9876543220",
    zone: "East", skills: [{ name: "Disaster Relief", level: "verified" }, { name: "Rescue Operations", level: "verified" }, { name: "First Aid", level: "self" }],
    availability: ["Morning", "Afternoon"], hours_assigned: 7, tasks: [],
    username: "gaurav.pandey", password: "gaurav123",
    email: "gaurav.pandey@gmail.com", age: 36, city: "Varanasi"
  },
  {
    id: "vol_021", name: "Sunita Rao", phone: "+91 9876543221",
    zone: "South", skills: [{ name: "Medical Assistance", level: "self" }, { name: "Counseling", level: "verified" }, { name: "Teaching", level: "endorsed" }],
    availability: ["Morning"], hours_assigned: 3, tasks: [],
    username: "sunita.rao", password: "sunita123",
    email: "sunita.rao@gmail.com", age: 41, city: "Vijayawada"
  },
  {
    id: "vol_022", name: "Harish Nambiar", phone: "+91 9876543222",
    zone: "Central", skills: [{ name: "Technical Support", level: "endorsed" }, { name: "Communication & Outreach", level: "self" }, { name: "Data Entry", level: "verified" }],
    availability: ["Afternoon", "Evening"], hours_assigned: 5, tasks: [],
    username: "harish.nambiar", password: "harish123",
    email: "harish.nambiar@gmail.com", age: 28, city: "Indore"
  },
  {
    id: "vol_023", name: "Pallavi Chopra", phone: "+91 9876543223",
    zone: "North", skills: [{ name: "Event Coordination", level: "verified" }, { name: "Crowd Management", level: "self" }, { name: "Food Distribution", level: "endorsed" }],
    availability: ["Morning", "Evening"], hours_assigned: 9, tasks: [],
    username: "pallavi.chopra", password: "pallavi123",
    email: "pallavi.chopra@gmail.com", age: 24, city: "Amritsar"
  },
  {
    id: "vol_024", name: "Deepak Mishra", phone: "+91 9876543224",
    zone: "East", skills: [{ name: "Driving", level: "self" }, { name: "Logistics Support", level: "endorsed" }, { name: "Rescue Operations", level: "verified" }],
    availability: ["Evening"], hours_assigned: 13, tasks: [],
    username: "deepak.mishra", password: "deepak123",
    email: "deepak.mishra@gmail.com", age: 37, city: "Guwahati"
  },
  {
    id: "vol_025", name: "Anjali Menon", phone: "+91 9876543225",
    zone: "South", skills: [{ name: "Teaching", level: "self" }, { name: "First Aid", level: "endorsed" }, { name: "Counseling", level: "self" }],
    availability: ["Morning", "Afternoon"], hours_assigned: 0, tasks: [],
    username: "anjali.menon", password: "anjali123",
    email: "anjali.menon@gmail.com", age: 21, city: "Kozhikode"
  },
  {
    id: "vol_026", name: "Sunil Aggarwal", phone: "+91 9876543226",
    zone: "West", skills: [{ name: "Disaster Relief", level: "endorsed" }, { name: "Crowd Management", level: "verified" }, { name: "Communication & Outreach", level: "endorsed" }],
    availability: ["Afternoon"], hours_assigned: 6, tasks: [],
    username: "sunil.aggarwal", password: "sunil123",
    email: "sunil.aggarwal@gmail.com", age: 44, city: "Rajkot"
  },
  {
    id: "vol_027", name: "Geeta Bhatt", phone: "+91 9876543227",
    zone: "Central", skills: [{ name: "Medical Assistance", level: "verified" }, { name: "Data Entry", level: "self" }, { name: "Event Coordination", level: "endorsed" }],
    availability: ["Morning", "Afternoon", "Evening"], hours_assigned: 2, tasks: [],
    username: "geeta.bhatt", password: "geeta123",
    email: "geeta.bhatt@gmail.com", age: 33, city: "Raipur"
  },
  {
    id: "vol_028", name: "Rajesh Choudhary", phone: "+91 9876543228",
    zone: "North", skills: [{ name: "Logistics Support", level: "self" }, { name: "Driving", level: "endorsed" }, { name: "Food Distribution", level: "verified" }],
    availability: ["Evening", "Morning"], hours_assigned: 8, tasks: [],
    username: "rajesh.choudhary", password: "rajesh123",
    email: "rajesh.choudhary@gmail.com", age: 39, city: "Meerut"
  },
  {
    id: "vol_029", name: "Usha Venkatesh", phone: "+91 9876543229",
    zone: "South", skills: [{ name: "Counseling", level: "self" }, { name: "Technical Support", level: "verified" }, { name: "Teaching", level: "endorsed" }],
    availability: ["Afternoon"], hours_assigned: 4, tasks: [],
    username: "usha.venkatesh", password: "usha123",
    email: "usha.venkatesh@gmail.com", age: 47, city: "Madurai"
  },
  {
    id: "vol_030", name: "Abhinav Srivastava", phone: "+91 9876543230",
    zone: "East", skills: [{ name: "Rescue Operations", level: "endorsed" }, { name: "Disaster Relief", level: "self" }, { name: "Crowd Management", level: "verified" }],
    availability: ["Morning", "Evening"], hours_assigned: 11, tasks: [],
    username: "abhinav.srivastava", password: "abhinav123",
    email: "abhinav.srivastava@gmail.com", age: 31, city: "Bhubaneswar"
  },
  {
    id: "vol_031", name: "Preethi Selvam", phone: "+91 9876543231",
    zone: "South", skills: [{ name: "Communication & Outreach", level: "endorsed" }, { name: "Event Coordination", level: "self" }, { name: "Data Entry", level: "verified" }],
    availability: ["Afternoon", "Evening"], hours_assigned: 5, tasks: [],
    username: "preethi.selvam", password: "preethi123",
    email: "preethi.selvam@gmail.com", age: 25, city: "Coimbatore"
  },
  {
    id: "vol_032", name: "Arun Kapoor", phone: "+91 9876543232",
    zone: "West", skills: [{ name: "First Aid", level: "self" }, { name: "Medical Assistance", level: "endorsed" }, { name: "Driving", level: "verified" }],
    availability: ["Morning"], hours_assigned: 3, tasks: [],
    username: "arun.kapoor", password: "arun123",
    email: "arun.kapoor@gmail.com", age: 29, city: "Nashik"
  },
  {
    id: "vol_033", name: "Seema Chauhan", phone: "+91 9876543233",
    zone: "North", skills: [{ name: "Food Distribution", level: "verified" }, { name: "Logistics Support", level: "self" }, { name: "Counseling", level: "endorsed" }],
    availability: ["Morning", "Afternoon"], hours_assigned: 7, tasks: [],
    username: "seema.chauhan", password: "seema123",
    email: "seema.chauhan@gmail.com", age: 36, city: "Agra"
  },
  {
    id: "vol_034", name: "Vivek Rajan", phone: "+91 9876543234",
    zone: "Central", skills: [{ name: "Technical Support", level: "verified" }, { name: "Rescue Operations", level: "endorsed" }, { name: "Communication & Outreach", level: "verified" }],
    availability: ["Evening"], hours_assigned: 0, tasks: [],
    username: "vivek.rajan", password: "vivek123",
    email: "vivek.rajan@gmail.com", age: 27, city: "Jabalpur"
  },
  {
    id: "vol_035", name: "Kamla Devi", phone: "+91 9876543235",
    zone: "East", skills: [{ name: "Teaching", level: "verified" }, { name: "Food Distribution", level: "endorsed" }, { name: "Crowd Management", level: "self" }],
    availability: ["Morning", "Evening"], hours_assigned: 6, tasks: [],
    username: "kamla.devi", password: "kamla123",
    email: "kamla.devi@gmail.com", age: 52, city: "Siliguri"
  },
  {
    id: "vol_036", name: "Yash Thakur", phone: "+91 9876543236",
    zone: "North", skills: [{ name: "Disaster Relief", level: "endorsed" }, { name: "First Aid", level: "verified" }, { name: "Rescue Operations", level: "endorsed" }],
    availability: ["Afternoon", "Evening"], hours_assigned: 14, tasks: [],
    username: "yash.thakur", password: "yash123",
    email: "yash.thakur@gmail.com", age: 23, city: "Shimla"
  },
  {
    id: "vol_037", name: "Bhavna Kulkarni", phone: "+91 9876543237",
    zone: "West", skills: [{ name: "Event Coordination", level: "self" }, { name: "Data Entry", level: "endorsed" }, { name: "Medical Assistance", level: "self" }],
    availability: ["Morning"], hours_assigned: 4, tasks: [],
    username: "bhavna.kulkarni", password: "bhavna123",
    email: "bhavna.kulkarni@gmail.com", age: 28, city: "Kolhapur"
  },
  {
    id: "vol_038", name: "Santosh Tripathi", phone: "+91 9876543238",
    zone: "Central", skills: [{ name: "Logistics Support", level: "endorsed" }, { name: "Driving", level: "self" }, { name: "Disaster Relief", level: "verified" }],
    availability: ["Afternoon", "Evening"], hours_assigned: 9, tasks: [],
    username: "santosh.tripathi", password: "santosh123",
    email: "santosh.tripathi@gmail.com", age: 43, city: "Gwalior"
  },
  {
    id: "vol_039", name: "Radha Gopalakrishnan", phone: "+91 9876543239",
    zone: "South", skills: [{ name: "Counseling", level: "verified" }, { name: "Communication & Outreach", level: "endorsed" }, { name: "Teaching", level: "verified" }],
    availability: ["Morning", "Afternoon"], hours_assigned: 2, tasks: [],
    username: "radha.gopalakrishnan", password: "radha123",
    email: "radha.gopalakrishnan@gmail.com", age: 45, city: "Mysuru"
  },
  {
    id: "vol_040", name: "Akash Dubey", phone: "+91 9876543240",
    zone: "East", skills: [{ name: "Technical Support", level: "endorsed" }, { name: "Crowd Management", level: "verified" }, { name: "Event Coordination", level: "endorsed" }],
    availability: ["Evening"], hours_assigned: 5, tasks: [],
    username: "akash.dubey", password: "akash123",
    email: "akash.dubey@gmail.com", age: 22, city: "Ranchi"
  }
];

const SEED_TASKS = [
  {
    id: "task_1", title: "Flood Relief Camp — Anna Nagar",
    skills: ["Disaster Relief", "Food Distribution"], zone: "South", state: "Tamil Nadu", city: "Chennai",
    time: "Morning", duration: "Full Day", worksite: "Anna Nagar Community Centre",
    status: "pending", assigned_to: null, isUrgent: true, urgency: "Critical"
  },
  {
    id: "task_2", title: "Senior Citizen Medical Camp",
    skills: ["Medical Assistance", "First Aid"], zone: "North", state: "Delhi", city: "New Delhi",
    time: "Afternoon", duration: "4 hours", worksite: "Lodhi Colony Health Centre",
    status: "pending", assigned_to: null, urgency: "High"
  },
  {
    id: "task_3", title: "Government School Computer Literacy Drive",
    skills: ["Teaching", "Technical Support"], zone: "East", state: "West Bengal", city: "Kolkata",
    time: "Morning", duration: "6 hours", worksite: "Govt. School No. 14, Howrah",
    status: "pending", assigned_to: null, urgency: "Medium"
  },
  {
    id: "task_4", title: "Emergency Blood Donation Drive",
    skills: ["Medical Assistance", "Crowd Management", "Communication & Outreach"], zone: "West", state: "Maharashtra", city: "Mumbai",
    time: "Evening", duration: "4 hours", worksite: "Andheri Blood Bank, Mumbai",
    status: "pending", assigned_to: null, isUrgent: true, urgency: "Critical"
  },
  {
    id: "task_5", title: "Slum Area Food Distribution",
    skills: ["Food Distribution", "Logistics Support"], zone: "Central", state: "Madhya Pradesh", city: "Bhopal",
    time: "Afternoon", duration: "4 hours", worksite: "Govindpura Colony, Bhopal",
    status: "pending", assigned_to: null, urgency: "Medium"
  },
  {
    id: "task_6", title: "Women Self-Defense Training Workshop",
    skills: ["Counseling", "Teaching"], zone: "South", state: "Karnataka", city: "Bangalore",
    time: "Morning", duration: "6 hours", worksite: "Indiranagar Community Hall",
    status: "pending", assigned_to: null, urgency: "Low"
  },
  {
    id: "task_7", title: "Village Evacuation Route Planning",
    skills: ["Rescue Operations", "Driving", "Logistics Support"], zone: "North", state: "Uttar Pradesh", city: "Lucknow",
    time: "Evening", duration: "Multiple Days", worksite: "Lucknow District Collectorate",
    status: "pending", assigned_to: null, urgency: "High"
  }
];

const SEED_ORGS = [
  {
    id: "coord_1", name: "Anjali Kapoor",
    phone: "+91 9999999999", organization: "Sewa Foundation",
    role: "coordinator", status: "verified",
    username: "demo", password: "demo123",
    email: "anjali.k@sewafoundation.org"
  },
  {
    id: "coord_2", name: "Dr. Ramesh Nair",
    phone: "+91 9888888888", organization: "HelpFirst NGO",
    role: "coordinator", status: "verified",
    username: "helpfirst", password: "helpfirst123",
    email: "r.nair@helpfirstngo.org"
  },
  {
    id: "coord_3", name: "Priya Krishnamurthy",
    phone: "+91 9777777777", organization: "Relief India Trust",
    role: "coordinator", status: "verified",
    username: "reliefindia", password: "relief123",
    email: "priya.k@reliefindia.org"
  }
];

// ─────────────────────────────────────────────
// localStorage-backed persistent DB
// ─────────────────────────────────────────────
const DB_KEY = "volunteerfit_db_v3";

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function saveDB(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn("Could not persist to localStorage:", e);
  }
}

function initDB() {
  let db = loadDB();
  if (!db) {
    db = {
      volunteers: JSON.parse(JSON.stringify(SEED_VOLUNTEERS)),
      tasks: JSON.parse(JSON.stringify(SEED_TASKS)),
      assignments: [],
      users: JSON.parse(JSON.stringify(SEED_ORGS))
    };
    saveDB(db);
  }
  return db;
}

// Initialize once on load
window.MockDB = initDB();

// Sync helper: always persist after mutations
function syncDB() {
  saveDB(window.MockDB);
}

// ─────────────────────────────────────────────
// Simulate network delay
// ─────────────────────────────────────────────
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─────────────────────────────────────────────
// API Layer
// ─────────────────────────────────────────────
window.API = {

  // ── AUTH ──────────────────────────────────

  // Volunteer: login by username + password (or legacy phone for compat)
  loginVolunteer: async ({ username, password }) => {
    await delay(400);
    const u = (username || '').trim();
    const p = (password || '').trim();
    console.log("MockAPI: loginVolunteer attempt:", u, p);
    console.log("MockAPI: Stored volunteers:", window.MockDB.volunteers);
    
    if (window.MockDB.volunteers.length === 0) {
      throw new Error("NO_ACCOUNTS");
    }

    const vol = window.MockDB.volunteers.find(
      v => (v.username === u || v.phone === u) && v.password === p
    );
    return vol || null;
  },

  // Keep legacy phone login for backward compat
  loginVolunteerByPhone: async (phone) => {
    await delay(400);
    const vol = window.MockDB.volunteers.find(v => v.phone === phone);
    return vol || null;
  },

  // Coordinator: login by username + password (or legacy phone)
  loginCoordinator: async ({ username, password }) => {
    await delay(400);
    const u = (username || '').trim();
    const p = (password || '').trim();
    console.log("MockAPI: loginCoordinator attempt:", u, p);
    console.log("MockAPI: Stored coordinators:", window.MockDB.users);

    if (window.MockDB.users.length === 0) {
      throw new Error("NO_ACCOUNTS");
    }

    const user = window.MockDB.users.find(
      u_obj => (u_obj.username === u || u_obj.phone === u) && u_obj.password === p && u_obj.role === 'coordinator'
    );
    return user || null;
  },

  loginCoordByPhone: async (phone) => {
    await delay(400);
    const user = window.MockDB.users.find(u => u.phone === phone && u.role === 'coordinator');
    return user || null;
  },

  // Create volunteer (signup)
  createVolunteer: async (data) => {
    await delay(500);
    // Check for duplicate username or phone (only check phone if provided)
    const exists = window.MockDB.volunteers.find(
      v => v.username === data.username ||
           (data.phone && data.phone.trim() !== '' && v.phone === data.phone)
    );
    if (exists) throw new Error("DUPLICATE");

    console.log("MockAPI: createVolunteer signup:", data);

    const newVol = {
      id: "vol_" + Date.now(),
      name: data.name,
      phone: data.phone || '',
      zone: data.zone || 'Central',
      skills: data.skills.map(s => ({ name: s, level: 'self' })),
      availability: data.availability || ['Morning'],
      hours_assigned: 0,
      tasks: [],
      username: data.username,
      password: data.password,
      email: data.email || '',
      age: data.age || null,
      country: data.country || '',
      state: data.state || '',
      city: data.city || ''
    };
    window.MockDB.volunteers.push(newVol);
    syncDB();
    return newVol;
  },

  // Create coordinator (signup)
  createCoordinator: async (data) => {
    await delay(500);
    const exists = window.MockDB.users.find(
      u => u.username === data.username ||
           (data.phone && data.phone.trim() !== '' && u.phone === data.phone)
    );
    if (exists) throw new Error("DUPLICATE");

    console.log("MockAPI: createCoordinator signup:", data);

    const newUser = {
      id: "coord_" + Date.now(),
      name: data.name,
      phone: data.phone,
      organization: data.organization,
      role: "coordinator",
      status: "verified",
      username: data.username,
      password: data.password,
      email: data.email || '',
      country: data.country || '',
      state: data.state || '',
      city: data.city || ''
    };
    window.MockDB.users.push(newUser);
    syncDB();
    return newUser;
  },

  // ── TASKS ─────────────────────────────────

  createTask: async (data) => {
    await delay(300);
    const newTask = {
      id: "task_" + Date.now(),
      title: data.title,
      description: data.description || '',
      skills: data.skills,
      state: data.state || '',
      city: data.city || '',
      time: data.time,
      duration: data.duration || '4 hours',
      urgency: data.urgency || 'Medium',
      volunteersNeeded: data.volunteersNeeded || 1,
      contactPerson: data.contactPerson || '',
      contactPhone: data.contactPhone || '',
      status: "pending",
      assigned_to: null,
      isUrgent: data.urgency === 'Critical' || data.urgency === 'High'
    };
    window.MockDB.tasks.unshift(newTask);
    syncDB();
    return newTask;
  },

  getTasks: async () => {
    await delay(200);
    return window.MockDB.tasks;
  },

  // ── MATCHING ──────────────────────────────

  getMatches: async (taskId, fastMode = false) => {
    if (!fastMode) await delay(800);
    const task = window.MockDB.tasks.find(t => t.id === taskId);
    if (!task) throw new Error("Task not found");

    const scoredVolunteers = window.MockDB.volunteers.map(vol => {
      const score = window.ScoringEngine.calculateFitScore(vol, task);
      return {
        volunteer_id: vol.id,
        name: vol.name,
        fit_score: score.total,
        breakdown: score.breakdown,
        hours_assigned: vol.hours_assigned,
        zone: vol.zone,
        skills: vol.skills,
        city: vol.city || '',
        availability: vol.availability || []
      };
    });

    const safeScored = [];
    let excludedCount = 0;
    for (const score of scoredVolunteers) {
      if (score.hours_assigned >= 12) {
        excludedCount++;
      } else {
        safeScored.push(score);
      }
    }

    safeScored.sort((a, b) => b.fit_score - a.fit_score);
    return { matches: safeScored.slice(0, 5), excludedCount };
  },

  assignTask: async (volunteerId, taskId, fastMode = false) => {
    if (!fastMode) await delay(400);
    const task = window.MockDB.tasks.find(t => t.id === taskId);
    const vol = window.MockDB.volunteers.find(v => v.id === volunteerId);

    if (task && vol) {
      task.status = "assigned";
      task.assigned_to = volunteerId;
      vol.hours_assigned += 2;
      window.MockDB.assignments.push({ taskId, volunteerId, timestamp: Date.now() });
      syncDB();
      return { success: true };
    }
    throw new Error("Failed to assign");
  },

  // ── VOLUNTEER PORTAL ──────────────────────

  getVolunteerTasks: async (volunteerId) => {
    await delay(300);
    return window.MockDB.tasks.filter(t => t.assigned_to === volunteerId);
  },

  getVolunteer: async (volunteerId) => {
    await delay(200);
    return window.MockDB.volunteers.find(v => v.id === volunteerId);
  },

  // ── DASHBOARD ─────────────────────────────

  getDashboardStats: async () => {
    await delay(300);
    const totalPending = window.MockDB.tasks.filter(t => t.status === "pending").length;
    const totalAssigned = window.MockDB.tasks.filter(t => t.status === "assigned").length;
    const dangerCount = window.MockDB.volunteers.filter(v => v.hours_assigned >= 12).length;
    const burnoutPrevented = window.MockDB.assignments.length > 0
      ? Math.floor(window.MockDB.assignments.length * 0.3) + 12 : 12;

    return {
      totalVolunteers: window.MockDB.volunteers.length,
      tasksPending: totalPending,
      tasksCompleted: totalAssigned,
      efficiency: Math.round((totalAssigned / (totalPending + totalAssigned || 1)) * 100),
      avgFitScore: 84,
      dangerCount,
      burnoutPrevented
    };
  },

  getBurnoutMonitor: async () => {
    await delay(300);
    return window.MockDB.volunteers.map(v => {
      let status = 'safe';
      if (v.hours_assigned > 8) status = 'warning';
      if (v.hours_assigned >= 12) status = 'danger';
      return { id: v.id, name: v.name, hours: v.hours_assigned, status, city: v.city || '' };
    }).sort((a, b) => b.hours - a.hours).slice(0, 10);
  },

  // ── CRISIS SURGE ──────────────────────────

  simulateCrisisSurge: async () => {
    await delay(800);
    const numTasks = Math.floor(Math.random() * 21) + 30;
    const newTasks = [];
    for (let i = 0; i < numTasks; i++) {
      const taskSkills = [...SKILLS].sort(() => 0.5 - Math.random()).slice(0, 1 + Math.floor(Math.random() * 2));
      newTasks.push({
        id: "task_surge_" + Date.now() + "_" + i,
        title: "Urgent Relief Request " + (i + 1),
        skills: taskSkills,
        zone: ZONES[Math.floor(Math.random() * ZONES.length)],
        time: TIME_SLOTS[Math.floor(Math.random() * TIME_SLOTS.length)],
        status: "pending",
        assigned_to: null,
        isUrgent: true
      });
    }

    window.MockDB.tasks = [...newTasks, ...window.MockDB.tasks];

    // Track surge-specific assignments to prevent stacking on same volunteer
    const surgeAssignCount = {};
    const MAX_SURGE_PER_VOL = 2; // max 4 hrs added per volunteer per surge

    const tasksToAssign = newTasks.slice(0, Math.floor(numTasks * 0.8));
    for (let i = 0; i < tasksToAssign.length; i++) {
      const t = tasksToAssign[i];
      const matchRes = await window.API.getMatches(t.id, true);

      // Skip volunteers who've already been assigned too much this surge
      const candidate = matchRes.matches.find(m => {
        const alreadyAssigned = surgeAssignCount[m.volunteer_id] || 0;
        return alreadyAssigned < MAX_SURGE_PER_VOL;
      });

      if (candidate) {
        await window.API.assignTask(candidate.volunteer_id, t.id, true);
        surgeAssignCount[candidate.volunteer_id] = (surgeAssignCount[candidate.volunteer_id] || 0) + 1;
      }

      if (i > 0 && i % 10 === 0) await delay(400);
    }

    syncDB();
    return numTasks;
  },

  upgradeSkill: async (volunteerId, skillName, newLevel) => {
    await delay(300);
    const vol = window.MockDB.volunteers.find(v => v.id === volunteerId);
    if (vol) {
      const skill = vol.skills.find(s => s.name === skillName);
      if (skill) {
        skill.level = newLevel;
        syncDB();
        return true;
      }
    }
    return false;
  },

  // ── UTILITY ───────────────────────────────

  // Hard reset DB back to seeds (useful for demos)
  resetDatabase: () => {
    window.MockDB = {
      volunteers: JSON.parse(JSON.stringify(SEED_VOLUNTEERS)),
      tasks: JSON.parse(JSON.stringify(SEED_TASKS)),
      assignments: [],
      users: JSON.parse(JSON.stringify(SEED_ORGS))
    };
    saveDB(window.MockDB);
    return true;
  }
};
