function Produto (connection){
    this._connection = connection;
}

Produto.prototype.carregarProdutos = function(callback){
   this._connection.query('select * from produto;', callback);
}

Produto.prototype.cadastrarProduto = function(dados, callback){
    this._connection.query(`insert into produto(descricao, preco) value ('${dados.descricao}', '${dados.preco}');`, callback);
}

Produto.prototype.carregarProduto = function(idProduto){

    return new Promise((resolve, reject) =>{
        this._connection.query(`select * from produto where id = ${idProduto};`, function(erro, result){
            resolve(result)
        });
    })
}

Produto.prototype.editarProduto = function(dados, callback){
    this._connection.query(`update produto set descricao = '${dados.descricao}', preco = '${dados.preco}' where id = ${dados.idProduto};`, callback);
}

Produto.prototype.excluirProduto = function(idProduto, callback){
    this._connection.query(`delete from produto where id = ${idProduto};`, callback);
}

module.exports = function(){
    return Produto;
}