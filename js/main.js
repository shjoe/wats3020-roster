// Constructor method derives and stores username from email provided.

class Person {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.username = email.split('@')[0];
    }
}

// New "Student" class inherited from "Person." Attendance recorded and returns percentage.

class Student extends Person {
    constructor(name, email) {
        super(name, email);
        this.attendance = [];
    }
    calculateAttendance() {
        if (this.attendance.length > 0) {
            let counter = 0;
            for (let mark of this.attendance) {
                counter += mark;
            }
            let attendancePercentage = (counter / this.attendance.length) * 100;
            return `${attendancePercentage.toFixed(2)}%`
        } else {
            return '0%';
        }
    }
}

// New "Teacher" class inherited from "Person." Records new parameter "honorific."

class Teacher extends Person {
    constructor(name, email, honorific) {
        super(name, email);
        this.honorific = honorific;
    }
}

class Course {
    constructor(courseCode, courseTitle, courseDescription) {
        this.code = courseCode;
        this.title = courseTitle;
        this.description = courseDescription;
        this.teacher = null;
        this.students = [];
    }

    // Prompt to add student info that will be used to instantiate new Student and push.

    addStudent() {
        let name = prompt("Enter student full name:", "Shure Joe");
        let email = prompt("Enter student email:", "joeshure@seattleu.edu");
        let newStudent = new Student(name, email);
        this.students.push(newStudent);
        updateRoster(this);
    }

    // Prompt to add teacher info and update roster.

    setTeacher() {
        let name = prompt("Enter full teacher name:", "Becky Peltz");
        let email = prompt("Enter teacher email:", "rpeltz@seattleu.edu");
        let honorific = prompt("Enter honorific:", "Prof.");
        this.teacher = new Teacher(name, email, honorific);
        updateRoster(this);
    }

    // Student's attendance marked through "username" match in "Student" object.

    markAttendance(username, status = "present") {
        let foundStudent = this.findStudent(username);
        if (status === "present") {
            foundStudent.attendance.push(1);
        } else {
            foundStudent.attendance.push(0);
        }
        updateRoster(this);
    }

    //////////////////////////////////////////////
    // Methods provided for you -- DO NOT EDIT /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    findStudent(username) {
        // This method provided for convenience. It takes in a username and looks
        // for that username on student objects contained in the `this.students`
        // Array.
        let foundStudent = this.students.find(function (student, index) {
            return student.username == username;
        });
        return foundStudent;
    }
}

// Prompts for course information .

let courseCode = prompt("Enter the course code: ", "WATS 3020");
let courseTitle = prompt("Enter the course title: ", "Intro to JavaScript");
let courseDescription = prompt("Enter the course description: ", "Learning to code JS");

// Create new course with user supplied information.

let myCourse = new Course(courseCode, courseTitle, courseDescription);

///////////////////////////////////////////////////
//////// Main Script /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// This script runs the page. You should only edit it if you are attempting a //
// stretch goal. Otherwise, this script calls the functions that you have     //
// created above.                                                             //
////////////////////////////////////////////////////////////////////////////////

let rosterTitle = document.querySelector('#course-title');
rosterTitle.innerHTML = `${myCourse.code}: ${myCourse.title}`;

let rosterDescription = document.querySelector('#course-description');
rosterDescription.innerHTML = myCourse.description;

if (myCourse.teacher) {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = `${myCourse.teacher.honorific} ${myCourse.teacher.name}`;
} else {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = "Not Set";
}

let rosterTbody = document.querySelector('#roster tbody');
// Clear Roster Content
rosterTbody.innerHTML = '';

// Create event listener for adding a student.
let addStudentButton = document.querySelector('#add-student');
addStudentButton.addEventListener('click', function (e) {
    console.log('Calling addStudent() method.');
    myCourse.addStudent();
})

// Create event listener for adding a teacher.
let addTeacherButton = document.querySelector('#add-teacher');
addTeacherButton.addEventListener('click', function (e) {
    console.log('Calling setTeacher() method.');
    myCourse.setTeacher();
})

// Call Update Roster to initialize the content of the page.
updateRoster(myCourse);

function updateRoster(course) {
    let rosterTbody = document.querySelector('#roster tbody');
    // Clear Roster Content
    rosterTbody.innerHTML = '';
    if (course.teacher) {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = `${course.teacher.honorific} ${course.teacher.name}`;
    } else {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = "Not Set";
    }
    // Populate Roster Content
    for (student of course.students) {
        // Create a new row for the table.
        let newTR = document.createElement('tr');

        // Create table cells for each data point and append them to the new row.
        let nameTD = document.createElement('td');
        nameTD.innerHTML = student.name;
        newTR.appendChild(nameTD);

        let emailTD = document.createElement('td');
        emailTD.innerHTML = student.email;
        newTR.appendChild(emailTD);

        let attendanceTD = document.createElement('td');
        attendanceTD.innerHTML = student.calculateAttendance();
        newTR.appendChild(attendanceTD);

        let actionsTD = document.createElement('td');
        let presentButton = document.createElement('button');
        presentButton.innerHTML = "Present";
        presentButton.setAttribute('data-username', student.username);
        presentButton.setAttribute('class', 'present');
        actionsTD.appendChild(presentButton);

        let absentButton = document.createElement('button');
        absentButton.innerHTML = "Absent";
        absentButton.setAttribute('data-username', student.username);
        absentButton.setAttribute('class', 'absent');
        actionsTD.appendChild(absentButton);

        newTR.appendChild(actionsTD);

        // Append the new row to the roster table.
        rosterTbody.appendChild(newTR);
    }
    // Call function to set event listeners on attendance buttons.
    setupAttendanceButtons();
}

function setupAttendanceButtons() {
    // Set up the event listeners for buttons to mark attendance.
    let presentButtons = document.querySelectorAll('.present');
    for (button of presentButtons) {
        button.addEventListener('click', function (e) {
            console.log(`Marking ${e.target.dataset.username} present.`);
            myCourse.markAttendance(e.target.dataset.username);
            updateRoster(myCourse);
        });
    }
    let absentButtons = document.querySelectorAll('.absent');
    for (button of absentButtons) {
        button.addEventListener('click', function (e) {
            console.log(`Marking ${e.target.dataset.username} absent.`);
            myCourse.markAttendance(e.target.dataset.username, 'absent');
            updateRoster(myCourse);
        });
    }
}