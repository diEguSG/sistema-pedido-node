module.exports.index = function (app, req, res){
    
    if(req.session.id_tipo_usuario != 1 && req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }
    
    const connection = app.config.connection;
    const modelPedido = new app.app.models.modelPedido(connection);
    
    modelPedido.verificarPedidoNovaSessao(req.session.id_usuario, function(error, result){
        if(result.length > 0){
            modelPedido.cancelarPedido(result[0].id, function(error, result){
                
            })
        }
        res.render('./home/index', {tipoUsuario: req.session.id_tipo_usuario, idUsuario: req.session.id_usuario, idPedido:req.session.id_pedido});
    })

    
}