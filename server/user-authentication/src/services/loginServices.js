const login = (req,res)=>{
    console.log("login details")
    res.json(req.body)
}

export {login};