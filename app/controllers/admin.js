const modelUsuario = require("../models/modelUsuario");

module.exports.cadastro = function(app, req, res){

    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const connection = app.config.connection;
    const modelUsuario = new app.app.models.modelUsuario(connection);

    modelUsuario.carregarTiposUsuarios(function(error, result){
        res.render('./admin/cadastroUsuario', {erros: {}, erro: {}, tipoUsuario: result, usuario: {}});
    })       
}

module.exports.cadastrar = function(app, req, res){

    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const dados = req.body;

    req.assert('nome', 'Preencher campo nome!').notEmpty();
    req.assert('email', 'Campo vazio!').notEmpty();
    req.assert('senha', 'Preencher campo Senha!').notEmpty();
    req.assert('senha', 'Senha deve conter no mínimo 7 digitos').len(7, 999);
    req.assert('confirmaSenha', 'Favor, confirme a sua senha!').notEmpty();

    const erros = req.validationErrors();

    if(erros){
        res.render('./admin/cadastroUsuario', {erros: erros, usuario: dados, tipoUsuario: {}});
        return erros;
    }

    if(dados.id_tipo_usuario != 0){
        
        if (dados.confirmaSenha == dados.senha){

            const connection = app.config.connection;
            const modelUsuario = new app.app.models.modelUsuario(connection);

            modelUsuario.admCadastrarUsuario(dados, function(error, result){
                res.redirect('/usuario')
            })
        }
        else{
            const erro = [{msg: 'As senha não conferem'}];
            res.render('./admin/cadastroUsuario', {erros: erros, usuario: dados, erro: erro, tipoUsuario: {}});
        }
    }
    else{
        const erro = [{msg: 'Selecione o Tipo de Usuario'}];
        res.render('./admin/cadastroUsuario', {erros: erros, usuario: dados, erro: erro, tipoUsuario: {}});
    }
}

module.exports.listar = function(app, req, res){
    
    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const connection = app.config.connection;
    const modelUsuario = new app.app.models.modelUsuario(connection);

    modelUsuario.carregarUsuarios(function(error, result){
        res.render('./admin/usuario', {usuario: result})
    })
}

module.exports.editar = function(app, req, res){

    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const idUsuario = req.params.idUsuario;

    const connection = app.config.connection;
    const modelUsuario = new app.app.models.modelUsuario(connection);

    modelUsuario.carregarTiposUsuarios(function(error, tipos){
        modelUsuario.carregarUsuario(idUsuario, function(error, result){
            res.render('./admin/editarUsuario', {usuario: result, tipoUsuario: tipos, erros: {}})
        })
    })
}

module.exports.editarUsuario = function(app, req, res){

    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const dados = req.body;

    req.assert('nome', 'Preencher campo nome!').notEmpty();
    req.assert('email', 'Campo vazio!').notEmpty();

    const erros = req.validationErrors();
    
    const connection = app.config.connection;
    const modelUsuario = new app.app.models.modelUsuario(connection);

    if(erros){
        modelUsuario.carregarTiposUsuarios(function(error, tipos){
        
            modelUsuario.carregarUsuario(dados.idUsuario, function(error, result){
                res.render('./admin/editarUsuario', {erros: erros, usuario: result, tipoUsuario: tipos});
            })
        })         
        return erros;
    }

    if(dados.senha.length || dados.confirmaSenha.length > 0){

        req.assert('senha', 'Senha deve conter no mínimo 7 digitos').len(7, 999);
        req.assert('confirmaSenha', 'Favor, confirme a sua senha!').notEmpty();

        const erros = req.validationErrors();

        if(erros){
            modelUsuario.carregarTiposUsuarios(function(error, tipos){
        
                modelUsuario.carregarUsuario(dados.idUsuario, function(error, result){
                    res.render('./admin/editarUsuario', {erros: erros, usuario: result, tipoUsuario: tipos});
                })
            })         
            return erros;
        }

        if (dados.confirmaSenha == dados.senha){
            modelUsuario.editarUsuarios(dados, function(error, result){
                modelUsuario.editarSenha(dados, function(error, result){
                    res.redirect('../usuario');
                })
            })
        }
        else{

            modelUsuario.carregarTiposUsuarios(function(error, tipos){
                const erro = [{msg: 'As senha não conferem'}];
                res.render('./admin/editarUsuario', {erros: erros, usuario: dados, erro: erro, tipoUsuario: tipos})
            })  
        }
    }
    else{
        modelUsuario.editarUsuarios(dados, function(error, result){
            res.redirect('/usuario');
        })
    }  
}

module.exports.excluirUsuario = function(app, req, res){
    
    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const idUsuario = req.params.idUsuario;

    const connection = app.config.connection;
    const modelUsuario = new app.app.models.modelUsuario(connection)

    modelUsuario.excluirUsuario(idUsuario, function(error, result){
        res.redirect('/usuario');
    })
}

