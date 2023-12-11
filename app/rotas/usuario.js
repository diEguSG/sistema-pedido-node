module.exports = function (app){

    //cham tela de Login
    app.get('/telaLogin', function(req, res){
        app.app.controllers.usuario.login(app, req, res);
    })

    //Validação Login
    app.post('/usuario/logar', function(req, res){
        app.app.controllers.usuario.logar(app, req, res);
    })

    //Chama tela de Cadastro
    app.get('/cadastro', function(req, res){
        app.app.controllers.usuario.cadastro(app, req, res);
    })

    //Cadastrar Usuarios
    app.post('/usuario/cadastrar', function(req, res){
        app.app.controllers.usuario.cadastrar(app, req, res);
    })

    //Chama a tela de Alteração de Cadastro (Usuario e Email)
    app.get('/alteracaoCadastro/:idUsuario', function(req, res){
        app.app.controllers.usuario.alteracaoCadastro(app, req, res);
    })

    //Alterar Cadastro Usuario (Usuario e Email)
    app.post('/usuario/alterar', function(req, res){
        app.app.controllers.usuario.alterarCadastro(app, req, res)
    })

    //Chama a tela de Alteração de Senha
    app.get('/alteracaoSenha/:idUsuario', function(req, res){
        app.app.controllers.usuario.alteracaoSenha(app, req, res);
    })

    //Alterar Cadastro Usuario (Senha)
    app.post('/usuario/alterarSenha', function(req, res){
        app.app.controllers.usuario.alterarSenha(app, req, res);
    })

    app.get('/sair', function(req, res){
        app.app.controllers.usuario.sair(app, req, res);
    })
}