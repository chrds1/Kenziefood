import Api from "../controllers/Api.js";
import {Carrinho} from "../models/Carrinho.js";
    


class Produtos{
    static sectionProdutos = document.getElementById('container-produtos')
    static btnFrutas = document.getElementById('Frutas')
    static btnBebidas = document.getElementById('Bebidas')
    static btnPanificadora = document.getElementById('Panificadora')

    static async filtroProdutos(event) {
        event.preventDefault();

        const lista = await Api.produtosPublicos();
        if(event.target.id === "Todos"){
            Produtos.sectionProdutos.innerHTML = ""
            Produtos.listarProdutos();
        }else{
            const filtroCategoria = lista.filter((el)=>{
                return (el.categoria == event.target.innerText)
            });

            Produtos.sectionProdutos.innerHTML = ""
            Produtos.listarProdutos(filtroCategoria)
        }
        
    }

    static async listarProdutos(Array){
        let lista = []

        Array === undefined? lista = await Api.produtosPublicos(): lista = Array;

        lista.forEach(el => {
            const divProduto =       document.createElement('div');
            const imagemProduto =    document.createElement('img');
            const nomeProduto =      document.createElement('p');
            const descricaoProduto = document.createElement('p');
            const preco =            document.createElement('p');
            const iconeCarrinho =    document.createElement('button')
            const categoriaProduto = document.createElement('span')

            nomeProduto.innerText = el.nome;
            imagemProduto.src = el.imagem;
            imagemProduto.alt = 'Imagem produto';
            categoriaProduto.innerHTML = `${Produtos.categoria(el.categoria)}  ${el.categoria}`;
            descricaoProduto.innerText = el.descricao;
            preco.innerText = el.preco.toLocaleString('pt-BR',{style:'currency', currency:'BRL'} );
            iconeCarrinho.innerHTML = `<i class="fa-solid fa-cart-plus"></i>`

            iconeCarrinho.id = el.id;
            divProduto.classList.add('card-produto');
            imagemProduto.classList.add('img-produto');
            nomeProduto.classList.add('texto-nome');
            categoriaProduto.classList.add('btn-categoria');
            descricaoProduto.classList.add('texto-descricao');
            preco.classList.add('texto-preco');
            iconeCarrinho.classList.add('btn-carrinho');

            divProduto.append(imagemProduto, nomeProduto, descricaoProduto, categoriaProduto, preco, iconeCarrinho);
            Produtos.sectionProdutos.append(divProduto);

        });
         Produtos.addHandleFiltroCategoria();
         Produtos.addHandleCarrinho();
    }
    static categoria(el){
        if(el == "Frutas" || el == "frutas"){
            return `<i class="fa-solid fa-lemon"></i>`
        } else if(el == "Panificadora"|| el == "panificadora"){
            return `<i class="fa-solid fa-bread-slice"></i>`
        } else if(el == "Bebidas" || el == "bebidas"){
            return `<i class="fa-solid fa-wine-glass"></i>`
        } else{return ""} 
    }

    static addHandleFiltroCategoria(){
        const categoriaProduto = document.querySelectorAll('.btn-categoria')

        categoriaProduto.forEach(el => el.addEventListener('click', Produtos.filtroProdutos));
    }

    static addHandleCarrinho(){
        const addCarrinho = document.querySelectorAll('.btn-carrinho');
        
        addCarrinho.forEach(el => el.addEventListener('click', Produtos.receberDados));
    }

    static async receberDados(event){
        event.preventDefault();
        const id = event.currentTarget.id
        console.log(event.currentTarget)
        const lista = await Api.produtosPublicos();

        const filtro = await lista.filter(el => el.id === id)
        
        filtro.forEach((el)=>{
            Carrinho.criaItemCarrinho(el.imagem, el.nome, el.categoria, el.preco)
        })  
    }
}

Produtos.listarProdutos(Produtos.lista)