module.exports.cadastroProduto = function(app, req, res){
    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    res.render('./admin/cadastroProduto', {produto: {}, erros: {}});
}

module.exports.cadastrarProduto = function(app, req, res){

    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const dados = req.body;

    req.assert('descricao', 'Inserir descrição do produto').notEmpty();
    req.assert('preco', 'Produto sem preço?').notEmpty();

    const erros = req.validationErrors();

    if(erros){
        res.render('./admin/cadastroProduto', {erros: erros, produto: dados});
        return erros;
    }

    const connection = app.config.connection;
    const modelProduto = new app.app.models.modelProduto(connection);

    modelProduto.cadastrarProduto(dados, function(error, result){
        modelProduto.carregarProdutos(function(error, result){
            res.render('./admin/produto', {produto: result});
        })
    })
}

module.exports.listarProduto = function(app, req, res){

    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const connection = app.config.connection;
    const modelProduto = new app.app.models.modelProduto(connection);

    modelProduto.carregarProdutos(function(error, result){
        res.render('./admin/produto', {produto: result});
    })
}

module.exports.edicaoProduto = async function(app, req, res){
    
    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const idProduto = req.params.idProduto;
    let produto

    const connection = app.config.connection;
    const modelProduto = new app.app.models.modelProduto(connection);

    produto = await modelProduto.carregarProduto(idProduto);

    res.render('./admin/editarProduto', {produto: produto, erros: {}});
}

module.exports.editarProduto = function(app, req, res){
    
    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const dados = req.body;

    req.assert('descricao', 'Inserir descrição do produto').notEmpty();
    req.assert('preco', 'Produto sem preço?').notEmpty();

    const erros = req.validationErrors();

    const connection = app.config.connection;
    const modelProduto = new app.app.models.modelProduto(connection);

    if(erros){
        modelProduto.carregarProdutos(function(error, result){
            res.render('./admin/editarProduto', {erros: erros, produto: result});
        })        
        return;
    }

    modelProduto.editarProduto(dados, function(error, result){
        modelProduto.carregarProdutos(function(error, result){
            res.render('./admin/produto', {produto: result});
        })
    })
}

module.exports.excluirProduto = function(app, req, res){

    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const idProduto = req.params.idProduto;

    const connection = app.config.connection;
    const modelProduto = new app.app.models.modelProduto(connection)

    modelProduto.excluirProduto(idProduto, function(error, result){
        res.redirect('/produto');
    })
}

module.exports.listarPedidosAbertos = function(app, req, res){
    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const connection = app.config.connection;
    const modelPedido = new app.app.models.modelPedido(connection);

    modelPedido.carregarPedidosAbertos(function(error, pedidoAberto){
        res.render('admin/pedidoAberto', {pedido: pedidoAberto});
    })
}

module.exports.listarCarrinho = function(app, req, res){

    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const connection = app.config.connection;
    const modelProduto = new app.app.models.modelProduto(connection);
    const modelPedido = new app.app.models.modelPedido(connection);

    const idPedido = req.params.idPedido;
    const idFormaPagamento = req.params.idFormaPagamento;
    
    modelPedido.carregarCarrinho(idPedido, async function(error, carrinho){
        
        let produto = [];
        let valorFinal = 0;

        for(let i = 0; i < carrinho.length; i++){
            const carregarProduto = await modelProduto.carregarProduto(carrinho[i].id_produto);
            valorFinal += carrinho[i].quantidade * carregarProduto[0].preco
            produto.push(carregarProduto[0]);
        }

        modelPedido.carregarFormaPagamento(idFormaPagamento, function(error, metodoPagamento){    
            res.render('admin/infoPedido', {produtos: produto, carrinho: carrinho, valorTotal:valorFinal, formaPagamento: metodoPagamento})
        })
    })
}

module.exports.carregarPedidos = function(app, req, res){

    if(req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const connection = app.config.connection;
    const modelPedido = new app.app.models.modelPedido(connection);
    const modelUsuario = new app.app.models.modelUsuario(connection);

    const pedido = []

    modelPedido.carregarPedidos(function(error, pedidos){

        for(let i = 0; i < pedidos.length; i++){
            modelUsuario.carregarUsuario(pedidos[i].id_usuario, function(error, usuario){
                modelPedido.carregarStatus(pedidos[i].id_status, function(error, status){
                    modelPedido.carregarFormaPagamento(pedidos[i].id_forma_pagamento, function(error, formaPagamento){

                        pedido.push({
                            id: pedidos[i].id,
                            usuario: usuario[0].nome,
                            status: status[0].descricao,
                            formaPagamento: formaPagamento[0].descricao
                        }) 
                        
                        if(i == pedidos.length -1){
                            res.render('admin/historicoPedidos', {pedido: pedido});
                        }
                    })
                })
            })   
        }
    })

    
}