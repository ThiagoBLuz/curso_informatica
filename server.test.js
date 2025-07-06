const request = require('supertest');
const express = require('express');
const session = require('express-session');
const app = require('./server').app; // ajuste se exportar app no server.js

describe('Testes do servidor', () => {

  test('GET /login deve retornar 200', async () => {
    const res = await request(app).get('/login');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('<!DOCTYPE html>');
  });

  // Teste middleware autenticar - sem sessão deve redirecionar
  test('GET /conteudo sem sessão deve redirecionar', async () => {
    const res = await request(app).get('/conteudo');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/login');
  });

  // Mais testes podem ser adicionados aqui

});
