module.exports = function (app){

    //Carrega Catálogo dos Produtos
    app.get('/catalogo', function(req, res){
        app.app.controllers.produto.catalogo(app, req, res);
    })

    app.get('/produto/adicionarCarrinho/:idProduto', function(req, res){
        app.app.controllers.produto.adicionarCarrinho(app, req, res);
    })

    app.get('/carrinho', function(req, res){
        app.app.controllers.produto.listarItemCarrinho(app, req, res);
    })

    app.get('/produto/adicionarQuantidadeItem/:idProduto', function(req, res){
        app.app.controllers.produto.adicionarQuantidadeItem(app, req, res);
    })

    app.get('/produto/removerQuantidadeItem/:idProduto', function(req, res){
        app.app.controllers.produto.removerQuantidadeItem(app, req, res);
    })

    app.post('/carrinho/removerItemCarrinho', function(req, res){
        app.app.controllers.produto.removerItemCarrinho(app, req, res);
    })

    app.post('/carrinho/finalizarPedido', function(req, res){
        app.app.controllers.produto.finalizarPedido(app, req, res);
    })

    app.post('/carrinho/finalizarPedido', function(req, res){
        app.app.controllers.produto.finalizarPedido(app, req, res);
    })

    app.post('/produto/confirmacaoPedido', function(req, res){
        app.app.controllers.produto.confirmarPedido(app, req, res);
    })

    app.post('/produto/cancelamentoPedido', function(req, res){
        app.app.controllers.produto.cancelarPedido(app, req, res);
    })
}