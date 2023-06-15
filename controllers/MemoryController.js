const Memory = require("../models/Memory");

const fs = require("fs");

const removeOidImage = (memory) => {
    fs.unlink(`public/${memory.src}`, (err) => {
        if(err) {
            console.log(err);
        }else{
            console.log("Imagem excluída do servidor")
        }
    })
}

const createMemory = async(req, res) => {

    try{

        const {title, description} = req.body;

        const src = `images/${req.file.filename}`

        if(!title || !description){
            return res.status(400).json({msg: "Por favor, preencha todos campos."})
        }

        const newMemory = new Memory({
            title, src, description
        })

        await newMemory.save();

        res.json({msg: "Memoria criada com sucesso", newMemory});


    }catch(err){
        console.log(err.message)
        res.status(500).send("Ocorreu um erro")
    }
}

const getMemories = async(req, res) => {
   try{
     const memories = await Memory.find();

     res.json(memories)
   }catch(err){
      res.status(500).send("Ocorreu um erro")
   }
}

const getMemory = async(req, res) => {
    try{
      const memory = await Memory.findById(req.params.id);

      if(!memory){
        return res.status(404).json({msg: "Memoria não encontrada!!"});
      }

      res.json(memory)
    }catch(err){
        res.status(500).send("Ocorreu um erro")
    }
}

const deleteMemory = async(req, res) => {
    try{
     const memory = await Memory.findByIdAndRemove(req.params.id);

     if(!memory) {
        return res.status(404).json({msg: "Memória não encontrada"})
    }

    removeOidImage(memory)

     res.json({msg: "Memória excluída"})
    }catch(err){
        res.status(500).send("Ocorreu um erro")
    }
}

const updateMemory = async(req, res) => {
    try{

        const {title, description} = req.body

        let src = null

        if(req.file){
            src = `images/${req.file.filename}`
        }

        const memory = await Memory.findById(req.params.id);

        if(!memory) {
            return res.status(404).json({msg: "Memória não encontrada"})
        }

        if(src){
            removeOidImage(memory)
        }

        const updateData = {}

        if(title) updateData.title = title
        if(description) updateData.description = description
        if(src) updateData.src = src

        const updateMemory = await Memory.findByIdAndUpdate(req.params.id, updateData, {new: true})

        res.json({updateMemory, msg: "Memória atualizada com sucesso!!"})

    }catch(err){
        console.log(err)
       res.status(500).send("Ocorreu um erro")
    }
}

const toggleFavorite = async(req, res) => {
    try{
        const memory = await Memory.findById(req.params.id);
   
        if(!memory) {
           return res.status(404).json({msg: "Memória não encontrada"})
       }
   
       memory.favorite = !memory.favorite

       await memory.save()
   
        res.json({msg: "Memória favoritada com sucesso", memory})
       }catch(err){
           res.status(500).send("Ocorreu um erro")
       }
}

const addComent = async(req, res) => {
    try{
        const {name, text} = req.body;

        if(!name || !text){
           return res.status(400).json({msg: "Por favor, preencha todos os campos."})
        }

        const comment = {name, text}

        const memory = await Memory.findById(req.params.id);
   
        if(!memory) {
           return res.status(404).json({msg: "Memória não encontrada"})
        }

        memory.commentes.push(comment)

        await memory.save()
   
   
        res.json({msg: "Comentário adicionado com sucesso", memory})
    }catch(err){
        res.status(500).send("Ocorreu um erro")
    }
}

module.exports = {
    createMemory,
    getMemories,
    getMemory,
    deleteMemory,
    updateMemory,
    toggleFavorite,
    addComent,
}