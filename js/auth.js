// Very simple demo auth. DO NOT use in production.
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'secret123';

document.addEventListener('DOMContentLoaded', function(){
  const loginForm = document.getElementById('login-form');
  if(loginForm){
    loginForm.addEventListener('submit', function(e){ e.preventDefault();
      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value.trim();
      if(u===ADMIN_USER && p===ADMIN_PASS){ localStorage.setItem('admin_logged_in','1'); location.href='dashboard.html'; } else { alert('Invalid credentials (demo)'); }
    });
  }
});
