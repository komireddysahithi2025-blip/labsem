
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const dashboard = document.getElementById("dashboard");
const message = document.getElementById("message");
const welcome = document.getElementById("welcome");
const dashboardContent = document.getElementById("dashboardContent");

const ADMIN_EMAIL = "admin@college.edu";
const ADMIN_PASSWORD = "Admin@123";

function showLogin() {
    loginForm.hidden = false;
    signupForm.hidden = true;
    dashboard.hidden = true;
    message.textContent = "";
}

function showSignup() {
    loginForm.hidden = true;
    signupForm.hidden = false;
    dashboard.hidden = true;
    message.textContent = "";
}

function showDashboard(name, role, email) {
    loginForm.hidden = true;
    signupForm.hidden = true;
    dashboard.hidden = false;
    message.textContent = "";

    welcome.textContent = "Welcome, " + name + "!";

    dashboardContent.replaceChildren();

    const roleHeading = document.createElement("h3");
    roleHeading.textContent =
        role === "admin" ? "Admin Dashboard" : "Student Dashboard";
    dashboardContent.appendChild(roleHeading);

    if (role === "admin") {
        const info = document.createElement("p");
        info.textContent = "You can view registered student accounts.";
        dashboardContent.appendChild(info);

        const studentsHeading = document.createElement("h3");
        studentsHeading.textContent = "Registered Students";
        dashboardContent.appendChild(studentsHeading);

        let count = 0;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key && key.startsWith("student_")) {
                try {
                    const student = JSON.parse(localStorage.getItem(key));

                    const studentInfo = document.createElement("p");
                    studentInfo.textContent =
                        student.name + " (" + student.email + ")";

                    dashboardContent.appendChild(studentInfo);
                    count++;
                } catch (error) {
                    // Ignore invalid stored records.
                }
            }
        }

        if (count === 0) {
            const empty = document.createElement("p");
            empty.textContent = "No students registered yet.";
            dashboardContent.appendChild(empty);
        }
    } else {
        const emailInfo = document.createElement("p");
        emailInfo.textContent = "Email: " + email;
        dashboardContent.appendChild(emailInfo);

        const roleInfo = document.createElement("p");
        roleInfo.textContent = "Role: Student";
        dashboardContent.appendChild(roleInfo);

        const courseInfo = document.createElement("p");
        courseInfo.textContent = "Welcome to your college portal.";
        dashboardContent.appendChild(courseInfo);
    }
}

// Student Registration
signupForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("studentName")
        .value.trim();

    const email = document.getElementById("studentEmail")
        .value.trim().toLowerCase();

    const password = document.getElementById("studentPassword")
        .value;

    if (!name || !email || !password) {
        message.textContent = "Please fill in all fields.";
        return;
    }

    if (email === ADMIN_EMAIL) {
        message.textContent = "This email is reserved for admin.";
        return;
    }

    const key = "student_" + email;

    if (localStorage.getItem(key)) {
        message.textContent = "Student account already exists.";
        return;
    }

    const student = {
        name: name,
        email: email,
        password: password,
        role: "student"
    };

    localStorage.setItem(key, JSON.stringify(student));

    signupForm.reset();
    showLogin();
    message.textContent = "Registration successful! Please login.";
});

// Login for Admin and Students
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail")
        .value.trim().toLowerCase();

    const password = document.getElementById("loginPassword")
        .value;

    const role = document.getElementById("loginRole").value;

    if (role === "admin") {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            loginForm.reset();
            showDashboard("Admin", "admin", email);
        } else {
            message.textContent = "Invalid admin email or password.";
        }
        return;
    }

    const savedStudent = localStorage.getItem("student_" + email);

    if (!savedStudent) {
        message.textContent = "Student account not found. Please signup.";
        return;
    }

    let student;

    try {
        student = JSON.parse(savedStudent);
    } catch (error) {
        message.textContent = "Invalid account data. Please register again.";
        return;
    }

    if (student.role === "student" && student.password === password) {
        loginForm.reset();
        showDashboard(student.name, "student", student.email);
    } else {
        message.textContent = "Invalid student password.";
    }
});

// Logout
document.getElementById("logoutButton").addEventListener("click", function() {
    showLogin();
    loginForm.reset();
    signupForm.reset();
    message.textContent = "You have logged out successfully.";
});
