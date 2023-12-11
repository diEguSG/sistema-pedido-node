module.exports = function(app){

    //Chama a tela de Cadastro Usuario
    app.get('/cadastroUsuario', function(req, res){
        app.app.controllers.admin.cadastro(app, req, res);
    })

    //Cadastrar Usuario
    app.post('/admin/cadastrarUsuario', function(req, res){
        app.app.controllers.admin.cadastrar(app, req, res);
    })

    //Lista Usuarios
    app.get('/usuario', function(req, res){
        app.app.controllers.admin.listar(app, req, res);
    })

    //Chama a tela de Editar Usuario
    app.get('/editar/:idUsuario', function(req, res){
        app.app.controllers.admin.editar(app, req, res);
    })

    //Editar Usuarios
    app.post('/admin/editarUsuario', function(req, res){
        app.app.controllers.admin.editarUsuario(app, req, res);
    })

    //Exluir Usuarios
    app.get('/excluirUsuario/:idUsuario', function(req, res){
        app.app.controllers.admin.excluirUsuario(app, req, res);
    })

    //Chama a tela de Cadastro Produto
    app.get('/cadastroProduto', function(req, res){
        app.app.controllers.admin.cadastroProduto(app, req, res);
    })

    //Cadastrar Produtos
    app.post('/admin/cadastrarProduto', function(req, res){
        app.app.controllers.admin.cadastrarProduto(app, req, res);
    })

    //Listar Produtos
    app.get('/produto', function(req, res){
        app.app.controllers.admin.listarProduto(app, req, res);
    })

    //Chama tela Editar Produto
    app.get('/edicaoProduto/:idProduto', function(req, res){
        app.app.controllers.admin.edicaoProduto(app, req, res);
    })

    //Editar Produtos
    app.post('/admin/editarProduto', function(req, res){
        app.app.controllers.admin.editarProduto(app, req, res);
    })

    //Excluir Produtos
    app.get('/excluirProduto/:idProduto', function(req, res){
        app.app.controllers.admin.excluirProduto(app, req, res);
    })

    //Lista Pedidos em Abertos
    app.get('/pedidoAberto', function(req, res){
        app.app.controllers.admin.listarPedidos(app, req, res);
    })

    //Carregar Carrinho
    app.get('/verificarCarrinho/:idPedido/:idFormaPagamento', function(req, res){
        app.app.controllers.admin.listarCarrinho(app, req, res);
    })
}