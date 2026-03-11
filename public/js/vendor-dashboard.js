const token = localStorage.getItem('token')

if (!token) {
    window.location.href = 'login.html'
}

const marketForm = document.getElementById('marketForm')
const productForm = document.getElementById('productForm')
const marketList = document.getElementById('marketList')
const productList = document.getElementById('productList')
const marketMessage = document.getElementById('marketMessage')
const productMessage = document.getElementById('productMessage')
const marketPlaceSelect = document.getElementById('marketPlaceId')
const logoutBtn = document.getElementById('logoutBtn')

const editProductModal = document.getElementById('editProductModal')
const closeModalBtn = document.getElementById('closeModalBtn')
const editProductForm = document.getElementById('editProductForm')
const editProductMessage = document.getElementById('editProductMessage')

const editMarketModal = document.getElementById('editMarketModal')
const closeMarketModalBtn = document.getElementById('closeMarketModalBtn')
const editMarketForm = document.getElementById('editMarketForm')
const editMarketMessage = document.getElementById('editMarketMessage')
const welcomeName = document.getElementById('welcomeName')
const userName = localStorage.getItem('name')

if (welcomeName && userName) {
    welcomeName.textContent = `Hi, ${userName}`
}


let currentProductId = null
let currentMarketId = null

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    localStorage.removeItem('role')
    window.location.href = 'login.html'
})

const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
}

async function loadMarkets() {
    try {
        const response = await fetch('/api/v1/markets', {
            method: 'GET',
            headers: authHeaders,
        })

        const data = await response.json()

        if (!response.ok) {
            marketList.innerHTML = `<p class="text-red-500">${data.msg || 'Could not load marketplaces'}</p>`
            return
        }

        marketList.innerHTML = ''
        marketPlaceSelect.innerHTML = '<option value="">Select marketplace</option>'

        if (data.markets.length === 0) {
            marketList.innerHTML = '<p class="text-gray-500">No marketplaces yet.</p>'
            return
        }

        data.markets.forEach((market) => {
            const div = document.createElement('div')
            div.className = 'border rounded-lg p-4 flex justify-between items-start gap-4'

            const formattedDate = market.openingDate
                ? new Date(market.openingDate).toLocaleDateString()
                : 'Not added'

            div.innerHTML = `
        <div>
          <h3 class="font-semibold text-lg text-green-600">${market.marketName}</h3>
          <p class="text-gray-600">${market.location}</p>
          <p class="text-gray-600">${market.address}</p>
          <p class="text-gray-600">Category: ${market.category || 'None'}</p>
          <p class="text-gray-600">Opening Date: ${formattedDate}</p>
        </div>

        <div class="flex gap-2">
          <button
            class="edit-market-btn bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            data-id="${market._id}"
            data-name="${market.marketName}"
            data-location="${market.location}"
            data-address="${market.address}"
            data-description="${market.description || ''}"
            data-category="${market.category || ''}"
            data-openingdate="${market.openingDate ? market.openingDate.split('T')[0] : ''}"
          >
            Edit
          </button>

          <button
            class="delete-market-btn bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            data-id="${market._id}"
          >
            Delete
          </button>
        </div>
      `
            marketList.appendChild(div)

            const option = document.createElement('option')
            option.value = market._id
            option.textContent = market.marketName
            marketPlaceSelect.appendChild(option)
        })

        addMarketDeleteEvents()
        addMarketEditEvents()
    } catch (error) {
        marketList.innerHTML = '<p class="text-red-500">Error loading marketplaces</p>'
    }
}

