(function () {

    let DB;
    const clientsList = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        createDB();

        if (window.indexedDB.open('crm', 1)) {
            loadClientsList();
        }

        clientsList.addEventListener('click', deleteClient);

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
            objectStore.createIndex('company', 'company', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

            console.log('DB created');
        }
    }

    function loadClientsList() {
        
        const connection = window.indexedDB.open('crm', 1);

        connection.onerror = function () {
            console.log('Error load clients lists');
        }

        connection.onsuccess = function() {         
            DB = connection.result;
            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function (e) {
                
                const cursor = e.target.result;
    
                if (cursor) {

                    const { name, email, phone, company, id } = cursor.value;

                    clientsList.innerHTML += `
                        <tr>
                            <td class='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                                <p class='text-sm leading-5 font-medium text-gray-700 text-lg font-bold'>${name}</p>
                                <p class='text-sm leading-10 text-gray-700'>${email}</p>
                            </td>
                            <td class='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                                <p class='text-gray-700'>${phone}</p>
                            </td>
                            <td class='px-6 py-4 whitespace-no-wrap border-b border-gray-200 leading-5 text-gray-700'>
                                <p class='text-gray-700'>${company}</p>
                            </td>
                            <td class='px-6 py-4 whitespace-no-wrap border-b border-gray-200 leading-5 text-sm leading-5'>
                                <a class='text-teal-600 hover:text-teal-900 mr-5' href='editar-cliente.html?id=${id}'>Editar</a>
                                <a class='text-red-600 hover:text-red-900 btn-delete' href='#' data-cliente='${id}'>Eliminar</a>
                            </td>
                        </tr>
                    `;

                    cursor.continue();

                } else {
                    console.log('No hay más registros');
                }
    
            }
        }

    }

    function deleteClient(e) {
        
        if (e.target.classList.contains('btn-delete')) {
            
            const id = Number(e.target.dataset.cliente);
            const confirmDelete = confirm('Are you sure you want to delete the client?');

            if (confirmDelete) {
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(id);

                transaction.oncomplete = function () {
                    console.log('Eliminado');

                    e.target.parentElement.parentElement.remove();
                }

                transaction.onerror = function () {
                    console.log('Error deleting');
                }
            }
        }
    }

})();