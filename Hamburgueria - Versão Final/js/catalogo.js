document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('popup');
    const popupRemove = document.getElementById('popup-remove');
    const privacyPopup = document.querySelector('.privacy-popup');

    function showPopup(element) {
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 2000);
    }

    function updateCarrinhoTotal() {
        const itens = document.querySelectorAll('.carrinho-lista li');
        let total = 0;
        itens.forEach(item => {
            const preco = parseFloat(item.getAttribute('data-preco'));
            const quantidade = parseInt(item.getAttribute('data-quantidade'));
            total += preco * quantidade;
        });
        document.querySelector('.carrinho-total').textContent = `Total: R$ ${total.toFixed(2)}`;
    }

    const buttonsAdicionar = document.querySelectorAll('.btn-adicionar');
    const carrinhoLista = document.querySelector('.carrinho-lista');

    buttonsAdicionar.forEach(button => {
        button.addEventListener('click', function() {
            const produto = this.closest('.produto');
            const nome = produto.getAttribute('data-nome');
            const preco = parseFloat(produto.getAttribute('data-preco'));
            const quantidadeInput = produto.querySelector('.quantidade input');
            const quantidade = parseInt(quantidadeInput.value);
            const tamanho = produto.querySelector('.tamanho select').value;

            // Validação de quantidade
            if (isNaN(quantidade) || quantidade <= 0) {
                alert('Por favor, insira uma quantidade válida.');
                return;
            }

            // Verificar se o produto já está no carrinho
            const itensExistentes = carrinhoLista.querySelectorAll('li');
            let itemJaAdicionado = false;
            itensExistentes.forEach(existingItem => {
                if (existingItem.getAttribute('data-nome') === nome && existingItem.getAttribute('data-tamanho') === tamanho) {
                    itemJaAdicionado = true;
                    alert('Este produto já foi adicionado ao carrinho.');
                }
            });

            if (itemJaAdicionado) return;

            const item = document.createElement('li');
            item.textContent = `${nome} (${tamanho}) - R$ ${(preco * quantidade).toFixed(2)} (x${quantidade})`;
            item.setAttribute('data-nome', nome);
            item.setAttribute('data-preco', preco);
            item.setAttribute('data-quantidade', quantidade);
            item.setAttribute('data-tamanho', tamanho);

            const btnRemover = document.createElement('button');
            btnRemover.textContent = 'Remover';
            btnRemover.classList.add('btn-remover');
            btnRemover.addEventListener('click', function() {
                item.remove();
                updateCarrinhoTotal();
                showPopup(popupRemove);
            });

            item.appendChild(btnRemover);
            carrinhoLista.appendChild(item);

            updateCarrinhoTotal();
            showPopup(popup);
        });
    });

    document.querySelector('.btn-finalizar').addEventListener('click', function() {
        // Obtém os itens do carrinho e o total
        var itens = [];
        var total = document.querySelector('.carrinho-total').textContent;
        var itemsList = document.querySelector('.carrinho-lista').getElementsByTagName('li');
    
        for (var i = 0; i < itemsList.length; i++) {
            var item = itemsList[i];
            // Extrai apenas o texto relevante, sem incluir o botão "Remover"
            var itemText = item.textContent.replace('Remover', '').trim();
            itens.push(itemText);
        }
    
        // Cria a mensagem para o WhatsApp
        var mensagem = 'Pedido:\n' + itens.join('\n') + '\nTotal: ' + total + '\n\nObrigado por comprar conosco!';
        var numeroWhatsApp = '16994392545'; // Número do WhatsApp
        var urlWhatsApp = 'https://api.whatsapp.com/send?phone=' + numeroWhatsApp + '&text=' + encodeURIComponent(mensagem);
    
        // Abre o WhatsApp com a mensagem
        window.open(urlWhatsApp, '_blank');
    });

    // Verifica se o usuário já aceitou a política de privacidade
    const privacyAccepted = localStorage.getItem("privacyAccepted");

    // Se não aceitou ainda, exibe o popup de política de privacidade
    if (!privacyAccepted) {
        privacyPopup.style.display = "block";

        // Evento ao clicar em aceitar
        document.querySelector(".btn-accept").addEventListener("click", function() {
            // Armazena o aceite em localStorage
            localStorage.setItem("privacyAccepted", true);

            // Redireciona para o link web
            window.location.href = "https://www.exemplo.com/politica-de-privacidade";
        });

        // Evento ao clicar em rejeitar (opcional)
        document.querySelector(".btn-reject").addEventListener("click", function() {
            // Oculta o popup de política de privacidade
            privacyPopup.style.display = "none";
            alert('Você recusou a política de privacidade. Algumas funcionalidades podem não estar disponíveis.');
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('overlay');
    const privacyPopup = document.getElementById('privacy-popup');
    const acceptBtn = document.getElementById('accept-btn');
    const rejectBtn = document.getElementById('reject-btn');

    // Função para definir um cookie
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + (value || "") + ";" + expires + ";path=/";
    }

    // Função para ler um cookie
    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Mostrar popup se o cookie não estiver definido
    if (!getCookie('privacyAccepted')) {
        overlay.style.display = 'block';
        privacyPopup.style.display = 'block';
    }

    // Função para aceitar a política de privacidade
    acceptBtn.addEventListener('click', function() {
        setCookie('privacyAccepted', 'true', 365); // Definido para 1 ano
        overlay.style.display = 'none';
        privacyPopup.style.display = 'none';
    });

    // Função para rejeitar a política de privacidade
    rejectBtn.addEventListener('click', function() {
        overlay.style.display = 'none';
        privacyPopup.style.display = 'none';
    });

    // Funcionalidade do carrinho de compras
    const produtoButtons = document.querySelectorAll('.btn-adicionar');
    const carrinhoLista = document.getElementById('carrinho-lista');
    const totalCarrinho = document.getElementById('total-carrinho');
    let total = 0;

    produtoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const produto = this.closest('.produto');
            const nome = produto.getAttribute('data-nome');
            const preco = parseFloat(produto.getAttribute('data-preco'));
            const quantidade = parseInt(produto.querySelector('input[type="number"]').value);
            const tamanho = produto.querySelector('select').value;
            const subtotal = preco * quantidade;
            total += subtotal;

            // Adicionar item ao carrinho
            const item = document.createElement('li');
            item.textContent = `${nome} (${tamanho}) - R$ ${subtotal.toFixed(2)}`;
            carrinhoLista.appendChild(item);
            totalCarrinho.textContent = total.toFixed(2);

            // Mostrar popup de confirmação
            const popup = document.getElementById('popup');
            popup.style.display = 'block';
            setTimeout(() => {
                popup.style.display = 'none';
            }, 3000);
        });
    });

    // Finalizar pedido
    const btnFinalizar = document.querySelector('.btn-finalizar');
    btnFinalizar.addEventListener('click', function() {
        const mensagem = `Seu pedido foi realizado com sucesso! Total: R$ ${total.toFixed(2)}`;
        const telefone = 'seu_numero_de_whatsapp'; // Substitua pelo seu número de WhatsApp
        const url = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    });
});