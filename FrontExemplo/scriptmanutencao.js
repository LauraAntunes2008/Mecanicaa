const api = "http://localhost:3000";

const form = document.querySelector("#formManutencao");

const id_veiculo = document.querySelector("#id_veiculo");
const data_entrada = document.querySelector("#data_entrada");
const descricao_problema = document.querySelector("#descricao_problema");
const tipo_servico = document.querySelector("#tipo_servico");
const situacao = document.querySelector("#situacao");
const valor = document.querySelector("#valor");
const data_entrega = document.querySelector("#data_entrega");

const corpo = document.querySelector("#corpo");

// ==================== CARREGAR DADOS ====================

window.addEventListener("load", async () => {
  // CARREGAR VEÍCULOS

  const respostaVeiculos = await fetch(`${api}/veiculos`);
  const veiculos = await respostaVeiculos.json();

  veiculos.forEach((veiculo) => {
    id_veiculo.innerHTML += `
            <option value="${veiculo.id_veiculo}">
                ${veiculo.placa} - ${veiculo.marca} - ${veiculo.modelo}
            </option>
        `;
  });

  // CARREGAR MANUTENÇÕES

  const respostaManutencoes = await fetch(`${api}/manutencoes`);
  const manutencoes = await respostaManutencoes.json();

  manutencoes.forEach((manutencao) => {
    let entrada = "";

    if (manutencao.data_entrada) {
      entrada = manutencao.data_entrada.split("T")[0];
    }

    let entrega = "";

    if (manutencao.data_entrega) {
      entrega = manutencao.data_entrega.split("T")[0];
    }

    corpo.innerHTML += `
            <tr>

                <td>
                    ${manutencao.id_manutencao}
                </td>

                <td>
                    ${manutencao.placa} - ${manutencao.marca} - ${manutencao.modelo}
                </td>

                <td>
                    ${entrada}
                </td>

                <td>
                    ${manutencao.descricao_problema}
                </td>

                <td>
                    ${manutencao.tipo_servico}
                </td>

                <td>
                    ${manutencao.situacao}
                </td>

                <td>
                    R$ ${manutencao.valor}
                </td>

                <td>
                    ${entrega}
                </td>

                <td>
                    <button onclick="deletar(${manutencao.id_manutencao})">
                        🗑️
                    </button>

                    <button onclick="editar(${manutencao.id_manutencao})">
                        ✏️
                    </button>
                </td>

            </tr>
        `;
  });
});

// ==================== CADASTRAR ====================

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    id_veiculo: id_veiculo.value,

    data_entrada: data_entrada.value,

    descricao_problema: descricao_problema.value,

    tipo_servico: tipo_servico.value,

    situacao: situacao.value,

    valor: valor.value,

    data_entrega: data_entrega.value || null,
  };

  const resposta = await fetch(`${api}/cad_manutencao`, {
    method: "POST",

    headers: {
      "content-type": "application/json",
    },

    body: JSON.stringify(dados),
  });

  if (resposta.status == 201) {
    alert("Manutenção cadastrada com sucesso!");

    window.location.reload();
  } else {
    alert("Erro ao cadastrar manutenção");
  }
});

// ==================== DELETAR ====================

async function deletar(id) {
  const resposta = await fetch(`${api}/deleta_manutencao/${id}`, {
    method: "DELETE",
  });

  if (resposta.status == 200) {
    window.location.reload();
  } else {
    alert("Erro ao deletar manutenção");
  }
}

// ==================== EDITAR ====================

async function editar(id) {
  const resposta = await fetch(`${api}/manutencao/${id}`);

  const manutencao = await resposta.json();

  let entrada = "";

  if (manutencao.data_entrada) {
    entrada = manutencao.data_entrada.split("T")[0];
  }

  let entrega = "";

  if (manutencao.data_entrega) {
    entrega = manutencao.data_entrega.split("T")[0];
  }

  const dados = {
    id_veiculo: prompt("ID do veículo", manutencao.id_veiculo),

    data_entrada: prompt("Data de entrada", entrada),

    descricao_problema: prompt(
      "Descrição do problema",
      manutencao.descricao_problema,
    ),

    tipo_servico: prompt("Tipo de serviço", manutencao.tipo_servico),
    situacao: prompt("Situação", manutencao.situacao),
    valor: prompt("Valor", manutencao.valor),
    data_entrega: prompt("Data de entrega", entrega) || null,
  };

  const respostaEditar = await fetch(`${api}/editar_manutencao/${id}`, {
    method: "PUT",

    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (respostaEditar.status == 200) {
    window.location.reload();
  } else {
    alert("Erro ao editar manutenção");
  }
}
