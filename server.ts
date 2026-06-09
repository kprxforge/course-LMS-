import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // === AI SETUP ===
  let ai: GoogleGenAI | null = null;
  function getAIClient() {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });
    }
    return ai;
  }

  // === MOCK DATABASE ===
  let users = [
    {
      id: "u1",
      role: "student",
      name: "Alex Dev",
      email: "student@example.com",
      password: "password",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      xp: 2450,
      streak: 12,
      theme: "light",
      notifications: true,
    },
    {
      id: "u2",
      role: "student",
      name: "Taylor Swift",
      email: "taylor@example.com",
      password: "password",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024e",
      xp: 1200,
      streak: 3,
      theme: "dark",
      notifications: true,
    },
    {
      id: "a1",
      role: "admin",
      name: "Super Admin",
      email: "admin@auralms.com",
      password: "admin123",
      avatar: "https://i.pravatar.cc/150?u=admin",
      theme: "light",
      notifications: true,
    }
  ];

  let courses = [
    {
      id: "c1",
      title: "Advanced Full-Stack System Design",
      description: "Learn how to architect scalable SaaS platforms.",
      category: "Engineering",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
      duration: "12h 30m",
      level: "Advanced",
      instructorName: "Sarah Jenkins",
      tags: ["System Design", "Architecture"]
    },
    {
      id: "c2",
      title: "React & Node.js Masterclass",
      description: "Build robust frontend and backend services.",
      category: "Web Development",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
      duration: "8h 15m",
      level: "Intermediate",
      instructorName: "Michael Chen",
      tags: ["React", "Express"]
    }
  ];

  let enrollments = [
    { id: "e1", studentId: "u1", courseId: "c1", progress: 65, enrolledAt: "2023-01-01T00:00:00Z" },
    { id: "e2", studentId: "u1", courseId: "c2", progress: 100, enrolledAt: "2023-02-01T00:00:00Z" }
  ];

  let materials = [
    { id: "m1", courseId: "c1", title: "System Architecture Diagram", type: "pdf", url: "#", uploadedAt: new Date().toISOString() },
    { id: "m2", courseId: "c2", title: "React Component Lifecycle", type: "video", url: "#", uploadedAt: new Date().toISOString() }
  ];

  let quizzes = [
    { id: "q1", courseId: "c2", title: "React Basics Quiz", questions: [{ q: "What is JSX?", options: ["Syntax", "Language"], correct: 0 }] }
  ];

  let quizAttempts = [
    { id: "qa1", studentId: "u1", quizId: "q1", score: 92, submittedAt: new Date().toISOString() }
  ];

  let certificatesData = [
    {
      id: "cert1",
      courseId: "c2",
      courseTitle: "React & Node.js Masterclass",
      studentName: "Alex Dev",
      studentId: "u1",
      issueDate: "2023-10-20"
    }
  ];

  let activities = [
    { id: "a1", studentId: "u1", title: "React Basics Quiz", date: "2 hours ago", type: "quiz", score: 92 },
    { id: "a2", studentId: "u1", title: "Earned Frontend Certificate", date: "Last week", type: "certificate" },
  ];

  let achievementsData = [
    { id: "badge1", title: "First Blood", description: "Completed your first quiz", icon: "Target", unlockedAt: "2023-10-01" },
    { id: "badge2", title: "Week Warrior", description: "Maintained a 7-day streak", icon: "Flame", unlockedAt: "2023-10-08" },
  ];

  function generateId(prefix: string) {
    return prefix + Math.random().toString(36).substr(2, 9);
  }

  function getUserId(req: any) {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer ")) {
      return auth.split(" ")[1];
    }
    // Fallback for simplicity during development or if headers are missing
    return "u1"; 
  }

  // === REST APIs ===
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser, token: user.id }); // Using ID as token
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/users/me", (req, res) => {
    const userId = getUserId(req);
    const user = users.find(u => u.id === userId);
    if (user) {
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.put("/api/users/me", (req, res) => {
    const userId = getUserId(req);
    const updates = req.body;
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      const { password: _, ...safeUser } = users[userIndex];
      res.json(safeUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  // STUDENT ROUTES
  app.get("/api/courses", (req, res) => {
    const userId = getUserId(req);
    // Add progress to courses for the specific student
    const result = courses.map(c => {
      const enrollment = enrollments.find(e => e.studentId === userId && e.courseId === c.id);
      return { ...c, progress: enrollment ? enrollment.progress : 0 };
    });
    res.json(result);
  });

  app.post("/api/courses/:id/enroll", (req, res) => {
    const userId = getUserId(req);
    const courseId = req.params.id;
    const existing = enrollments.find(e => e.courseId === courseId && e.studentId === userId);
    if (!existing) {
      enrollments.push({
        id: generateId("e"),
        studentId: userId,
        courseId,
        progress: 0,
        enrolledAt: new Date().toISOString()
      });
      // also log activity
      const course = courses.find(c => c.id === courseId);
      if (course) {
        activities.unshift({
          id: generateId("a"),
          studentId: userId,
          title: `Enrolled in ${course.title}`,
          date: "Just now",
          type: "lesson"
        });
      }
    }
    res.json({ success: true });
  });

  app.post("/api/courses/:id/progress", (req, res) => {
    const userId = getUserId(req);
    const courseId = req.params.id;
    const { progress } = req.body;
    const enrollment = enrollments.find(e => e.courseId === courseId && e.studentId === userId);
    if (enrollment) {
      enrollment.progress = Math.min(100, Math.max(0, progress));
      // Give XP
      const user = users.find(u => u.id === userId);
      if (user && user.role === "student") user.xp += 10;
    }
    res.json({ success: true });
  });

  app.get("/api/activities", (req, res) => {
    const userId = getUserId(req);
    res.json(activities.filter(a => a.studentId === userId));
  });

  app.get("/api/achievements", (req, res) => {
    res.json(achievementsData);
  });

  app.get("/api/certificates", (req, res) => {
    const userId = getUserId(req);
    const userRole = users.find(u => u.id === userId)?.role;
    if (userRole === "admin") {
      res.json(certificatesData);
    } else {
      res.json(certificatesData.filter(c => c.studentId === userId));
    }
  });

  app.get("/api/materials", (req, res) => {
    res.json(materials);
  });

  app.get("/api/quizzes", (req, res) => {
    res.json(quizzes);
  });

  app.get("/api/quiz-attempts", (req, res) => {
    const userId = getUserId(req);
    const userRole = users.find(u => u.id === userId)?.role;
    if (userRole === "admin") {
      res.json(quizAttempts);
    } else {
      res.json(quizAttempts.filter(qa => qa.studentId === userId));
    }
  });

  app.post("/api/quizzes/:id/submit", (req, res) => {
    const userId = getUserId(req);
    const quizId = req.params.id;
    const { score } = req.body;
    quizAttempts.push({
      id: generateId("qa"),
      studentId: userId,
      quizId,
      score,
      submittedAt: new Date().toISOString()
    });
    
    // add activity
    const quiz = quizzes.find(q => q.id === quizId);
    if (quiz) {
      activities.unshift({
        id: generateId("a"),
        studentId: userId,
        title: quiz.title,
        date: "Just now",
        type: "quiz",
        score
      });
    }

    // Give XP
    const user = users.find(u => u.id === userId);
    if (user && user.role === "student") user.xp += Math.round(score);

    res.json({ success: true });
  });


  // === ADMIN ROUTES ===
  app.get("/api/admin/stats", (req, res) => {
    res.json({
      totalStudents: users.filter(u => u.role === "student").length,
      totalCourses: courses.length,
      activeEnrollments: enrollments.length,
      completedCourses: enrollments.filter(e => e.progress === 100).length,
      quizAttempts: quizAttempts.length,
      certificatesIssued: certificatesData.length
    });
  });

  app.get("/api/admin/users", (req, res) => {
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json(safeUsers);
  });

  app.delete("/api/admin/users/:id", (req, res) => {
    users = users.filter(u => u.id !== req.params.id || u.role === "admin");
    // Cascading deletes
    enrollments = enrollments.filter(e => e.studentId !== req.params.id);
    quizAttempts = quizAttempts.filter(qa => qa.studentId !== req.params.id);
    certificatesData = certificatesData.filter(c => c.studentId !== req.params.id);
    activities = activities.filter(a => a.studentId !== req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/courses", (req, res) => {
    const course = {
      ...req.body,
      id: generateId("c"),
    };
    courses.push(course);
    res.json(course);
  });

  app.put("/api/admin/courses/:id", (req, res) => {
    const index = courses.findIndex(c => c.id === req.params.id);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...req.body };
      res.json(courses[index]);
    } else {
      res.status(404).json({ error: "Course not found" });
    }
  });

  app.delete("/api/admin/courses/:id", (req, res) => {
    courses = courses.filter(c => c.id !== req.params.id);
    enrollments = enrollments.filter(e => e.courseId !== req.params.id);
    materials = materials.filter(m => m.courseId !== req.params.id);
    quizzes = quizzes.filter(q => q.courseId !== req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/materials", (req, res) => {
    const material = {
      ...req.body,
      id: generateId("m"),
      uploadedAt: new Date().toISOString()
    };
    materials.push(material);
    res.json(material);
  });

  app.delete("/api/admin/materials/:id", (req, res) => {
    materials = materials.filter(m => m.id !== req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/quizzes", (req, res) => {
    const quiz = {
      ...req.body,
      id: generateId("q"),
    };
    quizzes.push(quiz);
    res.json(quiz);
  });

  app.delete("/api/admin/quizzes/:id", (req, res) => {
    quizzes = quizzes.filter(q => q.id !== req.params.id);
    quizAttempts = quizAttempts.filter(qa => qa.quizId !== req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/certificates", (req, res) => {
    const { studentId, courseId } = req.body;
    const student = users.find(u => u.id === studentId);
    const course = courses.find(c => c.id === courseId);
    if (student && course) {
      const cert = {
        id: generateId("cert"),
        courseId,
        courseTitle: course.title,
        studentName: student.name,
        studentId,
        issueDate: new Date().toISOString()
      };
      certificatesData.push(cert);
      
      // Notify via activity
      activities.unshift({
        id: generateId("a"),
        studentId,
        title: `Earned certificate for ${course.title}`,
        date: "Just now",
        type: "certificate"
      });
      res.json(cert);
    } else {
      res.status(404).json({ error: "Student or course not found" });
    }
  });

  app.delete("/api/admin/certificates/:id", (req, res) => {
    certificatesData = certificatesData.filter(c => c.id !== req.params.id);
    res.json({ success: true });
  });

  // AI APIs
  app.post("/api/gemini/summarize", async (req, res) => {
    try {
      const { lessonTitle, courseTitle } = req.body;
      const aiClient = getAIClient();
      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Provide a very concise bulleted summary (3-5 bullet points) for a hypothetical lesson titled "${lessonTitle}" in the course "${courseTitle}". Format as a JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are an expert technical instructor generating short, punchy summaries. Do not include markdown formatting like ```json.",
        }
      });
      const summaryText = response.text.trim();
      let summaryArray;
      try {
        summaryArray = JSON.parse(summaryText);
      } catch (e) {
        // Fallback if parsing fails
        summaryArray = ["Error interpreting AI response."];
      }
      res.json({ summary: summaryArray });
    } catch (error: any) {
      console.error("AI summarization error:", error);
      res.status(500).json({ error: error.message || "Failed to generate summary." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
