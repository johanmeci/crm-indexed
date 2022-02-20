(function () {
    // let DB;
    
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
                    
        connectionDB();

        formulario.addEventListener('submit', validateForm);

    });

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

    function createNewClient(client) {
        
        const transaction = DB.transaction(['crm'], 'readwrite');

        const objectStore = transaction.objectStore('crm');

        objectStore.add(client);

        
        transaction.onerror = function(e) {
            showAlert(`Insert error: ${e.target.error.message}`, 'error');
        }

        transaction.oncomplete = function() {
            showAlert('Added successfully');
            formulario.reset();

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }

    }

})();