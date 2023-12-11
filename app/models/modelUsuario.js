function Usuario(connection){
    this._connection = connection;
    this._crypto = require('crypto');
}

Usuario.prototype.validarCadastro = function(dados, callback){
    this._connection.query(`select * from usuario where email = '${dados.email}';`, callback);
}

Usuario.prototype.cltCadastrarUsuario = function(dados, callback){
    dados.senha = this._crypto.createHash('md5').update(dados.senha).digest('hex');
    this._connection.query(`insert into usuario (nome, email, senha, id_tipo_usuario) values ('${dados.nome}', '${dados.email}','${dados.senha}', ${dados.tipoUsuario});`, callback);
}

Usuario.prototype.validarUsuario = function(dados, callback){
    dados.senha = this._crypto.createHash('md5').update(dados.senha).digest('hex');
    this._connection.query(`select * from usuario where nome = '${dados.usuario}' and senha = '${dados.senha}' or email = '${dados.usuario}' and senha = '${dados.senha}'`, callback);
}

Usuario.prototype.admCadastrarUsuario = function (dados, callback){
    dados.senha = this._crypto.createHash('md5').update(dados.senha).digest('hex');
    this._connection.query(`insert into usuario (nome, email, senha, id_tipo_usuario) values ('${dados.nome}', '${dados.email}','${dados.senha}', ${dados.id_tipo_usuario});`, callback)
}

Usuario.prototype.carregarTiposUsuarios = function(callback){
    this._connection.query('select * from tipo_usuario;', callback);
}

Usuario.prototype.carregarUsuarios = function(callback){
    this._connection.query('select * from usuario;', callback)
}

Usuario.prototype.carregarUsuario = function(idUsuario, callback){
    this._connection.query(`select * from usuario where id = ${idUsuario};`, callback)
}

Usuario.prototype.editarUsuarios = function(dados, callback){
    this._connection.query(`update usuario set nome = '${dados.nome}', email = '${dados.email}', id_tipo_usuario = ${dados.id_tipo_usuario} where id = ${dados.idUsuario};`, callback);
}

Usuario.prototype.editarSenha = function(dados, callback){
    dados.senha = this._crypto.createHash('md5').update(dados.senha).digest('hex');
    this._connection.query(`update usuario set senha = '${dados.senha}' where id = ${dados.idUsuario};`, callback);
}

Usuario.prototype.excluirUsuario = function(idUsuario, callback){
    this._connection.query(`delete from usuario where id = ${idUsuario}`, callback);
}

module.exports = function(){
    return Usuario;
}