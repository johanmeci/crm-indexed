let DB;

function connectionDB() {

    console.log('Connection');

    const openConnection = window.indexedDB.open('crm', 1);

    openConnection.onerror = function() {
        console.log('Error on connection');
    }

    openConnection.onsuccess = function() {
        DB = openConnection.result;
    }
    
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

        formulario.appendChild(divMsg);

        setTimeout(() => {
            divMsg.remove();
        }, 3000);

    }

}