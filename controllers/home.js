module.exports = function(async,Club,_){
    return {
        SetRouting : function(router){
            router.get('/home',this.homePage);

        },
        homePage : function(req,res){
            async.parallel([
                function(callback){
                    Club.find({}, (err,result)=>{
                        callback(err,result);
                    })
                }
            ],(err,results)=>{
                const res1 = results[0];
                const dataChunk = [];
                const chunksize = 3;
                for(let i=0;i< res1.length;i+= chunksize){
                    dataChunk.push(res1.slice(i,i+chunksize));
                }
                console.log(res1);
                // console.log(dataChunk);
                res.render('home', {title : 'Footballkik-home', data: dataChunk});
            })
			
		}
    }
}