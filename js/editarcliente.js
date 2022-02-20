(function () {

    // let DB;
    let idClient;
    const nameInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const phoneInput = document.querySelector('#telefono');
    const companyInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');
    
    document.addEventListener('DOMContentLoaded', () => {

        connectionDB();

        formulario.addEventListener('submit', updateClient);

        const paramsURL = new URLSearchParams(window.location.search);
        idClient = paramsURL.get('id');

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
            showAlert('Empty fields error', 'error');

            return;
        }

        //Update client
        const updatedClient = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            company: companyInput.value,
            id: Number(idClient)
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(updatedClient);

        transaction.oncomplete = function () {
            showAlert('Successfully upgraded');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }

        transaction.onerror = function () {
            showAlert('Update error', 'error');
        }
    }

})();