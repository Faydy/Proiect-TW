document.addEventListener('DOMContentLoaded', () => {
    
    // selectam elementele din pagina
    const title = document.querySelector('h1'); 
    const interactiveSection = document.getElementById('interactive-section'); 
    const buttons = document.getElementsByClassName('btn'); 
    const form = document.querySelector('#feedbackForm');
    const messagesList = document.getElementById('lista-mesaje');
    const rangeInput = document.getElementById('nota');
    const rangeValue = document.getElementById('nota-value');
    
    // functie pentru ceas
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ro-RO');
        document.getElementById('ceas').textContent = timeString;
    }
    
    // actualizam ceasul la fiecare secunda
    setInterval(updateClock, 1000);
    updateClock(); 

    // schimbare culoare titlu
    const btnColor = document.getElementById('btn-random-color');
    
    btnColor.addEventListener('click', (event) => {
        // generam numere random pentru culori
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        
        // aplicam culoarea noua
        const sectionTitle = document.querySelector('.interactive-section h2');
        sectionTitle.style.color = `rgb(${r},${g},${b})`;
        
        // oprim propagarea click-ului
        event.stopPropagation();
    });

    // marire font lista mesaje
    const btnFont = document.getElementById('btn-increase-font');
    
    btnFont.addEventListener('click', () => {
        const currentStyle = window.getComputedStyle(messagesList);
        let currentSize = parseFloat(currentStyle.fontSize);
        
        messagesList.style.fontSize = (currentSize + 2) + 'px';
    });

    // ascultam tastatura pentru mesaj secret
    document.addEventListener('keydown', (event) => {
        // tasta m
        if (event.key.toLowerCase() === 'm') {
            const secret = document.getElementById('secret-msg');
            secret.style.display = 'block';
            
            // ascundem dupa 2 secunde
            setTimeout(() => {
                secret.style.display = 'none';
            }, 2000);
        }
    });

    // afisam valoarea la input range
    rangeInput.addEventListener('input', (e) => {
        rangeValue.textContent = e.target.value;
    });

    // incarcam mesajele salvate
    loadMessages();

    // trimitere formular
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const numeInput = document.getElementById('nume');
        const mesajInput = document.getElementById('mesaj');
        const favCat = document.getElementById('fav-cat'); 
        
        // verificare email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        emailInput.classList.remove('input-invalid');
        emailError.textContent = '';

        if (!emailRegex.test(emailInput.value)) {
            emailInput.classList.add('input-invalid');
            emailError.textContent = 'Email incorect!';
            return; 
        }

        // obiectul cu datele mesajului
        const newMessage = {
            id: Date.now(), 
            nume: numeInput.value,
            cat: favCat.value.toUpperCase(), 
            text: mesajInput.value
        };

        // salvam si afisam
        saveMessageToLocal(newMessage);
        addMessageToDOM(newMessage);

        // curatam formularul
        form.reset();
        rangeValue.textContent = '5';
        alert('Mesaj trimis!');
    });

    // functii pentru local storage
    function saveMessageToLocal(msg) {
        let messages = getMessagesFromLocal();
        messages.push(msg); 
        localStorage.setItem('catMessages', JSON.stringify(messages));
    }

    function getMessagesFromLocal() {
        const stored = localStorage.getItem('catMessages');
        return stored ? JSON.parse(stored) : [];
    }

    // adaugare element in lista
    function addMessageToDOM(msgObj) {
        const li = document.createElement('li');
        
        li.innerHTML = `
            <div>
                <strong>${msgObj.nume}</strong> (Fan ${msgObj.cat}): 
                <span>${msgObj.text}</span>
            </div>
        `;

        // buton de stergere
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.style.color = 'red';
        deleteBtn.style.border = 'none';
        deleteBtn.style.background = 'transparent';
        deleteBtn.style.cursor = 'pointer';

        deleteBtn.addEventListener('click', () => {
            li.remove();
            
            // stergem si din storage
            let allMessages = getMessagesFromLocal();
            allMessages = allMessages.filter(m => m.id !== msgObj.id);
            localStorage.setItem('catMessages', JSON.stringify(allMessages));
        });

        li.appendChild(deleteBtn);
        messagesList.appendChild(li);
    }

    function loadMessages() {
        const messages = getMessagesFromLocal();
        messages.forEach(msg => addMessageToDOM(msg));
    }

    // stergere tot istoricul
    document.getElementById('sterge-mesaje').addEventListener('click', () => {
        localStorage.removeItem('catMessages');
        messagesList.innerHTML = '';
    });
    
    // test click
    document.querySelector('.interactive-section').addEventListener('click', (e) => {
        console.log("Click pe sectiune");
    });
});







// --- partea de AJAX ---
    const btnAjax = document.getElementById('btn-load-json');
    const ajaxContainer = document.getElementById('ajax-container');

    if(btnAjax) {
        btnAjax.addEventListener('click', () => {
            // aducem datele din fisier
            fetch('cats.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Eroare fisier');
                    }
                    return response.json();
                })
                .then(data => {
                    // curatam zona inainte sa afisam
                    ajaxContainer.innerHTML = '';

                    // luam fiecare pisica din lista
                    data.forEach(cat => {
                        const card = document.createElement('div');
                        card.classList.add('pisica-card');
                        
                        // stiluri direct aici
                        card.style.display = 'inline-block';
                        card.style.margin = '10px';
                        card.style.width = '200px';
                        card.style.verticalAlign = 'top';

                        card.innerHTML = `
                            <img src="${cat.img}" alt="${cat.nume}" style="width:100%; height:150px; object-fit:cover; border-radius:5px;">
                            <h3>${cat.nume}</h3>
                            <p>${cat.descriere}</p>
                        `;
                        ajaxContainer.appendChild(card);
                    });
                    
                    btnAjax.textContent = 'Gata!';
                })
                .catch(error => {
                    console.log('Ceva nu a mers:', error);
                });
        });
    }

    // --- partea de Login / Sesiuni ---
    const loginLi = document.getElementById('login-li');
    const userLi = document.getElementById('user-li');
    const usernameDisplay = document.getElementById('username-display');
    const loginModal = document.getElementById('login-modal');
    const openLoginBtn = document.getElementById('open-login');
    const closeModalBtn = document.querySelector('.close-modal');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    // vedem daca e logat cineva cand intram pe pagina
    function checkLoginStatus() {
        const loggedUser = localStorage.getItem('loggedInUser');
        
        if (loggedUser) {
            // e logat, ascundem butonul de login
            loginLi.style.display = 'none';
            userLi.style.display = 'inline-block';
            usernameDisplay.textContent = loggedUser;
        } else {
            // nu e logat
            loginLi.style.display = 'inline-block';
            userLi.style.display = 'none';
        }
    }

    // apelam functia la inceput
    checkLoginStatus();

    // deschidem fereastra de login
    openLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'block';
    });

    // inchidem fereastra
    closeModalBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    // cand dam submit la formular
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-user').value;
        
        if(user) {
            // salvam userul in browser
            localStorage.setItem('loggedInUser', user);
            
            // actualizam meniul
            checkLoginStatus();
            
            // inchidem totul
            loginModal.style.display = 'none';
            loginForm.reset();
            alert('Salut, ' + user + '!');
        }
    });

    // butonul de logout
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // stergem userul salvat
        localStorage.removeItem('loggedInUser');
        checkLoginStatus();
        alert('Pa pa!');
    });

    // click in afara ferestrei ca sa o inchidem
    window.addEventListener('click', (e) => {
        if (e.target == loginModal) {
            loginModal.style.display = 'none';
        }
    });