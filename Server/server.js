// import express from "express";
// import mysql from "mysql2";
// import cors from "cors";

// const app = express();
// app.use(cors());
// app.use(express.json());

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "teachersfeedback"
// });

// db.connect(err => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });

// // Teacher Endpoints
// app.get('/teachers', (req, res) => {
//     const sql = "SELECT * FROM Teacher";
//     db.query(sql, (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         return res.json(result);
//     });
// });

// app.post('/teachers', (req, res) => {
//     const { id, Name, Subject, Department, image, Semester } = req.body;
//     const sql = "INSERT INTO Teacher (id, Name, Subject, Department, image, Semester) VALUES (?, ?, ?, ?, ?, ?)";
//     db.query(sql, [id, Name, Subject, Department, image, Semester], (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         return res.json({ message: "Teacher added successfully" });
//     });
// });

// app.delete('/teachers/:id', (req, res) => {
//     const sql = "DELETE FROM Teacher WHERE id = ?";
//     db.query(sql, [req.params.id], (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         return res.json({ message: "Teacher deleted successfully" });
//     });
// });

// const PORT = 8081;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
// app.post('/question',(req,res)=>{
//     const sql = "INSERT INTO question(`id`, `subject`, `q1`, `q2`, `q3`, `q4`, `q5`) VALUES (?)";
//     const values = [
//      req.body.id,
//      req.body.subject,
//      req.body.question[0],
//      req.body.question[1],
//      req.body.question[2],
//      req.body.question[3],
//      req.body.question[4]
//     ] 
//     db.query(sql,[values], (err,result)=>{
//      if(err)
//          return res.json(err);
//      return res.json(result);
//  })
//  })

//  app.get('/question',(req,res)=>{
//     const sql = "SELECT * FROM question";
//     db.query(sql, (err,result)=>{
//         if(err)return res.json({Message : "error inside server"});
//         return res.json(result);
//     })
// })

// // Add this endpoint to your existing server code
// app.get('/teachers/:id', (req, res) => {
//     const sql = "SELECT Name, Subject FROM Teacher WHERE id = ?";
//     db.query(sql, [req.params.id], (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (result.length === 0) {
//             return res.status(404).json({ message: "Teacher not found" });
//         }
//         return res.json(result[0]); // Returns { Name: "...", Subject: "..." }
//     });
// });


// // Add these endpoints to your existing server code

// // Staff Endpoints
// app.post('/staff/register', async (req, res) => {
//   const { staffId, name, email, password } = req.body;
  
//   // Check if staff already exists
//   const checkSql = "SELECT * FROM Staff WHERE email = ? OR staffId = ?";
//   db.query(checkSql, [email, staffId], (err, result) => {
//     if (err) return res.status(500).json({ success: false, error: err.message });
//     if (result.length > 0) {
//       return res.status(400).json({ success: false, message: "Staff with this email or ID already exists" });
//     }

//     // In a real application, you should hash the password before storing it
//     const insertSql = "INSERT INTO Staff (staffId, name, email, password) VALUES (?, ?, ?, ?)";
//     db.query(insertSql, [staffId, name, email, password], (err, result) => {
//       if (err) return res.status(500).json({ success: false, error: err.message });
//       return res.json({ success: true, message: "Staff registered successfully" });
//     });
//   });
// });

// app.post('/staff/login', (req, res) => {
//   const { email, password } = req.body;
  
//   const sql = "SELECT * FROM Staff WHERE email = ? AND password = ?";
//   db.query(sql, [email, password], (err, result) => {
//     if (err) return res.status(500).json({ success: false, error: err.message });
//     if (result.length === 0) {
//       return res.status(401).json({ success: false, message: "Invalid email or password" });
//     }
    
//     const staff = result[0];
//     return res.json({ 
//       success: true, 
//       staff: {
//         id: staff.staffId,
//         name: staff.name,
//         email: staff.email
//       }
//     });
//   });
// });


import express from "express";
import mysql from "mysql2/promise"; // Using promise-based API
import cors from "cors";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";

const app = express();

// Security middleware
app.use(cors());
app.use(express.json());

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later"
});

// Database connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "teachersfeedback",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
(async () => {
  try {
    await db.getConnection();
    console.log('Connected to MySQL database');
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
  }
})();

// Helper functions
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

// Teacher Endpoints
app.get('/teachers', async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM Teacher");
    return res.json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/teachers', async (req, res) => {
  const { id, Name, Subject, Department, image, Semester } = req.body;
  
  if (!id || !Name || !Subject || !Department) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await db.query(
      "INSERT INTO Teacher (id, Name, Subject, Department, image, Semester) VALUES (?, ?, ?, ?, ?, ?)",
      [id, Name, Subject, Department, image || null, Semester || null]
    );
    return res.json({ message: "Teacher added successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/teachers/:id', async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM Teacher WHERE id = ?", [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    
    return res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Question Endpoints
app.post('/question', async (req, res) => {
  const { id, subject, question } = req.body;
  
  if (!id || !subject || !question || question.length !== 5) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    await db.query(
      "INSERT INTO question(`id`, `subject`, `q1`, `q2`, `q3`, `q4`, `q5`) VALUES (?)",
      [[id, subject, ...question]]
    );
    return res.json({ message: "Question added successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/question', async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM question");
    return res.json(results);
  } catch (err) {
    return res.status(500).json({ error: "Error fetching questions" });
  }
});

app.get('/teachers/:id', async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT Name, Subject FROM Teacher WHERE id = ?", 
      [req.params.id]
    );
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    
    return res.json(results[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Staff Endpoints with enhanced security
app.post('/staff/register', authLimiter, async (req, res) => {
  const { staffId, name, email, password } = req.body;
  
  // Input validation
  if (!staffId || !name || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields are required" 
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid email format" 
    });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ 
      success: false, 
      message: "Password must be at least 8 characters" 
    });
  }

  try {
    // Check if staff exists
    const [existing] = await db.query(
      "SELECT * FROM Staff WHERE email = ? OR staffId = ?", 
      [email, staffId]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Staff with this email or ID already exists" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create staff
    await db.query(
      "INSERT INTO Staff (staffId, name, email, password) VALUES (?, ?, ?, ?)",
      [staffId, name, email, hashedPassword]
    );
    
    return res.json({ 
      success: true, 
      message: "Staff registered successfully" 
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

app.post('/staff', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Email and password are required" 
    });
  }

  try {
    const [results] = await db.query(
      "SELECT * FROM Staff WHERE email = ?", 
      [email]
    );
    
    if (results.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }
    
    const staff = results[0];
    const isMatch = await bcrypt.compare(password, staff.password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }
    
    // Create response without sensitive data
    const staffResponse = {
      id: staff.staffId,
      name: staff.name,
      email: staff.email
    };
    
    return res.json({ 
      success: true, 
      staff: staffResponse 
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});