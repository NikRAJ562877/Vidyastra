const user = JSON.parse(localStorage.getItem('auth_user')) || null;

if (user && user.role) {
    if (user.role === 1) {
        window.location.href = '/admin-dashboard';
    } else if (user.role === 2) {
        window.location.href = '/teacher-dashboard';
    } else if (user.role === 3) {
        window.location.href = '/student-dashboard';
    } else {
        console.error('Invalid role');
    }
} else {
    console.error('No user data found in local storage.');
}