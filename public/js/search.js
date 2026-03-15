const searchForm = document.getElementById('searchForm')
const resultsContainer = document.getElementById('results')
const resultCount = document.getElementById('resultCount')
const resetBtn = document.getElementById('resetBtn')
const logoutBtn = document.getElementById('logoutBtn')
const token = localStorage.getItem('token')

const welcomeName = document.getElementById('welcomeName')
const userName = localStorage.getItem('name')

if (welcomeName && userName) {
  welcomeName.textContent = `Hi, ${userName}`
}

async function loadSearchResults(queryString = '') {
  try {
    const response = await fetch(`/api/v1/products/search${queryString}`)
    const data = await response.json()

    if (!response.ok) {
      resultsContainer.innerHTML = `<p class="text-red-500">${data.msg || 'Could not load results'}</p>`
      resultCount.textContent = ''
      return
    }

    resultCount.textContent = `${data.count} result(s)`
    resultsContainer.innerHTML = ''

    if (data.products.length === 0) {
      resultsContainer.innerHTML = '<p class="text-gray-500">No products found.</p>'
      return
    }

    data.products.forEach((product) => {
      const dietTagsText =
        product.dietTags && product.dietTags.length > 0
          ? product.dietTags.join(', ')
          : 'None'

      const marketName = product.marketPlaceId?.marketName || 'Unknown marketplace'
      const marketLocation = product.marketPlaceId?.location || 'No location'

      const card = document.createElement('div')
      card.className = 'border rounded-xl p-4 bg-gray-50'

      card.innerHTML = `
        <h3 class="text-xl font-semibold text-green-600 mb-2">${product.name}</h3>
        <p class="text-gray-700"><span class="font-medium">Category:</span> ${product.category}</p>
        <p class="text-gray-700"><span class="font-medium">Diet Tags:</span> ${dietTagsText}</p>
        <p class="text-gray-700"><span class="font-medium">Stock:</span> ${product.inStock ? 'In Stock' : 'Out of Stock'}</p>
        <p class="text-gray-700 mt-2"><span class="font-medium">Marketplace:</span> ${marketName}</p>
        <p class="text-gray-500 text-sm">${marketLocation}</p>
      `

      resultsContainer.appendChild(card)
    })
  } catch (error) {
    resultsContainer.innerHTML = '<p class="text-red-500">Something went wrong.</p>'
    resultCount.textContent = ''
  }
}

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const name = document.getElementById('name').value.trim()
  const category = document.getElementById('category').value.trim()
  const dietTag = document.getElementById('dietTag').value.trim()

  const params = new URLSearchParams()

  if (name) params.append('name', name)
  if (category) params.append('category', category)
  if (dietTag) params.append('dietTag', dietTag)

  const queryString = params.toString() ? `?${params.toString()}` : ''
  loadSearchResults(queryString)
})

resetBtn.addEventListener('click', () => {
  document.getElementById('name').value = ''
  document.getElementById('category').value = ''
  document.getElementById('dietTag').value = ''
  loadSearchResults()
})

if (!token && logoutBtn) {
  logoutBtn.style.display = 'none'
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    })
  } catch (error) {
    console.log('Logout request failed')
  }

  localStorage.removeItem('name')
  localStorage.removeItem('role')
  window.location.href = 'login.html'

})
}

loadSearchResults()