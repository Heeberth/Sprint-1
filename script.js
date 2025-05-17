// Captura o formulário e a tabela HTML
const form = document.getElementById('categoriaForm'); // Formulário usado para adicionar categorias
const tabela = document.getElementById('categoriaTabela'); // Tabela onde as categorias serão exibidas

let categorias = []; // Array para armazenar as categorias temporariamente no lado do cliente

// Evento disparado ao submeter o formulário
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)

    // Captura os valores dos campos do formulário
    const nome = document.getElementById('nome').value; // Nome da categoria
    const descricao = document.getElementById('descricao').value; // Descrição da categoria
    const data = document.getElementById('data').value; // Data associada à categoria

    // Cria um objeto representando a categoria
    const categoria = {
        id: Date.now(), // Gera um ID único baseado no timestamp atual
        nome, // Nome capturado do formulário
        descricao, // Descrição capturada
        data, // Data capturada
        vinculada: Math.random() < 0.5 // Define aleatoriamente se a categoria está vinculada a produtos
    };

    // Adiciona a categoria ao array local
    categorias.push(categoria);

    // Atualiza a tabela com as categorias
    atualizarTabela();

    // Reseta os campos do formulário para limpar os dados preenchidos
    form.reset();

    // Envia a categoria para o servidor JSON Server
    fetch("http://localhost:3000/categoria", {
        method: "POST", // Método HTTP para criar um novo recurso
        headers: {
            "Content-type": "application/json" // Define o tipo de conteúdo como JSON
        },
        body: JSON.stringify(categoria) // Converte o objeto categoria em JSON para envio
    });
});

// Função para atualizar a tabela exibindo as categorias
function atualizarTabela() {
    tabela.innerHTML = ''; // Limpa a tabela antes de atualizá-la

    // Itera sobre cada categoria e cria uma linha na tabela
    categorias.forEach((cat) => {
        const tr = document.createElement('tr'); // Cria uma nova linha da tabela

        // Define o conteúdo da linha com os dados da categoria
        tr.innerHTML = `
            <td>${cat.nome}</td>
            <td>${cat.descricao}</td>
            <td>${cat.data}</td>
            <td>
                <button onclick="editarCategoria(${cat.id})">Editar</button>
                <button onclick="excluirCategoria(${cat.id})" class="excluir" ${cat.vinculada ? 'disabled title="Categoria vinculada a produtos"' : ''}>Excluir</button>
            </td>
        `;

        tabela.appendChild(tr); // Adiciona a linha na tabela
    });
}

// Função para excluir uma categoria
function excluirCategoria(id) {
    // Busca a categoria pelo ID
    const categoria = categorias.find(c => c.id === id);

    // Verifica se a categoria está vinculada a produtos
    if (categoria.vinculada) {
        alert("Não é possível excluir uma categoria vinculada a produtos."); // Exibe um alerta
        return; // Interrompe a execução
    }

    // Remove a categoria do array
    categorias = categorias.filter(cat => cat.id !== id);

    fetch(`http://localhost:3000/categoria/${id}`, {
    method: 'DELETE'
});


    // Atualiza a tabela com os dados restantes
    atualizarTabela();
}

// Função para editar uma categoria
function editarCategoria(id) {
    // Busca a categoria pelo ID
    const categoria = categorias.find(cat => cat.id === id);

    if (categoria) {
        // Preenche os campos do formulário com os dados da categoria
        document.getElementById('nome').value = categoria.nome;
        document.getElementById('descricao').value = categoria.descricao;
        document.getElementById('data').value = categoria.data;

        // Remove a categoria do array (para evitar duplicação ao salvar novamente)
        categorias = categorias.filter(cat => cat.id !== id);

        // Atualiza a tabela
        atualizarTabela();
    }
}
// Carrega as categorias salvas no servidor assim que a página for carregada
window.addEventListener('DOMContentLoaded', () => {
    fetch("http://localhost:3000/categoria")
        .then(response => response.json())
        .then(data => {
            categorias = data; // Atualiza o array local com os dados do servidor
            atualizarTabela(); // Renderiza na tela
        })
        .catch(error => console.error("Erro ao carregar categorias:", error));
});
