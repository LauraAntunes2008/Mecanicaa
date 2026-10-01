const api = "http://localhost:3000";

const form = document.querySelector("#formVeiculo");

const placa = document.querySelector("#placa");
const marca = document.querySelector("#marca");
const modelo = document.querySelector("#modelo");
const ano = document.querySelector("#ano");
const cor = document.querySelector("#cor");

const id_cliente = document.querySelector("#id_cliente");

const corpo = document.querySelector("#corpo");

// CARREGAR CLIENTES
window.addEventListener("load", async () => {
  const resposta = await fetch(`${api}/clientes`);

  const clientes = await resposta.json();

  clientes.forEach((cliente) => {
    id_cliente.innerHTML += `
            <option value="${cliente.id_cliente}">
                ${cliente.nome}
            </option>
        `;
  });

  // CARREGAR VEÍCULOS
  const respostaVeiculos = await fetch(`${api}/veiculos`);

  const veiculos = await respostaVeiculos.json();

  veiculos.forEach((veiculo) => {
    corpo.innerHTML += `
            <tr>
                <td>${veiculo.id_veiculo}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.marca}</td>
                <td>${veiculo.modelo}</td>
                <td>${veiculo.ano}</td>
                <td>${veiculo.cor}</td>
                <td>${veiculo.proprietario}</td>

                <td>
                    <button onclick="deletar(${veiculo.id_veiculo})">
                        🗑️
                    </button>

                    <button onclick="editar(${veiculo.id_veiculo})">
                        ✏️
                    </button>
                </td>
            </tr>
        `;
  });
});

// CADASTRAR VEÍCULO
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    placa: placa.value,
    marca: marca.value,
    modelo: modelo.value,
    ano: ano.value,
    cor: cor.value,
    id_cliente: id_cliente.value,
  };

  const resposta = await fetch(`${api}/cad_veiculo`, {
    method: "POST",

    headers: {
      "content-type": "application/json",
    },

    body: JSON.stringify(dados),
  });

  if (resposta.status == 201) {
    alert("Veículo cadastrado com sucesso!");

    window.location.reload();
  } else {
    alert("Erro ao cadastrar veículo");
  }
});

// DELETAR
async function deletar(id) {
  const resposta = await fetch(`${api}/deleta_veiculo/${id}`, {
    method: "DELETE",
  });

  if (resposta.status == 200) {
    window.location.reload();
  } else {
    alert("Erro ao deletar veículo");
  }
}

// EDITAR
async function editar(id) {
  const resposta = await fetch(`${api}/veiculo/${id}`);

  const veiculo = await resposta.json();

  const dados = {
    placa: prompt("Placa", veiculo.placa),

    marca: prompt("Marca", veiculo.marca),

    modelo: prompt("Modelo", veiculo.modelo),

    ano: prompt("Ano", veiculo.ano),

    cor: prompt("Cor", veiculo.cor),

    id_cliente: prompt("ID do cliente", veiculo.id_cliente),
  };

  const respostaEditar = await fetch(`${api}/editar_veiculo/${id}`, {
    method: "PUT",

    headers: {
      "content-type": "application/json",
    },

    body: JSON.stringify(dados),
  });

  if (respostaEditar.status == 200) {
    window.location.reload();
  } else {
    alert("Erro ao editar veículo");
  }
}
