let db;
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('pending', { autoIncrement: true });
}

request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
}

request.onerror = function(event) {
    console.log('Oops!', event.target.errorCode);
}

function saveRecord(record) {
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
    store.add(record);
}

function checkDatabase() {
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result)
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(['pending'], 'readwrite');
                const store = transaction.objectStore('pending');
                store.clear();
            }).catch(err => {
                console.log(err);
            }
            );
        }
    }
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);

// listen for app going offline
window.addEventListener('offline', function() {
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            console.log(getAll.result);
        }
    }
}
);

function deleteRecord(id) {
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
    store.delete(id);
}

function clearAll() {
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
    store.clear();
}

function getAllRecords() {
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        return getAll.result;
    }
}














 