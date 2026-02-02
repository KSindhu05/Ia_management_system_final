export const studentData = {
    id: 'S001',
    name: 'Rahul Sharma',
    rollNo: '21CS045',
    branch: 'Computer Science',
    semester: '5th',
    attendance: 78, // Percentage
    profileImage: null, // Use initial
};

export const iaMarksData = [
    { subject: 'Software Engineering', ia1: 18, ia2: 19, ia3: 17, average: 18, remarks: 'Good' },
    { subject: 'Java Programming', ia1: 15, ia2: 16, ia3: 18, average: 16, remarks: 'Improve' },
    { subject: 'Web Technologies', ia1: 20, ia2: 20, ia3: 19, average: 20, remarks: 'Excellent' },
    { subject: 'Data Communications', ia1: 12, ia2: 14, ia3: 15, average: 14, remarks: 'Need Focus' },
    { subject: 'Project Work-I', ia1: 22, ia2: 24, ia3: 23, average: 23, remarks: 'Very Good' }, // Lab calculated out of 25?
];

export const facultyData = {
    id: 'F001',
    name: 'Dr. A. Verma',
    designation: 'Senior Lecturer',
    department: 'Computer Science',
};

export const facultySubjects = [
    { id: 'SUB101', name: 'Software Engineering', semester: '5th', studentCount: 45, type: 'Theory' },
    { id: 'SUB102', name: 'Data Structures', semester: '3rd', studentCount: 52, type: 'Theory' },
    { id: 'SUB103', name: 'Web Dev Lab', semester: '5th', studentCount: 45, type: 'Lab' },
];

export const studentsList = [
    { id: 'S001', rollNo: '21CS045', name: 'Rahul Sharma', ia1: 18, ia2: 19, ia3: 17 },
    { id: 'S002', rollNo: '21CS046', name: 'Priya Patel', ia1: 22, ia2: 21, ia3: 23 },
    { id: 'S003', rollNo: '21CS047', name: 'Amit Singh', ia1: 15, ia2: 12, ia3: 14 },
    { id: 'S004', rollNo: '21CS048', name: 'Sneha Gupta', ia1: 20, ia2: 24, ia3: 22 },
    { id: 'S005', rollNo: '21CS049', name: 'Vikram Malhotra', ia1: 0, ia2: 0, ia3: 0 },
];

export const hodData = {
    name: 'Prof. R. Deshmukh',
    department: 'Computer Science & Engg',
};

export const departmentStats = {
    totalStudents: 180,
    facultyCount: 12,
    averageAttendance: 85,
    passPercentage: 92,
};

export const branchPerformanceData = {
    labels: ['3rd Sem', '5th Sem'],
    averageIA: [18.5, 19.2], // Out of 25
    attendance: [82, 88],
};

export const collegeStats = {
    branches: ['CSE', 'ME', 'EE', 'CE', 'MME'],
    passFailData: [85, 15], // Pass, Fail %
    branchPerformance: [82, 78, 80, 75, 79], // Avg Marks %
    attendanceTrend: [88, 85, 82, 80, 84],
    predictionStatus: 'Green', // Green, Yellow, Red
};

export const studentNotifications = [
    { id: 1, type: 'alert', message: 'New IA-5 Marks Uploaded for CAD', date: '2 hrs ago' },
    { id: 2, type: 'info', message: 'Parent Meeting Scheduled for 20th Dec', date: '1 day ago' },
    { id: 3, type: 'warning', message: 'IA-6 Submission Deadline Tomorrow', date: '2 days ago' },
];

export const upcomingIAs = [
    { id: 1, subject: 'CAD Design', exam: 'IA-5', date: '15-Dec', time: '10:00 AM' },
    { id: 2, subject: 'Java Programming', exam: 'IA-6', date: '22-Dec', time: '02:00 PM' },
    { id: 3, subject: 'Industrial Mgmt', exam: 'IA-5', date: '24-Dec', time: '10:00 AM' },
];

export const studentSkills = [
    { id: 1, name: 'AutoCAD Basics', progress: 100, status: 'Completed' },
    { id: 2, name: 'Java Essentials', progress: 75, status: 'In Progress' },
    { id: 3, name: 'Safety Management', progress: 30, status: 'Started' },
];

export const workshopSchedule = [
    { id: 1, title: 'IoT Workshop', date: '18-Dec', location: 'Lab 2', status: 'Upcoming' },
    { id: 2, title: 'Resume Building', date: '25-Dec', location: 'Seminar Hall', status: 'Registered' },
];

export const facultyClassAnalytics = {
    avgScore: 72,
    lowPerformers: 8,
    topPerformers: 5,
    evaluated: '240/300',
    pending: 15
};

export const labSchedule = [
    { id: 1, day: 'Mon', time: '10:00 - 12:00', batch: 'CS-A', lab: 'Network Lab' },
    { id: 2, day: 'Wed', time: '02:00 - 04:00', batch: 'CS-B', lab: 'DBMS Lab' },
    { id: 3, day: 'Fri', time: '09:00 - 11:00', batch: 'CS-A', lab: 'Programming Lab' },
];

export const principalStats = {
    totalStudents: 1250,
    totalFaculty: 85,
    avgAttendance: 88,
    placementRate: 92,
    feeCollection: '85%'
};

export const broadcastMessages = [
    { id: 1, target: 'All Students', message: 'Holiday declared on 25th Dec', date: '21 Dec' },
    { id: 2, target: 'Faculty', message: 'Submit IA marks by Friday', date: '20 Dec' },
    { id: 3, target: 'HODs', message: 'Department meeting at 4 PM', date: '19 Dec' }
];

export const principalSchedule = [
    { id: 1, title: 'Meeting with Trust Members', time: '10:00 AM', type: 'High Priority' },
    { id: 2, title: 'Campus Inspection', time: '02:00 PM', type: 'Routine' },
    { id: 3, title: 'Review with Exam Cell', time: '04:30 PM', type: 'Urgent' }
];

export const hodBranchComparison = {
    labels: ['CS', 'IS', 'EC', 'ME', 'CV'],
    passPercentage: [92, 88, 76, 65, 70],
    attendance: [85, 82, 78, 70, 75]
};

export const departmentAlerts = [
    { id: 1, type: 'critical', message: 'Civil Dept IA-3 Submission Delayed', date: '1 hr ago' },
    { id: 2, type: 'warning', message: 'Low Attendance in Mech 3rd Sem', date: '5 hrs ago' },
    { id: 3, type: 'info', message: 'New Syllabus Approved for CS', date: '1 day ago' },
];

export const resourceRequests = [
    { id: 1, request: 'New Projector for Lab 1', requester: 'Mr. Patil', status: 'Pending' },
    { id: 2, request: 'Guest Lecture Honorarium', requester: 'Mrs. Rao', status: 'Approved' },
];


