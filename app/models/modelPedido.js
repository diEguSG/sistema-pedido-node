function Pedido (connection){
    this._connection = connection;
}

Pedido.prototype.verificarIdPedido = function(callback){
    this._connection.query('select * from pedido order by id desc limit 1;', callback);
}

Pedido.prototype.criarPedido = function(dados, callback){
    this._connection.query(`insert into pedido(id_usuario, id_status) values ('${dados[0].id_usuario}', '${dados[0].id_status}');`, callback);
}

Pedido.prototype.adicionarItemCarrinho = function(dados, callback){
    this._connection.query(`insert into carrinho values ('NULL', '${dados[0].id_pedido}', '${dados[0].id_produto}', '${dados[0].quantidade}');`, callback);
}

Pedido.prototype.verificarCarrinho = function(dados, callback){
    this._connection.query(`select * from carrinho where id_pedido = '${dados[0].id_pedido}' and id_produto = '${dados[0].id_produto}';`, callback);
}

Pedido.prototype.carregarCarrinho = function(idPedido, callback){
    this._connection.query(`select * from carrinho where id_pedido = ${idPedido};`, callback);
}

Pedido.prototype.cancelarPedido = function(idPedido, callback){
    this._connection.query(`update pedido set id_status = 3 where id_pedido = ${idPedido};`, callback);
}

Pedido.prototype.atualizarItemCarrinho = function(dados, quantidade, callback){
    this._connection.query(`update carrinho set quantidade = ${quantidade} where id_pedido = ${dados[0].id_pedido} and id_produto = ${dados[0].id_produto};`, callback)
}

Pedido.prototype.removerItemCarrinho = function(dados, callback){
    this._connection.query(`delete from carrinho where id_pedido = ${dados[0].id_pedido} and id_produto = ${dados[0].id_produto};`, callback);
}

Pedido.prototype.carregarFormasPagamentos = function(callback){
    this._connection.query('select * from forma_pagamento;', callback);
}

Pedido.prototype.carregarFormaPagamento = function(idFormaPagamento, callback){
    this._connection.query(`select * from forma_pagamento where id = ${idFormaPagamento};`, callback);
}

Pedido.prototype.atualizarFormaPagamentoPedido = function(idFormaPagamento, idPedido, callback){
    this._connection.query(`update pedido set id_forma_pagamento = ${idFormaPagamento} where id = ${idPedido};`, callback);
}

Pedido.prototype.atualizarStatusPedido = function(idStatus, idPedido, callback){
    this._connection.query(`update pedido set id_status = ${idStatus} where id = ${idPedido};`, callback);
}

Pedido.prototype.carregarPedidosAbertos = function(callback){
    this._connection.query("select pedido.id,usuario.nome,forma_pagamento.descricao,pedido.id_forma_pagamento from pedido as pedido inner join usuario as usuario on pedido.id_usuario = usuario.id inner join forma_pagamento as forma_pagamento on pedido.id_forma_pagamento = forma_pagamento.id where pedido.id_status = 1;", callback);
}


module.exports = function(){
    return Pedido;
}