(() => {
  // app.js
  var { useState, useEffect } = React;
  var STORAGE_KEYS = {
    USERS: "GroupSolution_hours_tracker_users",
    TEACHER_HOURS: "GroupSolution_hours_tracker_teacher_hours",
    ADMIN_HOURS: "GroupSolution_hours_tracker_admin_hours",
    CURRENT_USER: "GroupSolution_hours_tracker_current_user"
  };



  var generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  
  var getUsers = () => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  };

  var saveUsers = (users) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  };
  var updateUserDetails = (userId, updates) => {
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      saveUsers(users);
      const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (currentUser) {
        const curr = JSON.parse(currentUser);
        if (curr.id === userId) {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
        }
      }
      return users[userIndex];
    }
    return null;
  };
  var getTeacherHours = (teacherId, forAdmin = false) => {
    const key = forAdmin ? STORAGE_KEYS.ADMIN_HOURS : STORAGE_KEYS.TEACHER_HOURS;
    const all = localStorage.getItem(key);
    const data = all ? JSON.parse(all) : {};
    return teacherId ? data[teacherId] || {} : data;
  };
  var saveTeacherHours = (teacherId, hoursData, forAdmin = false) => {
    const key = forAdmin ? STORAGE_KEYS.ADMIN_HOURS : STORAGE_KEYS.TEACHER_HOURS;
    const all = localStorage.getItem(key);
    const existing = all ? JSON.parse(all) : {};
    existing[teacherId] = hoursData;
    localStorage.setItem(key, JSON.stringify(existing));
  };
  var updateUserPhoto = (userId, photoBase64) => {
    return updateUserDetails(userId, { photo: photoBase64 });
  };

  var Footer = () => {
    return /* @__PURE__ */ React.createElement("footer", { style: {
    width: '100%',
    padding: '10px 15px',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
    marginTop: 'auto',
    background: 'rgba(0,0,0,0.4)'
    } }, React.createElement("div", {
    style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
         gap: "8px",
        flexWrap: "wrap",
    }
},
    React.createElement("span", null, "Group-Solution-Hours-tracker ©2026 By"),
    React.createElement("img", {
        src: "/icons/ExcelsiorLogo.png",
        alt: "logo",
        style: {
            width: "20px",
            height: "20px",
            borderRadius: "50px",
            objectFit: "contain",
            verticalAlign: "middle"
        }
    }),
    React.createElement("span", null, "EXCELSIOR")
))
  };

  
  var inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "14px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "16px",
    fontFamily: "inherit"
  };

  //First-time admin setup screen
  var FirstTimeSetup = ({ onComplete }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [error, setError] = useState("");

    const handleSetup = () => {
      if (!name.trim() || !email.trim() || !password || !securityQuestion.trim() || !securityAnswer.trim()) {
        setError("All fields are required");
        return;
      }
      if (password.length < 4) {
        setError("Password must be at least 4 characters");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const adminUser = {
        id: "admin_" + Date.now(),
        name: name.trim(),
        email: email.trim(),
        password,
        role: "admin",
        photo: null,
        securityQuestion: securityQuestion.trim(),
        securityAnswer: securityAnswer.trim()
      };
      saveUsers([adminUser]);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(adminUser));
      onComplete(adminUser);
    };

    return React.createElement("div", { style: { minHeight: "100vh", display: "flex", flexDirection: "column" } },
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("div", { style: { maxWidth: "440px", margin: "60px auto", padding: "40px", background: "white", borderRadius: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" } },
          React.createElement("h1", { style: { fontSize: "24px", marginBottom: "6px", color: "#1f2937" } }, "Welcome! Let's get you set up"),
          React.createElement("p", { style: { color: "#6b7280", marginBottom: "28px", fontSize: "14px" } }, "Create your admin account. You'll use these credentials every time you log in."),
          React.createElement("input", { type: "text", placeholder: "Your full name", value: name, onChange: e => setName(e.target.value), style: inputStyle }),
          React.createElement("input", { type: "email", placeholder: "Email address", value: email, onChange: e => setEmail(e.target.value), style: inputStyle }),
          React.createElement("input", { type: "password", placeholder: "Password (min 4 chars)", value: password, onChange: e => setPassword(e.target.value), style: inputStyle }),
          React.createElement("input", { type: "password", placeholder: "Confirm password", value: confirmPassword, onChange: e => setConfirmPassword(e.target.value), style: inputStyle }),
          React.createElement("input", { type: "text", placeholder: "Security question (for password recovery)", value: securityQuestion, onChange: e => setSecurityQuestion(e.target.value), style: inputStyle }),
          React.createElement("input", { type: "text", placeholder: "Your answer", value: securityAnswer, onChange: e => setSecurityAnswer(e.target.value), style: { ...inputStyle, marginBottom: "20px" } }),
          error && React.createElement("p", { style: { color: "#ef4444", marginBottom: "12px", fontSize: "14px" } }, error),
          React.createElement("button", {
            onClick: handleSetup,
            style: { width: "100%", padding: "14px", background: "#3B82F6", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }
          }, "Create Admin Account")
        )
      ),
      React.createElement(Footer, null)
    );
  };

  var ForgotPasswordModal = ({ onClose }) => {
    const [step, setStep] = useState("email");
    const [email, setEmail] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const handleEmailSubmit = () => {
      const users = getUsers();
      const found = users.find((u) => u.email === email);
      if (!found) {
        setError("No account with that email");
        return;
      }
      setUser(found);
      setStep("security");
      setError("");
    };
    const handleSecuritySubmit = () => {
      if (securityAnswer.toLowerCase().trim() !== user.securityAnswer.toLowerCase().trim()) {
        setError("Security answer is incorrect");
        return;
      }
      setStep("newPassword");
      setError("");
    };
    const handlePasswordReset = () => {
      if (!newPassword || newPassword.length < 4) {
        setError("Password must be at least 4 characters");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      updateUserDetails(user.id, { password: newPassword });
      alert("Password reset successfully. You can now log in.");
      onClose();
    };
    return /* @__PURE__ */ React.createElement("div", { style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1001
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      background: "white",
      borderRadius: "24px",
      padding: "24px",
      maxWidth: "400px",
      width: "90%"
    } }, /* @__PURE__ */ React.createElement("h3", { style: { marginBottom: "20px" } }, "Reset Password"), step === "email" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "email",
        placeholder: "Enter your email",
        value: email,
        onChange: (e) => setEmail(e.target.value),
        style: {
          width: "100%",
          padding: "12px",
          marginBottom: "16px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "16px"
        }
      }
    ), error && /* @__PURE__ */ React.createElement("p", { style: { color: "#ef4444", marginBottom: "16px" } }, error), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleEmailSubmit,
        style: {
          width: "100%",
          padding: "12px",
          background: "#3B82F6",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }
      },
      "Next"
    )), step === "security" && user && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { style: { marginBottom: "8px", fontWeight: "500" } }, "Security Question:"), /* @__PURE__ */ React.createElement("p", { style: { marginBottom: "16px", background: "#f3f4f6", padding: "8px", borderRadius: "8px" } }, user.securityQuestion), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        placeholder: "Your answer",
        value: securityAnswer,
        onChange: (e) => setSecurityAnswer(e.target.value),
        style: {
          width: "100%",
          padding: "12px",
          marginBottom: "16px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "16px"
        }
      }
    ), error && /* @__PURE__ */ React.createElement("p", { style: { color: "#ef4444", marginBottom: "16px" } }, error), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleSecuritySubmit,
        style: {
          width: "100%",
          padding: "12px",
          background: "#3B82F6",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }
      },
      "Verify"
    )), step === "newPassword" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        placeholder: "New password",
        value: newPassword,
        onChange: (e) => setNewPassword(e.target.value),
        style: {
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "16px"
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        placeholder: "Confirm new password",
        value: confirmPassword,
        onChange: (e) => setConfirmPassword(e.target.value),
        style: {
          width: "100%",
          padding: "12px",
          marginBottom: "16px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "16px"
        }
      }
    ), error && /* @__PURE__ */ React.createElement("p", { style: { color: "#ef4444", marginBottom: "16px" } }, error), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handlePasswordReset,
        style: {
          width: "100%",
          padding: "12px",
          background: "#10b981",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }
      },
      "Reset Password"
    )), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onClose,
        style: {
          width: "100%",
          padding: "12px",
          marginTop: "12px",
          background: "#9ca3af",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }
      },
      "Cancel"
    )));
  };
  var Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showForgot, setShowForgot] = useState(false);
    const handleSubmit = (e) => {
      e.preventDefault();
      const users = getUsers();
      const user = users.find((u) => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        onLogin(user);
      } else {
        setError("Invalid email or password");
      }
    };
    // footer rendering
    return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", display: "flex", flexDirection: "column" } },
      React.createElement("div", { style: { flex: 1 } },
        /* @__PURE__ */ React.createElement("div", { style: {
          maxWidth: "400px",
          margin: "100px auto",
          padding: "40px",
          background: "white",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
        } }, /* @__PURE__ */ React.createElement("h1", { style: { fontSize: "28px", marginBottom: "8px", color: "#1f2937" } }, "Group-Solution Hours Tracker"), /* @__PURE__ */ React.createElement("p", { style: { color: "#6b7280", marginBottom: "32px" } }, "Sign in to your account"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit }, /* @__PURE__ */ React.createElement(
          "input",
          {
            type: "email",
            placeholder: "Email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            style: {
              width: "100%",
              padding: "12px",
              marginBottom: "16px",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "16px",
              fontFamily: "inherit"
            },
            required: true
          }
        ), /* @__PURE__ */ React.createElement(
          "input",
          {
            type: "password",
            placeholder: "Password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            style: {
              width: "100%",
              padding: "12px",
              marginBottom: "24px",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "16px",
              fontFamily: "inherit"
            },
            required: true
          }
        ), error && /* @__PURE__ */ React.createElement("p", { style: { color: "#ef4444", marginBottom: "16px" } }, error), /* @__PURE__ */ React.createElement(
          "button",
          {
            type: "submit",
            style: {
              width: "100%",
              padding: "14px",
              background: "#3B82F6",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "transform 0.2s"
            },
            onMouseEnter: (e) => e.target.style.transform = "scale(1.02)",
            onMouseLeave: (e) => e.target.style.transform = "scale(1)"
          },
          "Sign In"
        )), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginTop: "16px" } }, /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: () => setShowForgot(true),
            style: {
              background: "none",
              border: "none",
              color: "#3B82F6",
              cursor: "pointer",
              fontSize: "14px",
              textDecoration: "underline"
            }
          },
          "Forgot Password?"
        )))
      ),
      showForgot && /* @__PURE__ */ React.createElement(ForgotPasswordModal, { onClose: () => setShowForgot(false) }),
      React.createElement(Footer, null)
    );
  };
  var Calendar = ({ year, month, onDayClick, teacherHours }) => {
    const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const getDayData = (day) => {
      const key = `${year}-${month}-${day}`;
      const entry = teacherHours[key];
      if (!entry) return null;
      return { hours: entry.hours, paid: entry.paid };
    };
    return /* @__PURE__ */ React.createElement("div", { style: { background: "white", borderRadius: "24px", padding: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginBottom: "16px" } }, weekDays.map((day) => /* @__PURE__ */ React.createElement("div", { key: day, style: { textAlign: "center", fontWeight: "600", color: "#6b7280", padding: "8px" } }, day))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" } }, days.map((day, idx) => {
      if (!day) return /* @__PURE__ */ React.createElement("div", { key: idx, style: { padding: "12px" } });
      const dayData = getDayData(day);
      let backgroundColor = "white";
      let color = "#1f2937";
      if (dayData) {
        if (dayData.paid) {
          backgroundColor = "#10b981";
          color = "white";
        } else {
          backgroundColor = "#ef4444";
          color = "white";
        }
      }
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: idx,
          onClick: () => onDayClick(day),
          style: {
            padding: "12px",
            textAlign: "center",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            backgroundColor,
            color,
            cursor: "pointer",
            transition: "all 0.2s",
            fontWeight: "500",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px"
          },
          onMouseEnter: (e) => {
            if (!dayData) e.target.style.transform = "scale(1.05)";
          },
          onMouseLeave: (e) => {
            e.target.style.transform = "scale(1)";
          }
        },
        /* @__PURE__ */ React.createElement("span", null, day),
        dayData && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "12px", fontWeight: "bold" } }, dayData.hours, "h")
      );
    })));
  };
  var ProfilePicture = ({ user, onPhotoUpdate }) => {
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        const updatedUser = updateUserPhoto(user.id, base64);
        if (updatedUser && onPhotoUpdate) {
          onPhotoUpdate(updatedUser);
        }
      };
      reader.readAsDataURL(file);
    };
    const getPhotoUrl = () => {
      if (user.photo && user.photo.startsWith("data:image")) {
        return user.photo;
      }
      return `https://ui-avatars.com/api/?background=3B82F6&color=fff&size=128&name=${user.name}`;
    };
    return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", display: "inline-block" } },
      /* @__PURE__ */ React.createElement("img", {
        src: getPhotoUrl(),
        alt: user.name,
        style: { width: "60px", height: "60px", borderRadius: "30px", objectFit: "cover" }
      }),
      /* @__PURE__ */ React.createElement("label", {
        htmlFor: "photo-upload",
        style: {
          position: "absolute",
          bottom: 0,
          right: 0,
          background: "#3B82F6",
          border: "2px solid white",
          borderRadius: "20px",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "14px",
          color: "white",
          padding: 0
        },
        title: "Change photo"
      },
      "\u{1F4F7}"
      ),
      /* @__PURE__ */ React.createElement(
        "input",
        {
          id: "photo-upload",
          type: "file",
          accept: "image/*",
          style: { display: "none" },
          onChange: handleFileChange
        }
      )
    );
  };
  var ProfileEditModal = ({ user, onClose, onUpdate }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState(user.securityQuestion || "");
    const [securityAnswer, setSecurityAnswer] = useState(user.securityAnswer || "");
    const [error, setError] = useState("");
    const handleSave = () => {
      if (!name.trim()) {
        setError("Name is required");
        return;
      }
      if (!email.trim()) {
        setError("Email is required");
        return;
      }
      const users = getUsers();
      const existing = users.find((u) => u.email === email && u.id !== user.id);
      if (existing) {
        setError("Email already in use");
        return;
      }
      if (password && password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (!securityQuestion.trim() || !securityAnswer.trim()) {
        setError("Security question and answer are required");
        return;
      }
      const updates = {
        name: name.trim(),
        email: email.trim(),
        securityQuestion: securityQuestion.trim(),
        securityAnswer: securityAnswer.trim()
      };
      if (password) {
        updates.password = password;
      }
      const updatedUser = updateUserDetails(user.id, updates);
      if (updatedUser && onUpdate) {
        onUpdate(updatedUser);
      }
      onClose();
    };
    return /* @__PURE__ */ React.createElement("div", { style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1e3
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      background: "white",
      borderRadius: "24px",
      padding: "24px",
      maxWidth: "500px",
      width: "90%",
      maxHeight: "90vh",
      overflowY: "auto"
    } }, /* @__PURE__ */ React.createElement("h3", { style: { marginBottom: "20px" } }, "Edit Profile"), /* @__PURE__ */ React.createElement("label", { style: { display: "block", marginBottom: "5px", fontWeight: "500" } }, "Name"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: name,
        onChange: (e) => setName(e.target.value),
        style: {
          width: "100%",
          padding: "12px",
          marginBottom: "16px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "16px"
        }
      }
    ), /* @__PURE__ */ React.createElement("label", { style: { display: "block", marginBottom: "5px", fontWeight: "500" } }, "Email"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "email",
        value: email,
        onChange: (e) => setEmail(e.target.value),
        style: {
          width: "100%",
          padding: "12px",
          marginBottom: "16px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "16px"
        }
      }
    ), /* @__PURE__ */ React.createElement("label", { style: { display: "block", marginBottom: "5px", fontWeight: "500" } }, "New Password (leave blank to keep unchanged)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        placeholder: "New password",
        value: password,
        onChange: (e) => setPassword(e.target.value),
        style: {
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "16px"
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        placeholder: "Confirm new password",
        value: confirmPassword,
        onChange: (e) => setConfirmPassword(e.target.value),
        style: {
          width: "100%",
          padding: "12px",
          marginBottom: "16px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "16px"
        }
      }
    ), /* @__PURE__ */ React.createElement("label", { style: { display: "block", marginBottom: "5px", fontWeight: "500" } }, "Security Question (for password recovery)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        placeholder: "e.g., What is your mother's maiden name?",
        value: securityQuestion,
        onChange: (e) => setSecurityQuestion(e.target.value),
        style: {
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "16px"
        }
      }
    ), /* @__PURE__ */ React.createElement("label", { style: { display: "block", marginBottom: "5px", fontWeight: "500" } }, "Answer"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        placeholder: "Your answer",
        value: securityAnswer,
        onChange: (e) => setSecurityAnswer(e.target.value),
        style: {
          width: "100%",
          padding: "12px",
          marginBottom: "16px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "16px"
        }
      }
    ), error && /* @__PURE__ */ React.createElement("p", { style: { color: "#ef4444", marginBottom: "16px" } }, error), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "12px" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleSave,
        style: {
          flex: 1,
          padding: "12px",
          background: "#3B82F6",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }
      },
      "Save Changes"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onClose,
        style: {
          flex: 1,
          padding: "12px",
          background: "#9ca3af",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }
      },
      "Cancel"
    ))));
  };
  var TeacherDashboard = ({ user, onLogout, forAdmin = false }) => {
    const [currentDate, setCurrentDate] = useState(/* @__PURE__ */ new Date());
    const [teacherHours, setTeacherHours] = useState({});
    const [selectedDay, setSelectedDay] = useState(null);
    const [hoursValue, setHoursValue] = useState(1);
    const [hoursPaid, setHoursPaid] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(user);
    const [showProfileEdit, setShowProfileEdit] = useState(false);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    useEffect(() => {
      const hours = getTeacherHours(user.id, forAdmin);
      setTeacherHours(hours);
    }, [user.id, forAdmin]);
    const calculateTotals = () => {
      let paid = 0;
      let unpaid = 0;
      Object.values(teacherHours).forEach((entry) => {
        const hrs = entry.hours || 0;
        if (entry.paid) paid += hrs;
        else unpaid += hrs;
      });
      return { paid, unpaid };
    };
    const handleDayClick = (day) => {
      const key = `${year}-${month}-${day}`;
      const existing = teacherHours[key];
      if (!forAdmin && existing?.paid) {
        alert("Cannot modify a paid hour");
        return;
      }
      setSelectedDay(day);
      setHoursValue(existing?.hours || 1);
      setHoursPaid(existing?.paid || false);
      setShowModal(true);
    };
    const saveHours = () => {
      if (!selectedDay) return;
      const key = `${year}-${month}-${selectedDay}`;
      const updated = { ...teacherHours };
      updated[key] = {
        hours: hoursValue,
        paid: hoursPaid,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      setTeacherHours(updated);
      saveTeacherHours(user.id, updated, forAdmin);
      setShowModal(false);
      setSaveMessage("Changes saved successfully!");
      setTimeout(() => setSaveMessage(""), 3e3);
    };
    const changeMonth = (increment) => {
      const newDate = new Date(year, month + increment, 1);
      setCurrentDate(newDate);
    };
    const totals = calculateTotals();
    const handlePhotoUpdate = (updatedUser) => {
      setCurrentUser(updatedUser);
    };
    const handleProfileUpdate = (updatedUser) => {
      setCurrentUser(updatedUser);
    };
    // FIXED: root div now participates in flex layout so footer stays at bottom
    return /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: {
      background: "white",
      borderRadius: "24px",
      padding: "20px",
      marginBottom: "24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "16px" } }, /* @__PURE__ */ React.createElement(ProfilePicture, { user: currentUser, onPhotoUpdate: handlePhotoUpdate }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: "20px", color: "#1f2937" } }, currentUser.name), /* @__PURE__ */ React.createElement("p", { style: { color: "#6b7280", fontSize: "14px" } }, forAdmin ? "Admin View (Separate Records)" : "Teacher"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "12px" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowProfileEdit(true),
        style: {
          padding: "10px 20px",
          background: "#3B82F6",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "600"
        }
      },
      "Edit Profile"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onLogout,
        style: {
          padding: "10px 20px",
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "600"
        }
      },
      forAdmin ? "Back to Admin" : "Logout"
    ))), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px"
    } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => changeMonth(-1),
        style: {
          padding: "10px 20px",
          background: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "18px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }
      },
      "\u2190"
    ), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: "24px", color: "white" } }, currentDate.toLocaleString("default", { month: "long", year: "numeric" })), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => changeMonth(1),
        style: {
          padding: "10px 20px",
          background: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "18px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }
      },
      "\u2192"
    )), /* @__PURE__ */ React.createElement(
      Calendar,
      {
        year,
        month,
        onDayClick: handleDayClick,
        teacherHours
      }
    ), /* @__PURE__ */ React.createElement("div", { style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginTop: "24px"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      background: "white",
      borderRadius: "24px",
      padding: "20px",
      textAlign: "center",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    } }, /* @__PURE__ */ React.createElement("p", { style: { color: "#10b981", fontSize: "14px", marginBottom: "8px" } }, "Paid Hours"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "32px", fontWeight: "bold", color: "#10b981" } }, totals.paid)), /* @__PURE__ */ React.createElement("div", { style: {
      background: "white",
      borderRadius: "24px",
      padding: "20px",
      textAlign: "center",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    } }, /* @__PURE__ */ React.createElement("p", { style: { color: "#ef4444", fontSize: "14px", marginBottom: "8px" } }, "Pending Payment"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "32px", fontWeight: "bold", color: "#ef4444" } }, totals.unpaid))), saveMessage && /* @__PURE__ */ React.createElement("div", { style: {
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#10b981",
      color: "white",
      padding: "12px 24px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
      zIndex: 1e3
    } }, saveMessage), showModal && /* @__PURE__ */ React.createElement("div", { style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1e3
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      background: "white",
      borderRadius: "24px",
      padding: "24px",
      maxWidth: "300px",
      width: "90%"
    } }, /* @__PURE__ */ React.createElement("h3", { style: { marginBottom: "16px" } }, "Mark Hours for ", selectedDay), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", marginBottom: "8px", fontWeight: "500" } }, "Number of hours:"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        min: "0.5",
        step: "0.5",
        value: hoursValue,
        onChange: (e) => setHoursValue(parseFloat(e.target.value) || 0),
        style: {
          width: "100%",
          padding: "8px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "16px"
        }
      }
    )), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: hoursPaid,
        onChange: (e) => setHoursPaid(e.target.checked)
      }
    ), "Mark as paid"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "12px" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: saveHours,
        style: {
          flex: 1,
          padding: "12px",
          background: "#3B82F6",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }
      },
      "Save"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowModal(false),
        style: {
          flex: 1,
          padding: "12px",
          background: "#9ca3af",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }
      },
      "Cancel"
    )))), showProfileEdit && /* @__PURE__ */ React.createElement(
      ProfileEditModal,
      {
        user: currentUser,
        onClose: () => setShowProfileEdit(false),
        onUpdate: handleProfileUpdate
      }
    ));
  };
  var AdminDashboard = ({ user, onLogout }) => {
    const [teachers, setTeachers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showTeacherView, setShowTeacherView] = useState(null);
    const [newTeacher, setNewTeacher] = useState({ name: "", email: "", password: "" });
    const [currentUser, setCurrentUser] = useState(user);
    const [showProfileEdit, setShowProfileEdit] = useState(false);
    useEffect(() => {
      const users = getUsers();
      setTeachers(users.filter((u) => u.role === "teacher"));
    }, []);
    const addTeacher = () => {
      if (!newTeacher.name || !newTeacher.email || !newTeacher.password) {
        alert("Please fill all fields");
        return;
      }
      const users = getUsers();
      const newUser = {
        id: generateId(),
        ...newTeacher,
        role: "teacher",
        photo: null,
        securityQuestion: "What is your favorite color?",
        securityAnswer: "blue"
      };
      users.push(newUser);
      saveUsers(users);
      setTeachers([...teachers, newUser]);
      setShowAddModal(false);
      setNewTeacher({ name: "", email: "", password: "" });
    };
    const deleteTeacher = (teacherId) => {
      if (confirm("Are you sure you want to delete this teacher?")) {
        const users = getUsers();
        const filtered = users.filter((u) => u.id !== teacherId);
        saveUsers(filtered);
        setTeachers(filtered.filter((u) => u.role === "teacher"));
        const teacherHoursStore = localStorage.getItem(STORAGE_KEYS.TEACHER_HOURS);
        const adminHoursStore = localStorage.getItem(STORAGE_KEYS.ADMIN_HOURS);
        if (teacherHoursStore) {
          const teacherHours = JSON.parse(teacherHoursStore);
          delete teacherHours[teacherId];
          localStorage.setItem(STORAGE_KEYS.TEACHER_HOURS, JSON.stringify(teacherHours));
        }
        if (adminHoursStore) {
          const adminHours = JSON.parse(adminHoursStore);
          delete adminHours[teacherId];
          localStorage.setItem(STORAGE_KEYS.ADMIN_HOURS, JSON.stringify(adminHours));
        }
      }
    };
    const handlePhotoUpdate = (updatedUser) => {
      setCurrentUser(updatedUser);
    };
    const handleProfileUpdate = (updatedUser) => {
      setCurrentUser(updatedUser);
    };
    if (showTeacherView) {
      return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setShowTeacherView(null),
          style: {
            marginBottom: "20px",
            padding: "10px 20px",
            background: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer"
          }
        },
        "\u2190 Back to Dashboard"
      ), /* @__PURE__ */ React.createElement(TeacherDashboard, { user: showTeacherView, onLogout: () => setShowTeacherView(null), forAdmin: true }));
    }
    return /* @__PURE__ */ React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0
  }
}, /* @__PURE__ */ React.createElement("div", { style: {
      background: "white",
      borderRadius: "24px",
      padding: "20px",
      marginBottom: "24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "16px" } }, /* @__PURE__ */ React.createElement(ProfilePicture, { user: currentUser, onPhotoUpdate: handlePhotoUpdate }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: "20px", color: "#1f2937" } }, currentUser.name), /* @__PURE__ */ React.createElement("p", { style: { color: "#6b7280", fontSize: "14px" } }, "Administrator"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "12px" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowProfileEdit(true),
        style: {
          padding: "10px 20px",
          background: "#3B82F6",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "600"
        }
      },
      "Edit Profile"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onLogout,
        style: {
          padding: "10px 20px",
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "600"
        }
      },
      "Logout"
    ))), /* @__PURE__ */ React.createElement("h2", { style: { color: "white", marginBottom: "20px", fontSize: "24px" } }, "Teachers"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "12px" } }, teachers.map((teacher) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: teacher.id,
        style: {
          background: "white",
          borderRadius: "24px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          transition: "transform 0.2s"
        },
        onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.02)",
        onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)"
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "16px" } }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: teacher.photo && teacher.photo.startsWith("data:image") ? teacher.photo : `https://ui-avatars.com/api/?background=3B82F6&color=fff&size=128&name=${teacher.name}`,
          alt: teacher.name,
          style: { width: "50px", height: "50px", borderRadius: "25px", objectFit: "cover" }
        }
      ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: "18px", color: "#1f2937" } }, teacher.name), /* @__PURE__ */ React.createElement("p", { style: { color: "#6b7280", fontSize: "12px" } }, teacher.email))),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "12px" } }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setShowTeacherView(teacher),
          style: {
            padding: "8px 16px",
            background: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer"
          }
        },
        "View Activity"
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => deleteTeacher(teacher.id),
          style: {
            padding: "8px 16px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer"
          }
        },
        "Delete"
      ))
    )), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowAddModal(true),
        style: {
          background: "white",
          borderRadius: "24px",
          padding: "16px",
          border: "2px dashed #3B82F6",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "600",
          color: "#3B82F6",
          marginTop: "12px",
          transition: "all 0.2s"
        },
        onMouseEnter: (e) => {
          e.target.style.background = "#3B82F6";
          e.target.style.color = "white";
        },
        onMouseLeave: (e) => {
          e.target.style.background = "white";
          e.target.style.color = "#3B82F6";
        }
      },
      "+ Add New Teacher"
    )), showAddModal && /* @__PURE__ */ React.createElement("div", { style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1e3
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      background: "white",
      borderRadius: "24px",
      padding: "24px",
      maxWidth: "400px",
      width: "90%"
    } }, /* @__PURE__ */ React.createElement("h3", { style: { marginBottom: "20px" } }, "Add New Teacher"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        placeholder: "Full Name",
        value: newTeacher.name,
        onChange: (e) => setNewTeacher({ ...newTeacher, name: e.target.value }),
        style: {
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "16px"
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "email",
        placeholder: "Email",
        value: newTeacher.email,
        onChange: (e) => setNewTeacher({ ...newTeacher, email: e.target.value }),
        style: {
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "16px"
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        placeholder: "Password",
        value: newTeacher.password,
        onChange: (e) => setNewTeacher({ ...newTeacher, password: e.target.value }),
        style: {
          width: "100%",
          padding: "12px",
          marginBottom: "24px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "16px"
        }
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "12px" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: addTeacher,
        style: {
          flex: 1,
          padding: "12px",
          background: "#3B82F6",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }
      },
      "Add"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowAddModal(false),
        style: {
          flex: 1,
          padding: "12px",
          background: "#9ca3af",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }
      },
      "Cancel"
    )))), showProfileEdit && /* @__PURE__ */ React.createElement(
      ProfileEditModal,
      {
        user: currentUser,
        onClose: () => setShowProfileEdit(false),
        onUpdate: handleProfileUpdate
      }
    ));
  };
  var App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isFirstRun, setIsFirstRun] = useState(false); // NEW

    useEffect(() => {
      const users = getUsers();
      if (users.length === 0) {
        // No users at all — brand new install, show setup screen
        setIsFirstRun(true);
        return;
      }
      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    }, []);

    const handleLogin = (user) => {
      setCurrentUser(user);
    };
    const handleLogout = () => {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      setCurrentUser(null);
    };

    // First-run: show admin account creation screen
    if (isFirstRun) {
      return React.createElement(FirstTimeSetup, {
        onComplete: (user) => {
          setIsFirstRun(false);
          setCurrentUser(user);
        }
      });
    }

    if (!currentUser) {
      return React.createElement(Login, { onLogin: handleLogin });
    }

    return React.createElement("div", {
        style: {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        }
    },
        React.createElement("div", {
            style: {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: "20px"
            }
        },
            currentUser.role === "admin"
                ? React.createElement(AdminDashboard, { user: currentUser, onLogout: handleLogout })
                : React.createElement(TeacherDashboard, { user: currentUser, onLogout: handleLogout, forAdmin: false })
        ),
        React.createElement(Footer, null)
    );
  };
  var style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
    }
`;
  document.head.appendChild(style);
  var root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(React.createElement(App));
})();
