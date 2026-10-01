const api = "http://localhost:3000";
const form = document.querySelector("#formCliente");
const nome = document.querySelector("#nome");
const cpf = document.querySelector("#cpf");
const telefone = document.querySelector("#telefone");
const endereco = document.querySelector("#endereco");
const corpo = document.querySelector("#corpo");
window.addEventListener("load", async () => {
  const resposta = await fetch(`${api}/clientes`);
  const clientes = await resposta.json();

  clientes.forEach((cliente) => {
    corpo.innerHTML += `
            <tr>
                <td>${cliente.id_cliente}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.cpf}</td>
                <td>${cliente.telefone}</td>
                <td>${cliente.endereco}</td>

                <td>
                    <button onclick="deletar(${cliente.id_cliente})">
                        🗑️
                    </button>

                    <button onclick="editar(${cliente.id_cliente})">
                        ✏️
                    </button>
                </td>
            </tr>
        `;
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    nome: nome.value,
    cpf: cpf.value,
    telefone: telefone.value,
    endereco: endereco.value,
  };

  const resposta = await fetch(`${api}/cad_cliente`, {
    method: "POST",

    headers: {
      "content-type": "application/json",
    },

    body: JSON.stringify(dados),
  });

  if (resposta.status == 201) {
    alert("Cliente cadastrado com sucesso!");

    window.location.reload();
  }
});

async function deletar(id) {
  const resposta = await fetch(`${api}/deleta_cliente/${id}`, {
    method: "DELETE",
  });

  if (resposta.status == 200) {
    window.location.reload();
  }
}

async function editar(id) {
  const resposta = await fetch(`${api}/cliente/${id}`);

  const cliente = await resposta.json();

  const dados = {
    nome: prompt("Nome", cliente.nome),

    cpf: prompt("CPF", cliente.cpf),

    telefone: prompt("Telefone", cliente.telefone),

    endereco: prompt("Endereço", cliente.endereco),
  };

  const respostaEditar = await fetch(`${api}/editar_cliente/${id}`, {
    method: "PUT",

    headers: {
      "content-type": "application/json",
    },

    body: JSON.stringify(dados),
  });

  if (respostaEditar.status == 200) {
    window.location.reload();
  }
}
