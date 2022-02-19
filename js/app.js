(function () {

    let DB;

    document.addEventListener('DOMContentLoaded', () => {
        createDB();

        if (window.indexedDB.open('crm', 1)) {
            loadClientsList();
        }

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

    function loadClientsList() {

        console.log('Cargando clientes...');
        
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
                    const clientsList = document.querySelector('#listado-clientes');
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
                                <a class='text-red-600 hover:text-red-900' href='#' data-cliente='${id}'>Eliminar</a>
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

})();