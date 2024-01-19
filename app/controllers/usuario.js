module.exports.login = function(app, req, res){
    res.render('./usuario/telaLogin', {erros:{}, usuario:{}});
} 

module.exports.logar = function (app, req, res){
    
    const dados = req.body;

    req.assert('usuario', 'Preencher campo usuário!').notEmpty();
    req.assert('senha', 'Preencher campo Senha!').notEmpty();

    const erros = req.validationErrors();

    if(erros){
        res.render('usuario/telaLogin', {erros: erros, usuario: dados})
        return erros;
    }

    const connection = app.config.connection;
    const modelUsuario = new app.app.models.modelUsuario(connection);

    modelUsuario.validarUsuario(dados, function(error, result){

        if(result.length > 0){
            req.session.id_tipo_usuario = result[0].id_tipo_usuario;
            req.session.id_usuario = result[0].id;
            req.session.id_pedido = 0;
            res.redirect('/');
        }
        else{
            res.redirect('../telaLogin');
        }
    })
}

module.exports.cadastro = function(app, req, res){
    res.render('./usuario/cadastro', {usuario: {}, erro: {}, erros: {}});
}

module.exports.cadastrar = function(app, req, res){

    const dados = req.body;

    //Validando Campos Vazios
    req.assert('nome', 'Preencher campo nome!').notEmpty();
    req.assert('email', 'Campo vazio!').notEmpty();
    req.assert('senha', 'Preencher campo Senha!').notEmpty();
    req.assert('senha', 'Senha deve conter no mínimo 7 digitos').len(7, 999);
    req.assert('confirmaSenha', 'Favor, confirme a sua senha!').notEmpty();
    
    const erros = req.validationErrors();

    if(erros){
        res.render('./usuario/cadastro', {usuario: dados, erros: erros, erro: {}});
        return erros;
    }

    if(dados.confirmaSenha == dados.senha){

        //Conectando ao banco
        const connection = app.config.connection;
        const modelUsuario = new app.app.models.modelUsuario(connection);
        
        //Validando Usuarios
        modelUsuario.validarCadastro(dados, function(error, result){
                    
            if(result.length != 0){
                const erro = [{msg: 'Email já cadastrado!'}];
                res.render('usuario/cadastro', {erro: erro, usuario: dados, erros: {}});
            }
            else{
                modelUsuario.cltCadastrarUsuario(dados, function(error, result){
                    res.redirect('/');
                })
            }
        })
    }else{
        const erro = [{msg: 'As senhas não conferem!'}]
        res.render('./usuario/cadastro', {erro: erro, usuario: dados, erros: {}});
    }

}

module.exports.alteracaoCadastro = function(app, req, res){

    if(req.session.id_tipo_usuario != 1){
        res.redirect('/telaLogin');
        return;
    }

    const idUsuario = req.params.idUsuario;

    const connection = app.config.connection;
    const modelUsuario = new app.app.models.modelUsuario(connection);

    modelUsuario.carregarUsuario(idUsuario, function(error, result){
        res.render('../views/usuario/alterarCadastro', {usuario: result, erros:{}});
    })
}

module.exports.alterarCadastro = function(app, req, res){
    
    if(req.session.id_tipo_usuario != 1){
        res.redirect('/telaLogin');
        return;
    }

    const dados = req.body;

    req.assert('nome', 'Favor, inserir o Nome!').notEmpty();
    req.assert('email', 'Favor, inserir e-mail!').notEmpty();

    const erros = req.validationErrors();
    
    const connection = app.config.connection;
    const modelUsuario = new app.app.models.modelUsuario(connection);

    if(erros){
        modelUsuario.carregarTiposUsuarios(function(error, tipos){
            modelUsuario.carregarUsuario(dados.idUsuario, function(error, result){
                res.render('./usuario/alterarCadastro', {erros: erros, usuario: result, tipoUsuario: tipos, idUsuario: req.session.id_usuario});
            })
        })         
        return erros;
    }

    modelUsuario.editarUsuarios(dados, function(error, result){
        res.redirect('/');
    })
}

module.exports.alteracaoSenha = function(app, req, res){

    if(req.session.id_tipo_usuario != 1){
        res.redirect('/telaLogin');
        return;
    }

    const idUsuario = req.params.idUsuario;

    const connection = app.config.connection;
    const modelUsuario = new app.app.models.modelUsuario(connection);

    modelUsuario.carregarUsuario(idUsuario, function(error, result){
        res.render('../views/usuario/alterarSenha', {usuario: result, idUsuario: req.session.id_usuario, erros:{}});
    })
}

module.exports.alterarSenha = function(app, req, res){
    
    if(req.session.id_tipo_usuario != 1){
        res.redirect('/telaLogin');
        return;
    }

    const dados = req.body;
    
    req.assert('senha', 'Senha deve conter no mínimo 7 digitos').len(7, 999);
    req.assert('confirmaSenha', 'Favor, confirme a sua senha!').notEmpty();

    const erros = req.validationErrors();

    const connection = app.config.connection;
    const modelUsuario = new app.app.models.modelUsuario(connection);    


    if(erros){
        modelUsuario.carregarTiposUsuarios(function(error, tipos){
    
            modelUsuario.carregarUsuario(dados.idUsuario, function(error, result){
                res.render('./usuario/alterarSenha', {erros: erros, usuario: result, tipoUsuario: tipos, idUsuario: req.session.id_usuario});
            })
        })         
        return erros;
    }

    if (dados.confirmaSenha == dados.senha){
        modelUsuario.editarUsuarios(dados, function(error, result){
            modelUsuario.editarSenha(dados, function(error, result){
                res.redirect('/');
            })
        })
    }
    else{

        modelUsuario.carregarTiposUsuarios(function(error, tipos){
            const erro = [{msg: 'As senha não conferem'}];
            res.render('./usuario/alterarSenha', {erros: erros, usuario: dados, erro: erro, tipoUsuario: tipos})
        })  
    }
}

module.exports.sair = function (app, req, res){

    const connection = app.config.connection;
    const modelPedido = new app.app.models.modelPedido(connection);

    if(req.session.id_pedido != 0){ 
        console.log(req.session.id_pedido)
        modelPedido.cancelarPedido(req.session.id_pedido, function(error, result){       
            req.session.destroy(function(error){                        //Destroi a sessão
                res.redirect('/telaLogin');
            }); 
        })
    
    }
    else{
        req.session.destroy(function(error){
            res.redirect('/telaLogin');
        }); 
    }
}