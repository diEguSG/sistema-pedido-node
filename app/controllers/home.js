module.exports.index = function (app, req, res){
    
    if(req.session.id_tipo_usuario != 1 && req.session.id_tipo_usuario != 2){
        res.redirect('/telaLogin');
        return;
    }

    res.render('./home/index', {tipoUsuario: req.session.id_tipo_usuario, idUsuario: req.session.id_usuario});
}