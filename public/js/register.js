const form = document.getElementById('registerForm')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const name = document.getElementById('name').value
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const role = document.getElementById('role').value

  try {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        name,
        email,
        password,
        role
      })
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('name', data.user.name)
      localStorage.setItem('role', data.user.role)
      alert('Registration successful!')

      if (data.user.role === 'Vendor') {
        window.location.href = 'vendor-dashboard.html'
      } else {
        window.location.href = 'search.html'
      }
    } else {
      alert(data.msg)
    }
  } catch (error) {
    alert('Registration failed')
  }
})