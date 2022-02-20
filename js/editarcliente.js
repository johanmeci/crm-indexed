(function () {

    let DB;
    const nameInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const phoneInput = document.querySelector('#telefono');
    const companyInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');
    
    document.addEventListener('DOMContentLoaded', () => {

        connectionDB();

        formulario.addEventListener('submit', updateClient);

        const paramsURL = new URLSearchParams(window.location.search);
        const idClient = paramsURL.get('id');

        if (idClient) {
            setTimeout(() => {
                getClient(idClient);
            }, 1000);
        }

    });

    function getClient(id) {

        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');

        const client = objectStore.openCursor();

        client.onsuccess = function(e) {
            const cursor = e.target.result;

            if (cursor) {

                if (cursor.value.id === Number(id)) {
                    fillForm(cursor.value);
                }

                cursor.continue();
            }
        }
    }

    function connectionDB() {

        const connection = window.indexedDB.open('crm', 1);

        connection.onerror = function () {
            console.log('Error connection');
        }

        connection.onsuccess = function() {         
            DB = connection.result;
        }
    }

    function fillForm(client) {
        const { name, email, phone, company } = client;

        nameInput.value = name;
        emailInput.value = email;
        phoneInput.value = phone;
        companyInput.value = company;
    }

    function updateClient(e) {
        e.preventDefault();

        if (nameInput.value === '' || emailInput.value === '' || phoneInput.value === '' || companyInput.value === '') {
            console.log('Error');

            return;
        }
    }

})();