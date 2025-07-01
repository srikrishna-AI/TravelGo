document.addEventListener('DOMContentLoaded', function() {
  // Search form
  const form = document.getElementById('searchForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const to_city = document.getElementById('to_city').value;
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = '<span class="loader"></span> Searching...';
      try {
        const res = await fetch(`/search?to_city=${encodeURIComponent(to_city)}`);
        const data = await res.json();
        resultsDiv.innerHTML = '';
        if (data.results && data.results.length > 0) {
          data.results.forEach(item => {
            const div = document.createElement('div');
            div.className = 'result-card';
            div.innerHTML = `<strong>${item.city}</strong> - ₹${item.price}<br><img src="${item.image}" width="100" />`;
            resultsDiv.appendChild(div);
          });
        } else {
          resultsDiv.textContent = 'No results found.';
        }
      } catch (err) {
        resultsDiv.textContent = 'Error fetching results.';
      }
    });
  }

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.getElementById('login_email').value;
      const password = document.getElementById('login_password').value;
      const msgDiv = document.getElementById('loginMessage');
      msgDiv.innerHTML = '<span class="loader"></span> Logging in...';
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      try {
        const res = await fetch('/login', { method: 'POST', body: formData });
        if (res.ok) {
          msgDiv.textContent = 'Login successful!';
          msgDiv.style.color = 'green';
        } else {
          const err = await res.json().catch(() => ({}));
          msgDiv.textContent = err.detail || 'Login failed.';
          msgDiv.style.color = 'red';
        }
      } catch (err) {
        msgDiv.textContent = 'Error during login.';
        msgDiv.style.color = 'red';
      }
    });
  }

  // Bookings form
  const bookingsForm = document.getElementById('bookingsForm');
  if (bookingsForm) {
    bookingsForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.getElementById('bookings_email').value;
      const bookingsDiv = document.getElementById('bookingsResults');
      bookingsDiv.innerHTML = '<span class="loader"></span> Loading bookings...';
      try {
        const res = await fetch(`/bookings?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        bookingsDiv.innerHTML = '';
        if (data.bookings && data.bookings.length > 0) {
          data.bookings.forEach(b => {
            const div = document.createElement('div');
            div.className = 'result-card';
            div.innerHTML = `<strong>${b.destination}</strong> - ${b.date} - ${b.passengers} passenger(s) - ₹${b.price}`;
            bookingsDiv.appendChild(div);
          });
        } else {
          bookingsDiv.textContent = 'No bookings found.';
        }
      } catch (err) {
        bookingsDiv.textContent = 'Error fetching bookings.';
      }
    });
  }
});
