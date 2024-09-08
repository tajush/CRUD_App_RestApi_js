const apiUrl = 'http://localhost:3000/items';
const itemList = document.getElementById('item-list');
const itemForm = document.getElementById('item-form');
const itemName = document.getElementById('item-name');
const itemPrice = document.getElementById('item-price');
const itemId = document.getElementById('item-id');

// Fetch and display items
function fetchItems() {
    fetch(apiUrl)
    
        .then(response => response.json())
        .then(items => {
            itemList.innerHTML = ''; // Clear previous items
            items.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${item.name} - $${item.price} 
                    <button class="edit" data-id="${item.id}">Edit</button>
                    <button class="delete" data-id="${item.id}">Delete</button>
                `;
                itemList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching items:', error));
}

// Create or update an item
itemForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = itemName.value;
    const price = itemPrice.value;
    const id = itemId.value;

    if (id) {
        // Update item
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, price }),
        })
        .then(response => response.json())
        .then(() => {
            fetchItems();
            itemForm.reset();
        })
        .catch(error => console.error('Error updating item:', error));
    } else {
        // Create new item
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, price }),
        })
        .then(response => response.json())
        .then(() => {
            fetchItems();
            itemForm.reset();
        })
        .catch(error => console.error('Error creating item:', error));
    }
});

// Event delegation for edit and delete buttons
itemList.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit')) {
        // Edit item
        const id = event.target.getAttribute('data-id');
        editItem(id);
    }

    if (event.target.classList.contains('delete')) {
        // Delete item
        const id = event.target.getAttribute('data-id');
        deleteItem(id);
    }
});

// Delete an item
function deleteItem(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
    .then(() => fetchItems())
    .catch(error => console.error('Error deleting item:', error));
}

// Edit an item (populate form with item data)
function editItem(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(item => {
            itemId.value = item.id;
            itemName.value = item.name;
            itemPrice.value = item.price;
        })
        .catch(error => console.error('Error fetching item:', error));
}

// Initial fetch to populate the list
fetchItems();


// function updatePrice(id, newPrice) {
//     fetch(`http://localhost:3000/items/${id}`, {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ price: newPrice }),
//     })
//     .then(response => response.json())
//     .then(updatedItem => {
//         console.log('Item updated:', updatedItem);
//     })
//     .catch(error => console.error('Error updating price:', error));
// }

// // Example usage: Update the price of the item with id 1
// updatePrice(1, 250);
