let db
const request = indexedDB.open('budget', 1)

// check for new version of db
request.onupgradeneeded = function(event) {
    const db = event.target.result
    db.createObjectStore('pending', { autoIncrement: true })
}

// check if online and update db
request.onsuccess = function(event) {
    db = event.target.result
    if (navigator.onLine) {
        checkDatabase()
    }
}

// handle error
request.onerror = function(event) {
    console.log('Oops!', event.target.errorCode)
}

// save pending transactions to db
function saveRecord(record) {
    const transaction = db.transaction(['pending'], 'readwrite')
    const store = transaction.objectStore('pending')
    store.add(record)
}

// fetch pending transactions from db
function checkDatabase() {
    const transaction = db.transaction(['pending'], 'readwrite')
    const store = transaction.objectStore('pending')
    const getAll = store.getAll()

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                  },
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(['pending'], 'readwrite')
                const store = transaction.objectStore('pending')
                store.clear()
            }).catch(err => {
                console.log(err)
            }
            )
        }
    }
}

// listen for app coming back online
window.addEventListener('online', checkDatabase)