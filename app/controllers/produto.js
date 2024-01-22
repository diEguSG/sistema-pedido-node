module.exports.catalogo = function(app, req, res){

    if(req.session.id_tipo_usuario != 1){
        res.redirect('/telaLogin');
        return;
    }

    const connection = app.config.connection;
    const modelProduto = new app.app.models.modelProduto(connection);

    modelProduto.carregarProdutos(function(error, result){
        res.render('../views/produto/catalogo', {produtos: result, idPedido: req.session.id_pedido});
    })    
}

module.exports.adicionarCarrinho = function (app, req, res){

    if(req.session.id_tipo_usuario != 1){
        res.redirect('/telaLogin');
        return;
    }

    const connection = app.config.connection;
    const modelPedido = new app.app.models.modelPedido(connection);

    if(req.session.id_pedido == 0){

        const dados = [{
            id_usuario: req.session.id_usuario,
            id_status: "1"
        }]

        const id_produto = req.params.idProduto;

        modelPedido.criarPedido(dados, function(error, result){
            modelPedido.verificarIdPedido(function(error, result){
                req.session.id_pedido = result[0].id;
                adicionarItemCarrinho(id_produto);
            })  
        })
    }else{
        
        let dados = [{
            id_pedido: req.session.id_pedido,
            id_produto: req.params.idProduto
        }]

        modelPedido.verificarCarrinho(dados, function(error, result){

            if(result.length > 0){
                let quantidade = result[0].quantidade + 1
                modelPedido.atualizarItemCarrinho(dados, quantidade, function(error, result){
                    res.redirect('/catalogo');
                }) 
            }
            else{
                adicionarItemCarrinho(dados[0].id_produto);
            }
        })
    }

    function adicionarItemCarrinho(idProduto){
           
        const connection = app.config.connection;
        const modelPedido = new app.app.models.modelPedido(connection);
    
        const dadosCarrinho = [{
            id_produto: idProduto,
            id_pedido: req.session.id_pedido,
            quantidade: "1"
        }]
    
        modelPedido.adicionarItemCarrinho(dadosCarrinho, function(error, result){
            res.redirect('/catalogo');
        })   
    }
}

module.exports.listarItemCarrinho = function(app, req, res){

    if(req.session.id_tipo_usuario != 1){
        res.redirect('/telaLogin');
        return;
    }

    const connection = app.config.connection;
    const modelProduto = new app.app.models.modelProduto(connection);
    const modelPedido = new app.app.models.modelPedido(connection);

    const idPedido = req.session.id_pedido;

    modelPedido.carregarCarrinho(idPedido, async function(error, carrinho){
        
        let produto = [];
        let valorFinal = 0;

        for(let i = 0; i < carrinho.length; i++){
            const carregarProduto = await modelProduto.carregarProduto(carrinho[i].id_produto);
            valorFinal += carrinho[i].quantidade * carregarProduto[0].preco
            produto.push(carregarProduto[0]);
        }

        modelPedido.carregarFormasPagamentos(function(error, metodoPagamento){
            res.render('produto/carrinho', {produtos: produto, carrinho: carrinho, valorTotal:valorFinal, formaPagamento: metodoPagamento, erros: {}})
        })
    })
}

module.exports.adicionarQuantidadeItem = function (app, req, res){

    if(req.session.id_tipo_usuario != 1){
        res.redirect('/telaLogin');
        return;
    }

    const connection = app.config.connection;
    const modelPedido = new app.app.models.modelPedido(connection);

    // if(req.session.id_pedido == 0){

    //     const dados = [{
    //         id_usuario: req.session.id_usuario,
    //         id_status: "1"
    //     }]

    //     const id_produto = req.params.idProduto;

    //     modelPedido.criarPedido(dados, function(error, result){
    //         modelPedido.verificarIdPedido(function(error, result){
    //             req.session.id_pedido = result[0].id;
    //             adicionarItemCarrinho(id_produto);
    //         })  
    //     })
    // }else{
        
    let dados = [{
        id_pedido: req.session.id_pedido,
        id_produto: req.params.idProduto
    }]

    modelPedido.verificarCarrinho(dados, function(error, result){

        if(result.length > 0){
            let quantidade = result[0].quantidade + 1
            modelPedido.atualizarItemCarrinho(dados, quantidade, function(error, result){
                res.redirect('/carrinho');
            }) 
        }
    })
}

