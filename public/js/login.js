const form = document.getElementById('loginForm')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        const data = await response.json()

        if (response.ok) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('name', data.user.name)
            localStorage.setItem('role', data.user.role)

            if (data.user.role === 'Vendor') {
                window.location.href = 'vendor-dashboard.html'
            } else {
                window.location.href = 'search.html'
            }
        } else {
            alert(data.msg)
        }
    } catch (error) {
        alert('Login failed')
    }
})