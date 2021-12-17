module.exports.backWithValidationErrors=(req,res,err)=>
{
    var msg='Dogodila se greška';
    if(err.name=='AggregateError')//kada radimo bulkCreate onda dobijamo ovaj tip greske prilikom validaciji
    {
        msg="";
        for(var error of err.errors)
        {
            msg=msg.concat(' ',error.message);
        }
    }
    else//kada radimo obican(samo jedan) insert,delete,update onda ce se izvrsiti ovo
    {
        msg=err.message;
        
    }
    var str=msg.split('Validation error:').join(' ');//posto err.message pocinje svaku gresku sa ValidationError,ovako to izbacujemo iz stringa
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
module.exports.backIfUndefinedOrEmpty=(req,res,...data)=>
{
    for(var entry of data)
    {
        if(typeof entry==='undefined' || ((typeof entry==='string') && entry.length==0))
        {
            req.session.error='Niste uneli sve potrebne podatke';  
            res.redirect('back')
            return true;
        }
    }
    return false;

}