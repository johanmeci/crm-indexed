(function () {

    let DB;

    document.addEventListener('DOMContentLoaded', () => {
        createDB();
    });

    //Create IndexDB
    function createDB() {
        const createDB = window.indexedDB.open('crm', 1);

        createDB.onerror = function() {
            console.log('Error create DB');
        }

        createDB.onsuccess = function() {
            DB = createDB.result;
        }

        createDB.onupgradeneeded = function(e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('phone', 'phone', { unique: false });
            objectStore.createIndex('company', 'company', { unique: true });
            objectStore.createIndex('id', 'id', { unique: true });

            console.log('DB created');
        }
    }

})();