module.exports.removerQuantidadeItem = function (app, req, res){

    if(req.session.id_tipo_usuario != 1){
        res.redirect('/telaLogin');
        return;
    }

    const connection = app.config.connection;
    const modelPedido = new app.app.models.modelPedido(connection);

    // if(req.session.id_pedido == 0){

    //     const dados = [{
    //         id_usuario: req.session.id_usuario,
    //         id_status: "1"
    //     }]

    //     const id_produto = req.params.idProduto;

    //     modelPedido.criarPedido(dados, function(error, result){
    //         modelPedido.verificarIdPedido(function(error, result){
    //             req.session.id_pedido = result[0].id;
    //             adicionarItemCarrinho(id_produto);
    //         })  
    //     })
    // }else{
        
    let dados = [{
        id_pedido: req.session.id_pedido,
        id_produto: req.params.idProduto
    }]

    modelPedido.verificarCarrinho(dados, function(error, result){

        if(result.length > 0){
            let quantidade = result[0].quantidade - 1
            if(quantidade > 0){
                modelPedido.atualizarItemCarrinho(dados, quantidade, function(error, result){
                    res.redirect('/carrinho');
                }) 
            }
            else{
                removerItemCarrinho(dados[0].id_produto);
            }
        }
    })

    function removerItemCarrinho(idProduto){
           
        const connection = app.config.connection;
        const modelPedido = new app.app.models.modelPedido(connection);
    
        const dados = [{
            id_pedido: req.session.id_pedido,
            id_produto: idProduto
        }]
    
        modelPedido.removerItemCarrinho(dados, function(error, result){
            res.redirect('/carrinho');
        }) 
    }
}

module.exports.removerItemCarrinho = function(app, req, res){

    if(req.session.id_tipo_usuario != 1){
        res.redirect('/telaLogin');
        return;
    }

    const dados = [{
        id_pedido: req.session.id_pedido,
        id_produto: req.body.idProduto
    }]

    const connection = app.config.connection;
    const modelPedido = new app.app.models.modelPedido(connection);

    modelPedido.removerItemCarrinho(dados, function(error, result){
        res.redirect('/carrinho');
    })

}

module.exports.finalizarPedido = function(app, req, res){

    if(req.session.id_tipo_usuario != 1){
        res.redirect('/telaLogin');
        return;
    }

    const connection = app.config.connection;
    const modelProduto = new app.app.models.modelProduto(connection);
    const modelPedido = new app.app.models.modelPedido(connection);

    const idPedido = req.session.id_pedido;
    const idFormaPagamento = req.body.formaPagamento;

    modelPedido.carregarCarrinho(idPedido, async function(error, carrinho){
        
        let produto = [];
        let valorFinal = 0;

        for(let i = 0; i < carrinho.length; i++){
            const carregarProduto = await modelProduto.carregarProduto(carrinho[i].id_produto);
            valorFinal += carrinho[i].quantidade * carregarProduto[0].preco
            produto.push(carregarProduto[0]);
        }

        modelPedido.carregarFormaPagamento(idFormaPagamento, function(error, metodoPagamento){
            modelPedido.atualizarFormaPagamentoPedido(idFormaPagamento, idPedido, function(error, result){
                res.render('produto/confirmarPedido', {produtos: produto, carrinho: carrinho, valorTotal:valorFinal, formaPagamento: metodoPagamento})
            })
        })
    })
}

module.exports.confirmarPedido = function(app, req, res){
    
    if(req.session.id_tipo_usuario != 1 && req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    const connection = app.config.connection;
    const modelPedido = new app.app.models.modelPedido(connection);

    let idStatus = 0;
    if(req.session.id_tipo_usuario == 1){
        idStatus = 1
    }
    else{
        idStatus = 2
    }
    const idPedido = req.body.confirmarPedido;

    modelPedido.atualizarStatusPedido(idStatus, idPedido, function(error, result){
        
        if(req.session.id_tipo_usuario == 1){
            req.session.id_pedido = 0;
            res.redirect("/");
        }
        else{
            modelPedido.carregarPedidosAbertos(function(error, pedidoAberto){
                res.render('admin/pedidoAberto', {pedido: pedidoAberto});
            })
        }
    })
}

module.exports.cancelarPedido = function(app, req, res){
    
    if(req.session.id_tipo_usuario != 1 && req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin'); 
        return;
    }

    const connection = app.config.connection;
    const modelPedido = new app.app.models.modelPedido(connection);

    const idStatus = 3;
    const idPedido = req.body.cancelarPedido;

    modelPedido.atualizarStatusPedido(idStatus, idPedido, function(error, result){
        
        if(req.session.id_tipo_usuario == 1){
            req.session.id_pedido = 0;
            res.redirect("/telaLogin");
        }
        else{
            modelPedido.carregarPedidosAbertos(function(error, pedidoAberto){
                res.render('admin/pedidoAberto', {pedido: pedidoAberto});
            })
        }
    })
}