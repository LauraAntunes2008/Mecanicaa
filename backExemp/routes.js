import express from "express";
import sql from "./database.js";

const routes = express.Router();

// ==================== USUÁRIO ====================

routes.post("/login", async (req, res) => {
  const { user, password } = req.body;

  const resposta = await sql`
        SELECT * FROM usuario
        WHERE nome = ${user}
        AND senha = ${password}
    `;

  if (resposta.length == 0) {
    return res.status(401).json({
      mensagem: "Usuário ou senha incorretos",
    });
  }

  res.status(200).json(resposta[0]);
});

routes.post("/cadastro", async (req, res) => {
  const { user, password } = req.body;

  const resposta = await sql`
        INSERT INTO usuario (nome, senha)
        VALUES (${user}, ${password})
        RETURNING *
    `;

  res.status(201).json(resposta[0]);
});

routes.get("/usuarios", async (req, res) => {
  const resposta = await sql`
        SELECT * FROM usuario
        ORDER BY id_user
    `;

  res.status(200).json(resposta);
});

routes.get("/usuario/:id", async (req, res) => {
  const { id } = req.params;

  const resposta = await sql`
        SELECT * FROM usuario
        WHERE id_user = ${id}
    `;

  res.status(200).json(resposta[0]);
});

routes.delete("/deletar/:id", async (req, res) => {
  const { id } = req.params;

  await sql`
        DELETE FROM usuario
        WHERE id_user = ${id}
    `;

  res.status(200).json({
    mensagem: "Usuário deletado",
  });
});

// ==================== CLIENTE ====================

routes.get("/clientes", async (req, res) => {
  const resposta = await sql`
        SELECT * FROM cliente
        ORDER BY id_cliente
    `;

  res.status(200).json(resposta);
});

routes.get("/cliente/:id", async (req, res) => {
  const { id } = req.params;

  const resposta = await sql`
        SELECT * FROM cliente
        WHERE id_cliente = ${id}
    `;

  res.status(200).json(resposta[0]);
});

routes.post("/cad_cliente", async (req, res) => {
  const { nome, cpf, telefone, endereco } = req.body;

  const resposta = await sql`
        INSERT INTO cliente
        (nome, cpf, telefone, endereco)
        VALUES
        (${nome}, ${cpf}, ${telefone}, ${endereco})
        RETURNING *
    `;

  res.status(201).json(resposta[0]);
});

routes.put("/editar_cliente/:id", async (req, res) => {
  const { id } = req.params;

  const { nome, cpf, telefone, endereco } = req.body;

  const resposta = await sql`
        UPDATE cliente
        SET
            nome = ${nome},
            cpf = ${cpf},
            telefone = ${telefone},
            endereco = ${endereco}
        WHERE id_cliente = ${id}
        RETURNING *
    `;

  res.status(200).json(resposta[0]);
});

routes.delete("/deleta_cliente/:id", async (req, res) => {
  const { id } = req.params;

  await sql`
        DELETE FROM cliente
        WHERE id_cliente = ${id}
    `;

  res.status(200).json({
    mensagem: "Cliente deletado",
  });
});

// ==================== VEÍCULO ====================

routes.get("/veiculos", async (req, res) => {
  const resposta = await sql`
        SELECT
            veiculo.*,
            cliente.nome AS proprietario
        FROM veiculo
        INNER JOIN cliente
        ON veiculo.id_cliente = cliente.id_cliente
        ORDER BY veiculo.id_veiculo
    `;

  res.status(200).json(resposta);
});

routes.get("/veiculo/:id", async (req, res) => {
  const { id } = req.params;

  const resposta = await sql`
        SELECT * FROM veiculo
        WHERE id_veiculo = ${id}
    `;

  res.status(200).json(resposta[0]);
});

routes.post("/cad_veiculo", async (req, res) => {
  const { placa, marca, modelo, ano, cor, id_cliente } = req.body;

  const resposta = await sql`
        INSERT INTO veiculo
        (placa, marca, modelo, ano, cor, id_cliente)
        VALUES
        (${placa}, ${marca}, ${modelo}, ${ano}, ${cor}, ${id_cliente})
        RETURNING *
    `;

  res.status(201).json(resposta[0]);
});

routes.put("/editar_veiculo/:id", async (req, res) => {
  const { id } = req.params;

  const { placa, marca, modelo, ano, cor, id_cliente } = req.body;

  const resposta = await sql`
        UPDATE veiculo
        SET
            placa = ${placa},
            marca = ${marca},
            modelo = ${modelo},
            ano = ${ano},
            cor = ${cor},
            id_cliente = ${id_cliente}
        WHERE id_veiculo = ${id}
        RETURNING *
    `;

  res.status(200).json(resposta[0]);
});

routes.delete("/deleta_veiculo/:id", async (req, res) => {
  const { id } = req.params;

  await sql`
        DELETE FROM veiculo
        WHERE id_veiculo = ${id}
    `;

  res.status(200).json({
    mensagem: "Veículo deletado",
  });
});

// ==================== MANUTENÇÃO ====================

routes.get("/manutencoes", async (req, res) => {
  const resposta = await sql`
        SELECT
            manutencao.*,
            veiculo.placa,
            veiculo.marca,
            veiculo.modelo
        FROM manutencao
        INNER JOIN veiculo
        ON manutencao.id_veiculo = veiculo.id_veiculo
        ORDER BY manutencao.id_manutencao
    `;

  res.status(200).json(resposta);
});

routes.get("/manutencao/:id", async (req, res) => {
  const { id } = req.params;

  const resposta = await sql`
        SELECT * FROM manutencao
        WHERE id_manutencao = ${id}
    `;

  res.status(200).json(resposta[0]);
});

routes.post("/cad_manutencao", async (req, res) => {
  const {
    id_veiculo,
    data_entrada,
    descricao_problema,
    tipo_servico,
    situacao,
    valor,
    data_entrega,
  } = req.body;

  const resposta = await sql`
        INSERT INTO manutencao
        (
            id_veiculo,
            data_entrada,
            descricao_problema,
            tipo_servico,
            situacao,
            valor,
            data_entrega
        )
        VALUES
        (
            ${id_veiculo},
            ${data_entrada},
            ${descricao_problema},
            ${tipo_servico},
            ${situacao},
            ${valor},
            ${data_entrega}
        )
        RETURNING *
    `;

  res.status(201).json(resposta[0]);
});

routes.put("/editar_manutencao/:id", async (req, res) => {
  const { id } = req.params;

  const {
    id_veiculo,
    data_entrada,
    descricao_problema,
    tipo_servico,
    situacao,
    valor,
    data_entrega,
  } = req.body;

  const resposta = await sql`
        UPDATE manutencao
        SET
            id_veiculo = ${id_veiculo},
            data_entrada = ${data_entrada},
            descricao_problema = ${descricao_problema},
            tipo_servico = ${tipo_servico},
            situacao = ${situacao},
            valor = ${valor},
            data_entrega = ${data_entrega}
        WHERE id_manutencao = ${id}
        RETURNING *
    `;

  res.status(200).json(resposta[0]);
});

routes.delete("/deleta_manutencao/:id", async (req, res) => {
  const { id } = req.params;

  await sql`
        DELETE FROM manutencao
        WHERE id_manutencao = ${id}
    `;

  res.status(200).json({
    mensagem: "Manutenção deletada",
  });
});

export default routes;