async function loadProducts() {
    try {
        const response = await fetch('/api/v1/products', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const data = await response.json()

        if (!response.ok) {
            productList.innerHTML = `<p class="text-red-500">${data.msg || 'Could not load products'}</p>`
            return
        }

        productList.innerHTML = ''

        if (data.products.length === 0) {
            productList.innerHTML = '<p class="text-gray-500">No products yet.</p>'
            return
        }

        data.products.forEach((product) => {
            const div = document.createElement('div')
            div.className = 'border rounded-lg p-4 flex justify-between items-start gap-4'

            const dietTagsText = product.dietTags && product.dietTags.length > 0
                ? product.dietTags.join(', ')
                : 'None'

            div.innerHTML = `
        <div>
          <h3 class="font-semibold text-lg text-green-600">${product.name}</h3>
          <p class="text-gray-600">Category: ${product.category}</p>
          <p class="text-gray-600">Diet Tags: ${dietTagsText}</p>
          <p class="text-gray-600">Stock: ${product.inStock ? 'In Stock' : 'Out of Stock'}</p>
        </div>

        <div class="flex gap-2">
          <button
            class="edit-btn bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            data-id="${product._id}"
            data-name="${product.name}"
            data-category="${product.category}"
            data-diettags='${JSON.stringify(product.dietTags || [])}'
            data-instock="${product.inStock}"
          >
            Edit
          </button>

          <button
            class="delete-btn bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            data-id="${product._id}"
          >
            Delete
          </button>
        </div>
      `
            productList.appendChild(div)
        })

        addDeleteEvents()
        addEditEvents()
    } catch (error) {
        productList.innerHTML = '<p class="text-red-500">Error loading products</p>'
    }
}

marketForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const marketName = document.getElementById('marketName').value
    const location = document.getElementById('location').value
    const address = document.getElementById('address').value
    const description = document.getElementById('description').value
    const category = document.getElementById('category').value
    const openingDate = document.getElementById('openingDate').value

    try {
        const response = await fetch('/api/v1/markets', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                marketName,
                location,
                address,
                description,
                category,
                openingDate,
            }),
        })

        const data = await response.json()

        if (response.ok) {
            marketMessage.textContent = 'Marketplace created successfully'
            marketMessage.className = 'mt-4 text-sm text-green-600'
            marketForm.reset()
            loadMarkets()
        } else {
            marketMessage.textContent = data.msg || 'Could not create marketplace'
            marketMessage.className = 'mt-4 text-sm text-red-500'
        }
    } catch (error) {
        marketMessage.textContent = 'Something went wrong'
        marketMessage.className = 'mt-4 text-sm text-red-500'
    }
})

productForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const name = document.getElementById('productName').value
    const category = document.getElementById('productCategory').value
    const dietTagsInput = document.getElementById('dietTags').value
    const marketPlaceId = document.getElementById('marketPlaceId').value
    const inStock = document.getElementById('inStock').value === 'true'

    const dietTags = dietTagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '')

    try {
        const response = await fetch('/api/v1/products', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name,
                category,
                dietTags,
                inStock,
                marketPlaceId,
            }),
        })

        const data = await response.json()

        if (response.ok) {
            productMessage.textContent = 'Product added successfully'
            productMessage.className = 'mt-4 text-sm text-green-600'
            productForm.reset()
            loadProducts()
        } else {
            productMessage.textContent = data.msg || 'Could not add product'
            productMessage.className = 'mt-4 text-sm text-red-500'
        }
    } catch (error) {
        productMessage.textContent = 'Something went wrong'
        productMessage.className = 'mt-4 text-sm text-red-500'
    }
})

