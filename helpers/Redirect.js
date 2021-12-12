module.exports.backWithValidationErrors=(req,res,err)=>
{
    var str=err.message.split('Validation error:').join(' ');//posto err.message pocinje svaku gresku sa ValidationError,ovako to izbacujemo iz stringa
    //str=str.split(',').join('\r\n')//TODO proveri zasto nece newline da radi
    req.session.error=str;
   
    res.redirect('back')

}
module.exports.backWithError=(req,res,err)=>
{
    req.session.error=err;  
    res.redirect('back')

}
module.exports.backWithSuccess=(req,res,msg)=>
{
    req.session.success=msg;  
    req.session.old_data="";
    res.redirect('back')

}
module.exports.backIfUndefined=(req,res,...data)=>
{
    for(var entry of data)
    {
        if(typeof entry==='undefined')
        {
            req.session.error='Niste uneli sve potrebne podatke';  
            res.redirect('back')
            return true;
        }
    }
    return false;

}