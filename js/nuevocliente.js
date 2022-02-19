(function () {
    let DB;
    const form = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        
        connectionDB();

        form.addEventListener('submit', validateForm);

    });

    function connectionDB() {

        const openConnection = window.indexedDB.open('crm', 1);

        openConnection.onerror = function() {
            console.log('Error on connection');
        }

        openConnection.onsuccess = function() {
            DB = openConnection.result;
        }
        
    }

    function validateForm(e) {
        e.preventDefault();

        const name = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#telefono').value;
        const company = document.querySelector('#empresa').value;

        if (name === '' || email === '' || phone === '' || company === '') {
            showAlert('Empty fields error');

            return;
        }

        //Client object
        const client = {
            name,
            email,
            phone,
            company,
            id: Date.now()
        }

        createNewClient(client);

    }

    function showAlert(msg, type) {
        
        const alert = document.querySelector('.alert');

        if (!alert) {

            const divMsg = document.createElement('div');
            divMsg.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alert');

            if (type === 'error') {
                divMsg.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            } else {
                divMsg.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            }

            divMsg.textContent = msg;

            form.appendChild(divMsg);

            setTimeout(() => {
                divMsg.remove();
            }, 3000);

        }

    }

    function createNewClient(client) {
        
        const transaction = DB.transaction(['crm'], 'readwrite');

        const objectStore = transaction.objectStore('crm');

        objectStore.add(client);

        transaction.onerror = function() {
            showAlert('Insert error', 'error');
        }

        transaction.oncomplete = function() {
            showAlert('Added successfully');
            form.reset();
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }

    }

})();