function addDeleteEvents() {
    const deleteButtons = document.querySelectorAll('.delete-btn')

    deleteButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const productId = button.dataset.id

            try {
                const response = await fetch(`/api/v1/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const data = await response.json()

                if (response.ok) {
                    loadProducts()
                } else {
                    alert(data.msg || 'Could not delete product')
                }
            } catch (error) {
                alert('Something went wrong')
            }
        })
    })
}

function addEditEvents() {
    const editButtons = document.querySelectorAll('.edit-btn')

    editButtons.forEach((button) => {
        button.addEventListener('click', () => {
            currentProductId = button.dataset.id

            document.getElementById('editProductName').value = button.dataset.name
            document.getElementById('editProductCategory').value = button.dataset.category
            document.getElementById('editDietTags').value = JSON.parse(button.dataset.diettags).join(', ')
            document.getElementById('editInStock').value = button.dataset.instock

            editProductMessage.textContent = ''
            editProductModal.classList.remove('hidden')
        })
    })
}

function addMarketDeleteEvents() {
    const deleteButtons = document.querySelectorAll('.delete-market-btn')

    deleteButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const marketId = button.dataset.id

            try {
                const response = await fetch(`/api/v1/markets/${marketId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const data = await response.json()

                if (response.ok) {
                    loadMarkets()
                    loadProducts()
                } else {
                    alert(data.msg || 'Could not delete marketplace')
                }
            } catch (error) {
                alert('Something went wrong')
            }
        })
    })
}

function addMarketEditEvents() {
    const editButtons = document.querySelectorAll('.edit-market-btn')

    editButtons.forEach((button) => {
        button.addEventListener('click', () => {
            currentMarketId = button.dataset.id

            document.getElementById('editMarketName').value = button.dataset.name
            document.getElementById('editLocation').value = button.dataset.location
            document.getElementById('editAddress').value = button.dataset.address
            document.getElementById('editDescription').value = button.dataset.description
            document.getElementById('editCategory').value = button.dataset.category
            document.getElementById('editOpeningDate').value = button.dataset.openingdate

            editMarketMessage.textContent = ''
            editMarketModal.classList.remove('hidden')
        })
    })
}

closeModalBtn.addEventListener('click', () => {
    editProductModal.classList.add('hidden')
})

closeMarketModalBtn.addEventListener('click', () => {
    editMarketModal.classList.add('hidden')
})

editProductForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const name = document.getElementById('editProductName').value
    const category = document.getElementById('editProductCategory').value
    const dietTagsInput = document.getElementById('editDietTags').value
    const inStock = document.getElementById('editInStock').value === 'true'

    const dietTags = dietTagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '')

    try {
        const response = await fetch(`/api/v1/products/${currentProductId}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({
                name,
                category,
                dietTags,
                inStock,
            }),
        })

        const data = await response.json()

        if (response.ok) {
            editProductMessage.textContent = 'Product updated successfully'
            editProductMessage.className = 'mt-4 text-sm text-green-600'
            loadProducts()

            setTimeout(() => {
                editProductModal.classList.add('hidden')
            }, 700)
        } else {
            editProductMessage.textContent = data.msg || 'Could not update product'
            editProductMessage.className = 'mt-4 text-sm text-red-500'
        }
    } catch (error) {
        editProductMessage.textContent = 'Something went wrong'
        editProductMessage.className = 'mt-4 text-sm text-red-500'
    }
})

editMarketForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const marketName = document.getElementById('editMarketName').value
    const location = document.getElementById('editLocation').value
    const address = document.getElementById('editAddress').value
    const description = document.getElementById('editDescription').value
    const category = document.getElementById('editCategory').value
    const openingDate = document.getElementById('editOpeningDate').value

    try {
        const response = await fetch(`/api/v1/markets/${currentMarketId}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({
                marketName,
                location,
                address,
                description,
                category,
                openingDate,
            }),
        })

        const data = await response.json()

        if (response.ok) {
            editMarketMessage.textContent = 'Marketplace updated successfully'
            editMarketMessage.className = 'mt-4 text-sm text-green-600'
            loadMarkets()

            setTimeout(() => {
                editMarketModal.classList.add('hidden')
            }, 700)
        } else {
            editMarketMessage.textContent = data.msg || 'Could not update marketplace'
            editMarketMessage.className = 'mt-4 text-sm text-red-500'
        }
    } catch (error) {
        editMarketMessage.textContent = 'Something went wrong'
        editMarketMessage.className = 'mt-4 text-sm text-red-500'
    }
})

loadMarkets()
loadProducts()